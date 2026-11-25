import { gsap, Flip, ScrollTrigger, SplitText } from '../lib/gsap.js'
import { img, SIZES, esc } from '../lib/media.js'
import { PROJECTS } from '../data/projects.js'
import { COVERS, BRAND } from '../data/site.js'

/* A project, opened over the page.

   The cover on the rail and the hero of the open project share a data-flip-id.
   Flip records where the cover is, the overlay is rendered, and Flip.from() moves
   the new hero out of the old cover's box — so the photograph you clicked is the
   photograph that grows into the page. Closing uses Flip.fit() to send the hero
   back onto the cover, because the cover sits inside a clipped, transformed rail
   and cannot itself be animated out of it.

   The overlay has its own scroller. ScrollSmoother is paused while it is open and
   the gallery reveals are ScrollTriggers bound to that scroller, created per open
   inside a gsap.context and reverted on close. */

const ordered = () => [...PROJECTS].sort((a, b) => a.order - b.order)

function render(p) {
  const list = ordered()
  const next = list[(list.indexOf(p) + 1) % list.length]
  const cover = COVERS[p.slug] || p.cover
  return `
    <div class="project__backdrop" aria-hidden="true"></div>
    <button class="project__close" type="button" data-close>
      <span class="label">Close</span><span class="project__x" aria-hidden="true"></span>
    </button>
    <div class="project__scroller" data-scroller>
      <!-- The slot holds the height while Flip takes the hero out of flow. -->
      <div class="project__slot">
        <div class="project__hero" data-flip-id="cover-${p.slug}">
          ${img(cover, { alt: p.coverAlt, sizes: SIZES.full, eager: true })}
        </div>
      </div>

      <div class="project__body">
        <header class="shell project__head">
          <p class="label" data-in>${[p.category, p.location].filter(Boolean).join(' · ')}</p>
          <h2 class="display project__title" id="project-title">${esc(p.title)}</h2>
          <p class="project__intro" data-in>${esc(p.intro)}</p>
        </header>

        <div class="shell project__story">
          <div class="project__text">
            ${p.story.map((para) => `<p data-in>${esc(para)}</p>`).join('')}
          </div>
          <dl class="project__facts" data-in>
            <div><dt class="label">Rooms</dt><dd>${esc(p.rooms)}</dd></div>
            <div><dt class="label">Materials</dt><dd>${esc(p.materials)}</dd></div>
          </dl>
        </div>

        <ul class="shell project__gallery">
          ${p.gallery
            .map(
              (g) => `
            <li class="project__shot${g.wide ? ' is-wide' : ''}">
              <figure>
                <div class="project__frame">${img(g.slug, { alt: g.alt, sizes: g.wide ? SIZES.half : SIZES.third })}</div>
                <figcaption>${esc(g.alt)}</figcaption>
              </figure>
            </li>`,
            )
            .join('')}
        </ul>

        <footer class="shell project__foot">
          <a class="link-arrow" href="${BRAND.instagram.url}" target="_blank" rel="noopener">More on ${BRAND.instagram.handle} <span aria-hidden="true">↗</span></a>
          <button class="project__next" type="button" data-next="${next.slug}">
            <span class="label">Next house</span>
            <span class="project__next-title">${esc(next.title)} <span aria-hidden="true">→</span></span>
          </button>
        </footer>
      </div>
    </div>`
}

export function createProject({ dialog, getSmoother, reduced }) {
  let current = null
  let ctx = null
  let trigger = null
  let busy = false
  let local = [] // this open's ScrollTriggers, refreshed once the dialog is visible

  const coverFor = (slug) => document.querySelector(`.panel__img[data-flip-id="cover-${slug}"]`)

  const lock = (on) => {
    const smoother = getSmoother()
    if (smoother) smoother.paused(on)
    document.documentElement.classList.toggle('is-locked', on)
  }

  function mountContent(p) {
    ctx?.revert()
    local = []
    dialog.innerHTML = render(p)
    current = p
    const scroller = dialog.querySelector('[data-scroller]')

    ctx = gsap.context(() => {
      if (reduced) return
      SplitText.create(dialog.querySelector('.project__title'), {
        type: 'lines',
        mask: 'lines',
        linesClass: 'line',
        autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, { yPercent: 105, duration: 1.1, stagger: 0.08, delay: 0.25 }),
      })
      gsap.from(dialog.querySelectorAll('.project__head [data-in]'), { y: 24, opacity: 0, duration: 1, stagger: 0.08, delay: 0.4 })

      local = ScrollTrigger.batch(dialog.querySelectorAll('.project__story [data-in], .project__shot'), {
        scroller,
        start: 'top 92%',
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(batch, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.07, overwrite: true }),
      })
      gsap.set(dialog.querySelectorAll('.project__story [data-in], .project__shot'), { opacity: 0 })

      const drift = gsap.fromTo(
        dialog.querySelector('.project__hero img'),
        { yPercent: 0 },
        { yPercent: 16, ease: 'none', scrollTrigger: { scroller, trigger: '.project__hero', start: 'top top', end: 'bottom top', scrub: true } },
      )
      local.push(drift.scrollTrigger)
    }, dialog)

    dialog.querySelector('[data-close]').addEventListener('click', () => close())
    dialog.querySelector('[data-next]').addEventListener('click', (e) => swap(e.currentTarget.dataset.next))
  }

  function open(slug, { from, push = true } = {}) {
    const p = PROJECTS.find((x) => x.slug === slug)
    if (!p || busy) return
    busy = true
    trigger = from || document.activeElement
    const cover = coverFor(slug)
    const state = cover && !reduced ? Flip.getState(cover) : null

    mountContent(p)
    dialog.hidden = false
    // Triggers created while the dialog was display:none measured nothing.
    local.forEach((t) => t.refresh())
    lock(true)
    if (push && location.hash !== `#work/${slug}`) history.pushState({ project: slug }, '', `#work/${slug}`)

    const hero = dialog.querySelector('.project__hero')
    const done = () => {
      busy = false
      dialog.querySelector('[data-close]').focus({ preventScroll: true })
    }

    if (reduced) {
      gsap.set(dialog.querySelector('.project__backdrop'), { opacity: 1 })
      return done()
    }

    const tl = gsap.timeline({ onComplete: done })
    tl.fromTo(dialog.querySelector('.project__backdrop'), { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' }, 0)
      .from(dialog.querySelector('.project__close'), { opacity: 0, y: -10, duration: 0.6 }, 0.5)
      .from(dialog.querySelector('.project__body'), { y: 60, opacity: 0, duration: 1 }, 0.35)

    if (state) {
      tl.add(Flip.from(state, { targets: hero, duration: 1.05, ease: 'plaster', scale: false, absolute: true, zIndex: 3 }), 0)
    } else {
      tl.from(hero, { opacity: 0, duration: 0.8 }, 0)
    }
  }

  function swap(slug) {
    const p = PROJECTS.find((x) => x.slug === slug)
    if (!p || busy) return
    busy = true
    const scroller = dialog.querySelector('[data-scroller]')
    history.replaceState({ project: slug }, '', `#work/${slug}`)
    gsap.to(scroller, {
      opacity: 0,
      duration: reduced ? 0 : 0.45,
      ease: 'power1.in',
      onComplete() {
        mountContent(p)
        local.forEach((t) => t.refresh())
        gsap.set(dialog.querySelector('.project__backdrop'), { opacity: 1 })
        const s = dialog.querySelector('[data-scroller]')
        gsap.fromTo(s, { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.6, onComplete: () => (busy = false) })
        dialog.querySelector('[data-close]').focus({ preventScroll: true })
      },
    })
  }

  function close({ fromHistory = false } = {}) {
    if (dialog.hidden || busy) return
    busy = true
    const slug = current.slug
    const scroller = dialog.querySelector('[data-scroller]')
    const hero = dialog.querySelector('.project__hero')
    const cover = coverFor(slug)

    const finish = () => {
      ctx?.revert()
      ctx = null
      dialog.hidden = true
      dialog.innerHTML = ''
      current = null
      lock(false)
      busy = false
      ;(trigger && document.contains(trigger) ? trigger : cover?.closest('button'))?.focus({ preventScroll: true })
    }

    if (!fromHistory && history.state?.project) history.back()
    else if (!fromHistory) history.replaceState(null, '', '#work')

    if (reduced) return finish()

    const heroVisible = scroller.scrollTop < hero.offsetHeight * 0.5
    const tl = gsap.timeline({ onComplete: finish })
    tl.to(dialog.querySelectorAll('.project__body, .project__close'), { opacity: 0, duration: 0.35, ease: 'power1.in' }, 0)
      .to(dialog.querySelector('.project__backdrop'), { opacity: 0, duration: 0.7, ease: 'power1.inOut' }, 0.25)

    if (cover && heroVisible) {
      tl.add(Flip.fit(hero, cover, { duration: 0.9, ease: 'plaster', scale: false, absolute: true }), 0.1)
    } else {
      tl.to(hero, { opacity: 0, duration: 0.5 }, 0)
    }
  }

  // Wiring: clicks anywhere on the page, Escape, and the back button.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-open]')
    if (!btn) return
    e.preventDefault()
    open(btn.dataset.open, { from: btn })
  })
  document.addEventListener('keydown', (e) => {
    if (dialog.hidden) return
    if (e.key === 'Escape') close()
    if (e.key === 'Tab') {
      // Keep focus inside the dialog.
      const f = dialog.querySelectorAll('button, a[href]')
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        last.focus()
        e.preventDefault()
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus()
        e.preventDefault()
      }
    }
  })
  window.addEventListener('popstate', () => {
    const slug = location.hash.match(/^#work\/(.+)$/)?.[1]
    if (slug && !current) open(slug, { push: false })
    else if (slug && current && slug !== current.slug) swap(slug)
    else if (!slug && current) close({ fromHistory: true })
  })

  return {
    open,
    close,
    /** Deep link: `/#work/<slug>` opens straight into the project. */
    fromHash() {
      const slug = location.hash.match(/^#work\/(.+)$/)?.[1]
      if (slug) open(slug, { push: false })
    },
  }
}
