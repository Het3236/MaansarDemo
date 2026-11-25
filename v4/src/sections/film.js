import { gsap } from '../lib/gsap.js'
import { loop, esc } from '../lib/media.js'
import { REELS, BRAND } from '../data/site.js'
import { headings, reveal } from '../lib/reveal.js'

/* The dark room. Six muted walk-through loops, stacked like prints on a table.
   The section pins; each scroll step slides the next clip up over the last, which
   settles back and dims. An index on the left names the room on screen.

   Only the clip in front plays. Every other <video> is paused, and a clip does not
   receive its src until it is next or current, so the page never downloads six
   videos to show one. */

const pad = (n) => String(n).padStart(2, '0')

export function html() {
  return `
  <section class="film section--dark" id="film" aria-labelledby="film-title">
    <div class="film__stage">
      <div class="shell film__grid">
        <div class="film__copy">
          <p class="label" data-reveal>03 — In motion</p>
          <h2 class="display" id="film-title" data-split>Rooms hold still. Light does not.</h2>
          <p class="film__lede" data-reveal>
            Six muted loops, cut from the studio's walk-throughs — the closest thing to
            standing in the doorway at the hour the room was made for.
          </p>
          <ol class="film__index" aria-label="Rooms in this reel">
            ${REELS.map(
              (r, i) => `
              <li class="${i === 0 ? 'is-active' : ''}">
                <span class="label">${pad(i + 1)}</span>
                <span class="film__room">${esc(r.room)}</span>
                <span class="film__project">${esc(r.project)}</span>
              </li>`,
            ).join('')}
          </ol>
          <a class="film__more link-arrow" href="${BRAND.instagram.url}" target="_blank" rel="noopener">More rooms on ${BRAND.instagram.handle} <span aria-hidden="true">↗</span></a>
        </div>

        <div class="film__deck">
          ${REELS.map((r, i) => {
            const m = loop(r.key)
            return `
            <figure class="reel" data-i="${i}">
              <div class="reel__frame">
                <video muted loop playsinline preload="none" poster="${m.poster}" data-src="${m.src}"
                  aria-label="${esc(`${r.room}, ${r.project}`)}"></video>
              </div>
              <figcaption>
                <span>${esc(r.note)}</span>
                <span class="label">${pad(i + 1)} / ${pad(REELS.length)}</span>
              </figcaption>
            </figure>`
          }).join('')}
        </div>
      </div>
    </div>
  </section>`
}

const lowPower = () =>
  navigator.connection?.saveData ||
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
  (navigator.deviceMemory && navigator.deviceMemory <= 2)

export function init(root, { reduced }) {
  const el = root.querySelector('.film')
  const reels = gsap.utils.toArray('.reel', el)
  const videos = reels.map((r) => r.querySelector('video'))
  const items = gsap.utils.toArray('.film__index li', el)
  headings(el, { reduced })
  reveal(el, { reduced })

  // Reduced motion, or a device that should not decode video: the deck becomes a
  // grid of posters with native controls, and nothing plays by itself.
  if (reduced) {
    el.classList.add('is-static')
    videos.forEach((v) => {
      v.controls = true
      v.src = v.dataset.src
    })
    return
  }

  const quiet = lowPower()
  let active = -1

  const focus = (index) => {
    if (index === active) return
    active = index
    items.forEach((li, i) => li.classList.toggle('is-active', i === index))
    videos.forEach((v, i) => {
      const near = i === index || i === index + 1
      if (near && !v.src && !quiet) v.src = v.dataset.src
      if (i === index && !quiet) v.play().catch(() => {})
      else v.pause()
    })
  }

  gsap.set(reels.slice(1), { yPercent: 115 })

  const steps = reels.length - 1
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: el.querySelector('.film__stage'),
      start: 'top top',
      end: () => `+=${steps * window.innerHeight * 0.75}`,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onToggle(self) {
        if (!self.isActive) return videos.forEach((v) => v.pause())
        active = -1 // force the current clip to play again on re-entry
        focus(Math.round(self.progress * steps))
      },
      onUpdate: (self) => focus(Math.round(self.progress * steps)),
    },
  })

  reels.forEach((reel, i) => {
    if (i === 0) return
    tl.to(reel, { yPercent: 0, duration: 1, ease: 'power1.inOut' }, i - 1)
      .to(reels[i - 1], { scale: 0.88, yPercent: -4, filter: 'brightness(0.45)', duration: 1, ease: 'power1.inOut' }, i - 1)
  })
}
