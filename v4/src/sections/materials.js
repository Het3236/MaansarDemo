import { gsap, Draggable } from '../lib/gsap.js'
import { img, SIZES, esc } from '../lib/media.js'
import { MATERIALS } from '../data/site.js'
import { headings, reveal } from '../lib/reveal.js'

/* The material board: six samples on a rail you can pick up and throw.
   Draggable moves it, InertiaPlugin carries the throw, and the landing snaps to
   the nearest card edge. The same positions drive the arrow buttons and the arrow
   keys, so the rail is fully usable without a pointer. */

export function html() {
  return `
  <section class="materials section" id="materials" aria-labelledby="materials-title">
    <div class="shell materials__head">
      <div>
        <p class="label" data-reveal>04 — What it is made of</p>
        <h2 class="display" id="materials-title" data-split>Six materials, used until they mean something.</h2>
      </div>
      <div class="materials__controls" data-reveal>
        <p class="lede">Every one of them is in the photographs above. Drag the board, or use the arrows.</p>
        <div class="materials__buttons">
          <button type="button" class="round" data-dir="-1" aria-label="Previous material">←</button>
          <button type="button" class="round" data-dir="1" aria-label="Next material">→</button>
        </div>
      </div>
    </div>

    <div class="materials__viewport" tabindex="0" aria-roledescription="carousel" aria-label="Materials — use left and right arrow keys">
      <ul class="materials__rail">
        ${MATERIALS.map(
          (m, i) => `
          <li class="swatch" aria-label="${i + 1} of ${MATERIALS.length}: ${esc(m.name)}">
            <div class="swatch__photo">${img(m.slug, { alt: m.alt, sizes: SIZES.card })}</div>
            <div class="swatch__meta">
              <span class="swatch__chip" style="background:${m.swatch}" aria-hidden="true"></span>
              <div>
                <h3 class="swatch__name">${esc(m.name)}</h3>
                <p class="swatch__note">${esc(m.note)}</p>
              </div>
            </div>
          </li>`,
        ).join('')}
      </ul>
    </div>
    <div class="shell"><div class="materials__track" aria-hidden="true"><i></i></div></div>
    <div class="drag-cursor" aria-hidden="true"><span class="label">Drag</span></div>
  </section>`
}

export function init(root, { reduced }) {
  const el = root.querySelector('.materials')
  headings(el, { reduced })
  reveal(el, { reduced })

  const viewport = el.querySelector('.materials__viewport')
  const rail = el.querySelector('.materials__rail')
  const cards = gsap.utils.toArray('.swatch', rail)
  const bar = el.querySelector('.materials__track i')
  const cursor = el.querySelector('.drag-cursor')

  // Everything below is torn down when gsap.matchMedia re-runs the page setup.
  const ac = new AbortController()
  const on = { signal: ac.signal }

  let stops = []
  let minX = 0
  const measure = () => {
    const pad = parseFloat(getComputedStyle(rail).paddingLeft) || 0
    minX = Math.min(0, viewport.clientWidth - rail.scrollWidth)
    stops = cards.map((c) => Math.max(minX, -(c.offsetLeft - pad)))
    if (!stops.includes(minX)) stops.push(minX)
  }
  measure()

  const progress = () => {
    const x = gsap.getProperty(rail, 'x')
    bar.style.transform = `scaleX(${minX ? x / minX : 0})`
  }

  const [drag] = Draggable.create(rail, {
    type: 'x',
    bounds: { minX, maxX: 0 },
    inertia: true,
    edgeResistance: 0.85,
    dragClickables: true,
    zIndexBoost: false,
    snap: (v) => gsap.utils.snap(stops, v),
    onDrag: progress,
    onThrowUpdate: progress,
    onPress() {
      el.classList.add('is-grabbing')
    },
    onRelease() {
      el.classList.remove('is-grabbing')
    },
  })

  // Bounds are functions of the layout; re-measure when it changes.
  const onResize = () => {
    measure()
    drag.applyBounds({ minX, maxX: 0 })
    const x = gsap.getProperty(rail, 'x')
    gsap.set(rail, { x: gsap.utils.snap(stops, gsap.utils.clamp(minX, 0, x)) })
    progress()
  }
  window.addEventListener('resize', onResize, on)

  const go = (dir) => {
    const x = gsap.getProperty(rail, 'x')
    const i = stops.indexOf(gsap.utils.snap(stops, x))
    const target = stops[gsap.utils.clamp(0, stops.length - 1, i + dir)]
    gsap.to(rail, { x: target, duration: reduced ? 0 : 0.9, onUpdate: progress, onComplete: () => drag.update() })
  }
  el.querySelectorAll('[data-dir]').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.dir)), on))
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      go(e.key === 'ArrowRight' ? 1 : -1)
    }
  }, on)

  // A small "Drag" disc that trails the pointer over the board, on mouse only.
  let hideCursor = () => {}
  if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.45, ease: 'power3' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.45, ease: 'power3' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      xTo(e.clientX - r.left)
      yTo(e.clientY - r.top)
    }
    const show = (e) => {
      const r = el.getBoundingClientRect()
      gsap.set(cursor, { x: e.clientX - r.left, y: e.clientY - r.top })
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.4 })
    }
    hideCursor = () => gsap.to(cursor, { scale: 0.4, opacity: 0, duration: 0.3 })
    gsap.set(cursor, { scale: 0.4, opacity: 0 })
    viewport.addEventListener('pointermove', move, on)
    viewport.addEventListener('pointerenter', show, on)
    viewport.addEventListener('pointerleave', hideCursor, on)
  }

  if (!reduced) {
    gsap.from(cards, {
      x: 120,
      opacity: 0,
      duration: 1.3,
      stagger: 0.07,
      scrollTrigger: { trigger: viewport, start: 'top 85%', once: true },
    })
  }

  return () => {
    ac.abort()
    hideCursor()
    drag.kill()
    gsap.set(rail, { clearProps: 'transform' })
  }
}
