import { gsap } from '../lib/gsap.js'
import { STEPS } from '../data/site.js'
import { headings, reveal } from '../lib/reveal.js'

/* How a house gets made, drawn as it is described. The section pins, and one
   scrubbed timeline builds a floor plan in four passes, one per stage:

     01 walk-through  outer walls and survey ticks draw; a dot walks the route in
                      from the front door (DrawSVG + MotionPath)
     02 plan          interior walls, doors and windows
     03 joinery       wardrobes, counters, the temple unit, furniture
     04 handover      rooms fill, lights come on

   The plan is a diagram of a generic house, not a drawing of a client's home,
   and carries no dimensions. */

const pad = (n) => String(n).padStart(2, '0')

const PLAN = `
<svg class="plan" viewBox="0 0 640 470" role="img" aria-labelledby="plan-title">
  <title id="plan-title">A floor plan drawn in four stages: walls, rooms, joinery, then light.</title>

  <g class="plan__tints">
    <rect x="40" y="40" width="220" height="160" />
    <rect x="260" y="40" width="100" height="100" />
    <rect x="40" y="200" width="300" height="220" />
    <rect x="340" y="240" width="260" height="180" />
  </g>

  <g class="plan__site">
    <path class="wall" d="M520 420 H40 V40 H600 V420 H570" />
    <path class="dim" d="M40 20 H600 M40 14 V26 M600 14 V26 M20 40 V420 M14 40 H26 M14 420 H26" />
  </g>

  <path class="plan__route" d="M545 452 V260 C545 230 530 215 500 215 H280 C240 215 220 212 220 190 V130 C220 110 200 100 170 100" />

  <g class="plan__walls">
    <path class="wall" d="M40 200 H200 M240 200 H260" />
    <path class="wall" d="M260 40 V200" />
    <path class="wall" d="M360 40 V140 M260 140 H290 M330 140 H360" />
    <path class="wall" d="M470 40 V140 M470 140 H520 M560 140 H600" />
    <path class="wall" d="M340 330 V420" />
    <path class="door" d="M240 200 V160 A40 40 0 0 0 200 200" />
    <path class="door" d="M330 140 V180 A40 40 0 0 1 290 140" />
    <path class="door" d="M560 140 V180 A40 40 0 0 1 520 140" />
    <path class="door" d="M570 420 V370 A50 50 0 0 0 520 420" />
    <path class="window" d="M34 260 V360 M46 260 V360" />
    <path class="window" d="M90 34 H200 M90 46 H200" />
    <path class="window" d="M380 414 H480 M380 426 H480" />
  </g>

  <g class="plan__joinery">
    <path d="M44 60 H70 V180 H44 M44 60 L70 180" />
    <path d="M150 44 H230 V144 H150 Z M150 66 H230" />
    <path d="M290 44 H330 V66 H290 Z M300 66 V58 A10 10 0 0 1 320 58 V66" />
    <path d="M70 420 V404 H210 V420" />
    <path d="M130 300 H250 V328 H158 V398 H130 Z" />
    <path d="M178 346 H238 V382 H178 Z" />
    <path d="M470 420 V396 H572 V250 H600" />
    <path d="M390 290 H460 V334 H390 Z M398 282 H414 M436 282 H452 M398 342 H414 M436 342 H452" />
    <path d="M560 50 H592 V100 H560 Z" />
  </g>

  <g class="plan__lights">
    ${[
      [110, 120], [200, 170], [310, 100], [110, 260], [260, 250], [210, 400],
      [425, 312], [400, 180], [535, 90], [520, 320],
    ]
      .map(([x, y]) => `<g class="light" transform="translate(${x} ${y})"><circle class="light__glow" r="16" /><circle r="3.5" /></g>`)
      .join('')}
  </g>

  <g class="plan__labels" aria-hidden="true">
    <text x="84" y="186">Bedroom</text>
    <text x="276" y="128">Temple</text>
    <text x="70" y="236">Living</text>
    <text x="380" y="262">Dining</text>
    <text x="494" y="130">Bath</text>
  </g>

  <circle class="plan__walker" r="6" />
</svg>`

export function html() {
  return `
  <section class="process section" id="process" aria-labelledby="process-title">
    <div class="process__stage shell">
      <div class="process__copy">
        <p class="label" data-reveal>05 — How it goes</p>
        <h2 class="display" id="process-title" data-split>Four stages, in this order, every time.</h2>
        <ol class="steps">
          ${STEPS.map(
            (s, i) => `
            <li class="step${i === 0 ? ' is-active' : ''}">
              <span class="step__bar" aria-hidden="true"><i></i></span>
              <span class="label step__n">${pad(i + 1)}</span>
              <div>
                <h3 class="step__title">${s.title}</h3>
                <div class="step__more"><p class="step__body">${s.body}</p></div>
              </div>
            </li>`,
          ).join('')}
        </ol>
      </div>
      <div class="process__drawing">${PLAN}</div>
    </div>
  </section>`
}

export function init(root, { reduced }) {
  const el = root.querySelector('.process')
  headings(el, { reduced })
  reveal(el, { reduced })
  if (reduced) {
    el.classList.add('is-static')
    return
  }

  const svg = el.querySelector('.plan')
  const q = (s) => svg.querySelectorAll(s)
  const steps = gsap.utils.toArray('.step', el)
  const bars = steps.map((s) => s.querySelector('.step__bar i'))
  const route = svg.querySelector('.plan__route')
  const walker = svg.querySelector('.plan__walker')

  gsap.set(q('.plan__site path, .plan__walls path, .plan__joinery path, .plan__route'), { drawSVG: '0%' })
  gsap.set(q('.plan__tints rect, .plan__labels text'), { opacity: 0 })
  gsap.set(q('.light'), { scale: 0, transformOrigin: '50% 50%' })
  gsap.set(walker, { opacity: 0 })

  let current = 0
  const setStep = (i) => {
    if (i === current) return
    current = i
    steps.forEach((s, n) => s.classList.toggle('is-active', n === i))
  }

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: el.querySelector('.process__stage'),
      start: 'top top',
      end: () => `+=${window.innerHeight * 3.2}`,
      pin: true,
      scrub: 0.7,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const t = self.progress * tl.duration() // one unit per stage, plus the hold
        setStep(Math.min(3, Math.floor(t)))
        bars.forEach((b, n) => (b.style.transform = `scaleY(${gsap.utils.clamp(0, 1, t - n)})`))
      },
    },
  })

  // 01 — the walk-through
  tl.to(q('.plan__site path'), { drawSVG: '100%', duration: 0.8, stagger: 0.1, ease: 'power1.inOut' }, 0)
    .set(walker, { opacity: 1 }, 0.15)
    .to(route, { drawSVG: '100%', duration: 0.8 }, 0.15)
    .to(walker, { motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5] }, duration: 0.8 }, 0.15)
  // 02 — the plan
    .to(q('.plan__walls .wall'), { drawSVG: '100%', duration: 0.5, stagger: 0.06 }, 1)
    .to(q('.plan__walls .door, .plan__walls .window'), { drawSVG: '100%', duration: 0.4, stagger: 0.05 }, 1.35)
    .to(route, { opacity: 0.25, duration: 0.4 }, 1.2)
  // 03 — the joinery
    .to(q('.plan__joinery path'), { drawSVG: '100%', duration: 0.5, stagger: 0.07 }, 2)
  // 04 — the handover
    .to(q('.plan__tints rect'), { opacity: 1, duration: 0.5, stagger: 0.08 }, 3)
    .to(q('.light'), { scale: 1, duration: 0.3, stagger: 0.05, ease: 'back.out(2)' }, 3.15)
    .to(q('.plan__labels text'), { opacity: 1, duration: 0.3, stagger: 0.05 }, 3.4)
    .to([walker, route], { opacity: 0, duration: 0.3 }, 3.2)
    .to({}, { duration: 0.3 }) // a short hold on the finished house
}
