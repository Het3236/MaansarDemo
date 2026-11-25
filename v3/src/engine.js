// The flight — scroll drives time in a chain of real walkthrough clips.
//
// Adapted from the scrub engine in scroll-world by oso95
// (https://github.com/oso95/scroll-world, MIT). What is kept from it, because each
// one fixes a real failure: clips are fetched as Blobs so they are always seekable
// regardless of byte-range support; seeks are coalesced so a fast flick cannot pile
// up decodes; the poster stays up until the video has painted, and videos are primed
// on first touch, which is what stops iOS showing a blank scene; height-only resizes
// are ignored on touch so the URL bar cannot yank the page; `linger` remaps time so
// the camera settles while the copy peaks.
//
// What changed for this site:
//   - The footage is 9:16. On desktop it plays in a portrait aperture beside the copy,
//     with a blurred wash of the current frame filling the room around it. On phones
//     the aperture is the whole screen, so the mobile version is native, not a crop.
//   - Seams come in two kinds. A seam with a generated connector is frame-matched, so
//     it switches almost instantly. A seam without one is a cut between two real
//     rooms, so it gets a longer dissolve with a slight forward push — the outgoing
//     room grows past you as the next one arrives.
//   - Styling lives in styles.css with the rest of the brand, not injected.

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x) }
// f(0)=0 and f(1)=1 for any L, so seam frames are never moved.
const lingerEase = (x, L) => { const c = x - 0.5; return (1 - L) * x + L * (4 * c * c * c + 0.5) }

export function mountFlight(root, { scenes, connectors = [], connScroll = 0.9, seamFade = 0.07, cutFade = 0.55 }) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = matchMedia('(hover: none) and (pointer: coarse)').matches
  const smallMQ = matchMedia('(max-width: 860px)')
  const isMobile = () => coarse || smallMQ.matches
  const N = scenes.length

  // ---- the chain: scene0, [conn0], scene1, [conn1], … sceneN-1 ----
  const SEG = []
  scenes.forEach((s, i) => {
    const seg = {
      kind: 'scene', si: i, w: s.scroll || 1.3, linger: reduce ? 0 : s.linger || 0,
      clip: `/media/scenes/${s.id}.mp4`, clipM: `/media/scenes/${s.id}-m.mp4`,
      still: `/media/scenes/${s.id}.webp`, stillM: `/media/scenes/${s.id}-m.webp`,
    }
    SEG.push(seg)
    s._seg = seg
    const c = connectors[i]
    if (i < N - 1 && c) {
      SEG.push({
        kind: 'conn', si: i, w: connScroll, linger: 0, clip: c.clip, clipM: c.clipMobile,
        still: `/media/scenes/${scenes[i + 1].id}.webp`, stillM: `/media/scenes/${scenes[i + 1].id}-m.webp`,
      })
    }
  })
  // A boundary touching a connector is frame-matched; one between two scenes is a cut.
  SEG.forEach((s, k) => {
    const prev = SEG[k - 1], next = SEG[k + 1]
    s.fadeIn = !prev ? 0 : (prev.kind === 'conn' || s.kind === 'conn') ? seamFade : cutFade
    s.fadeOut = !next ? 0 : (next.kind === 'conn' || s.kind === 'conn') ? seamFade : cutFade
    s.cut = s.fadeIn === cutFade
  })

  // ---- DOM ----
  const $ = (tag, cls, parent) => { const n = document.createElement(tag); if (cls) n.className = cls; if (parent) parent.appendChild(n); return n }

  const ambient = $('canvas', 'fl-ambient', root)
  ambient.width = 54; ambient.height = 96
  ambient.setAttribute('aria-hidden', 'true')
  const actx = ambient.getContext('2d', { alpha: false })

  const aperture = $('div', 'fl-aperture', root)
  aperture.setAttribute('aria-hidden', 'true')
  const frameEl = $('div', 'fl-frame', aperture)
  const caption = $('div', 'fl-caption', root)
  const capProject = $('span', 'fl-caption__project', caption)
  const capRoom = $('span', 'fl-caption__room', caption)
  const capBar = $('i', 'fl-caption__bar', caption)

  const copyLayer = $('div', 'fl-copylayer', root)
  const rail = $('nav', 'fl-rail', root)
  rail.setAttribute('aria-label', 'Rooms')
  const progress = $('div', 'fl-progress', root)
  const progressFill = $('span', '', progress)
  const hint = $('div', 'fl-hint', root)
  hint.innerHTML = '<i></i><span>Scroll to walk through</span>'
  const track = $('div', 'fl-track', root)

  const posterMobile = isMobile()
  SEG.forEach((s) => {
    s.el = $('div', 'fl-scene', frameEl)
    s.img = $('img', 'fl-scene__still', s.el)
    s.img.alt = ''
    s.img.decoding = 'async'
    s.img.src = posterMobile ? s.stillM : s.still
    Object.assign(s, { video: null, loading: false, ready: false, cur: 0, target: 0, visible: false, op: 0 })
  })

  const copies = scenes.map((s, i) => {
    const a = $('article', 'fl-copy', copyLayer)
    a.innerHTML =
      `<p class="fl-copy__meta"><span>${pad(i + 1)} / ${pad(N)}</span><span>${esc(s.project)}</span></p>` +
      `<p class="fl-copy__eyebrow">${esc(s.eyebrow)}</p>` +
      (i === 0 ? `<h1 class="fl-copy__title">${esc(s.title)}</h1>` : `<h2 class="fl-copy__title">${esc(s.title)}</h2>`) +
      `<p class="fl-copy__body">${esc(s.body)}</p>` +
      (s.cta ? `<div class="fl-copy__cta">${cta(s.cta)}</div>` : '')
    return a
  })

  const dots = scenes.map((s, i) => {
    const b = $('button', 'fl-rail__item', rail)
    b.type = 'button'
    b.innerHTML = `<span class="fl-rail__num">${pad(i + 1)}</span><span class="fl-rail__label">${esc(s.label)}</span>`
    b.addEventListener('click', () => jumpTo(i))
    return b
  })

  // ---- layout ----
  let vh = innerHeight, laidOutW = innerWidth, totalW = 0, active = -1, ticking = false

  function layout() {
    vh = innerHeight
    laidOutW = innerWidth
    let off = 0
    SEG.forEach((s) => { s.start = off * vh; off += s.w; s.end = off * vh })
    totalW = off
    // One extra screen, so the last clip finishes before the contact panel's edge
    // enters from below and its CTA is never covered mid-flight.
    track.style.height = `${(totalW + 1) * vh}px`
    read()
  }

  function jumpTo(i) {
    const seg = scenes[i]._seg
    scrollTo({ top: seg.start + (seg.end - seg.start) * 0.5, behavior: reduce ? 'auto' : 'smooth' })
  }

  function loadClip(s) {
    if (reduce || s.loading) return
    s.loading = true
    fetch(isMobile() && s.clipM ? s.clipM : s.clip)
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(r.status))))
      .then((blob) => {
        const v = document.createElement('video')
        v.className = 'fl-scene__video'
        v.muted = true
        v.playsInline = true
        v.preload = 'auto'
        v.setAttribute('muted', '')
        v.setAttribute('playsinline', '')
        v.src = URL.createObjectURL(blob)
        v.addEventListener('loadedmetadata', () => { s.ready = true; read() })
        // Hide the poster only once a frame has really painted (iOS stays blank otherwise).
        const reveal = () => s.el.classList.add('has-clip')
        v.addEventListener('seeked', reveal, { once: true })
        v.addEventListener('loadeddata', () => {
          try { v.pause() } catch {}
          if (!coarse) reveal()
          if (userReady) prime(v)
        })
        s.el.appendChild(v)
        s.video = v
      })
      .catch(() => { s.loading = false })
  }

  function read() {
    const y = scrollY
    let top = 0

    for (let k = 0; k < SEG.length; k++) {
      const s = SEG[k]
      if (y > s.start - 1.8 * vh && y < s.end + 1.8 * vh) loadClip(s)

      const local = clamp((y - s.start) / (s.end - s.start))
      s.target = s.linger ? lingerEase(local, s.linger) : local

      // In: fades up across a band centred on its start. Out: stays opaque until the
      // next segment (stacked above it) has fully covered it.
      const fin = s.fadeIn * vh, fout = s.fadeOut * vh
      const inMix = fin ? smooth((y - (s.start - fin / 2)) / fin) : 1
      const outMix = fout ? smooth((y - (s.end - fout / 2)) / fout) : 0
      const gone = fout ? y >= s.end + fout / 2 : false
      const op = gone ? 0 : inMix
      s.op = op
      s.visible = op > 0.001
      s.el.style.opacity = op
      s.el.style.visibility = s.visible ? 'visible' : 'hidden'
      s.el.style.zIndex = 10 + k
      if (op > 0.5) top = k // the room that owns the screen, for caption and rail

      if (!reduce) {
        // The forward push through a cut: arriving rooms start a touch small, leaving
        // rooms grow past the viewer. Frame-matched seams get no push.
        const pushIn = s.cut ? 0.94 + 0.06 * inMix : 1
        const pushOut = s.fadeOut === cutFade ? 1 + 0.12 * outMix : 1
        s.el.style.transform = `scale(${(pushIn * pushOut).toFixed(4)})`
      }
    }
    topSeg = SEG[top]

    for (let i = 0; i < N; i++) {
      const seg = scenes[i]._seg
      const pr = clamp((y - seg.start) / (seg.end - seg.start))
      const before = y < seg.start, after = y > seg.end
      let op
      if (i === 0) op = after ? 0 : smooth(1 - (pr - 0.35) / 0.4) // greets on landing
      else if (i === N - 1) op = before ? 0 : smooth((pr - 0.12) / 0.3) // holds the CTA
      else op = before || after ? 0 : smooth(1 - Math.abs(pr - 0.5) / 0.42)
      const c = copies[i]
      c.style.opacity = op
      c.style.visibility = op > 0.001 ? 'visible' : 'hidden'
      c.style.transform = reduce ? 'none' : `translate3d(0, ${((0.5 - pr) * 3.5).toFixed(2)}vh, 0)`
      c.classList.toggle('is-live', op > 0.5)
    }

    const cur = topSeg
    const near = cur.kind === 'scene' ? cur.si : (y - cur.start) / (cur.end - cur.start) > 0.5 ? cur.si + 1 : cur.si
    if (near !== active) {
      active = near
      dots.forEach((d, k) => d.classList.toggle('is-active', k === near))
      dots.forEach((d, k) => (k === near ? d.setAttribute('aria-current', 'step') : d.removeAttribute('aria-current')))
      capProject.textContent = scenes[near].project
      capRoom.textContent = scenes[near].label
    }
    const aSeg = scenes[near]._seg
    capBar.style.transform = `scaleX(${clamp((y - aSeg.start) / (aSeg.end - aSeg.start)).toFixed(3)})`
    progressFill.style.transform = `scaleX(${clamp(y / (totalW * vh)).toFixed(4)})`
    hint.style.opacity = clamp(1 - y / (0.35 * vh))
    // Leaving the flight: the fixed layers step back as the contact panel scrolls over.
    const exit = clamp((y - totalW * vh) / (0.5 * vh))
    root.style.setProperty('--fl-exit', exit.toFixed(3))
    document.body.classList.toggle('is-past-flight', exit >= 1)
    ticking = false
  }

  let topSeg = SEG[0]
  let ambientTick = 0
  function raf() {
    const eps = isMobile() ? 0.02 : 0.008
    for (const s of SEG) {
      const v = s.video
      if (!v || !s.ready || v.seeking) continue // never queue a seek on an unfinished one
      if (!s.visible && Math.abs(s.cur - s.target) < 0.002) continue
      s.cur += (s.target - s.cur) * (reduce ? 1 : 0.2)
      const t = clamp(s.cur, 0, 0.999) * (v.duration || 1)
      if (Math.abs(v.currentTime - t) > eps) { try { v.currentTime = t } catch {} }
    }
    // The room around the aperture takes its light from the frame on screen.
    if (!isMobile() && (ambientTick++ & 1) === 0) paintAmbient()
    requestAnimationFrame(raf)
  }

  function paintAmbient() {
    const s = topSeg
    const src = s.video && s.el.classList.contains('has-clip') ? s.video : s.img
    if (!(src.videoWidth || src.naturalWidth)) return
    try {
      actx.globalAlpha = 0.35 // eases between rooms instead of snapping
      actx.drawImage(src, 0, 0, ambient.width, ambient.height)
    } catch {}
  }

  // iOS decodes a muted video reliably only after a gesture: prime each on first touch.
  let userReady = false
  function prime(v) {
    if (!isMobile() || !v) return
    try { const p = v.play(); if (p && p.then) p.then(() => v.pause()).catch(() => {}) } catch {}
  }
  const onGesture = () => { if (userReady) return; userReady = true; SEG.forEach((s) => prime(s.video)) }
  addEventListener('pointerdown', onGesture, { once: true, passive: true })
  addEventListener('touchstart', onGesture, { once: true, passive: true })

  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(read) } }, { passive: true })
  addEventListener('resize', () => { if (coarse && innerWidth === laidOutW) return; layout() })
  addEventListener('orientationchange', layout)
  addEventListener('load', layout)
  layout()
  requestAnimationFrame(raf)
  if (import.meta.env.DEV) window.__flight = { SEG, jumpTo }
}

function pad(n) { return String(n).padStart(2, '0') }
function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]) }
function cta({ primary, secondary }) {
  const ext = (h) => (/^https?:/.test(h) ? ' target="_blank" rel="noopener"' : '')
  return (
    (primary ? `<a class="btn btn--solid" href="${esc(primary.href)}"${ext(primary.href)}>${esc(primary.label)}</a>` : '') +
    (secondary ? `<a class="btn btn--line" href="${esc(secondary.href)}"${ext(secondary.href)}>${esc(secondary.label)}</a>` : '')
  )
}
