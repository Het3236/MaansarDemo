import './styles.css'
import { gsap, ScrollTrigger, ScrollSmoother, Draggable, MQ, prefersReduced } from './lib/gsap.js'
import * as hero from './sections/hero.js'
import * as studio from './sections/studio.js'
import * as work from './sections/work.js'
import * as film from './sections/film.js'
import * as materials from './sections/materials.js'
import * as process from './sections/process.js'
import * as contact from './sections/contact.js'
import { createProject } from './sections/project.js'
import { navHtml, loaderHtml, runLoader, initNav } from './sections/chrome.js'

const $ = (id) => document.getElementById(id)
const main = $('main')
const reducedAtLoad = prefersReduced()

// 1. Markup. Every section is a string template over the data modules.
main.innerHTML = [hero, studio, work, film, materials, process, contact].map((s) => s.html()).join('')
$('footer').innerHTML = contact.footerHtml()
$('nav').innerHTML = navHtml()
$('loader').innerHTML = loaderHtml()
history.scrollRestoration = 'manual'

const heroCtl = hero.create(main)
let smoother = null

// 2. Everything that depends on the viewport or on motion preference is built
//    inside one gsap.matchMedia call, in page order. When a condition flips
//    (a resize across 900px, a change to reduced motion) GSAP reverts every tween,
//    ScrollTrigger, pin and SplitText made here, and this runs again from clean.
const mm = gsap.matchMedia()
// matchMedia only calls back when at least one condition matches, so desktop and
// mobile are both listed even though only `desktop` is read.
mm.add({ desktop: MQ.desktop, mobile: MQ.mobile, reduced: MQ.reduced }, (ctx) => {
  const { desktop, reduced } = ctx.conditions

  // Smooth scroll on pointer devices; native scroll on touch. None at all for
  // reduced motion — easing the scroll is a motion effect like any other.
  smoother = reduced
    ? null
    : ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.1,
        effects: true,
        smoothTouch: false,
      })

  const cleanups = [
    heroCtl.scroll({ reduced }),
    studio.init(main, { reduced, desktop }),
    work.init(main, { reduced, desktop }),
    film.init(main, { reduced, desktop }),
    materials.init(main, { reduced, desktop }),
    process.init(main, { reduced, desktop }),
    contact.init(main, { reduced, desktop }),
  ]

  return () => {
    cleanups.forEach((fn) => typeof fn === 'function' && fn())
    smoother?.kill()
    smoother = null
  }
})

// 3. The fixed chrome and the project dialog live outside matchMedia; they ask
//    for the current smoother when they need it.
const scrollTo = (target) => {
  const reduced = prefersReduced()
  if (smoother) smoother.scrollTo(target, !reduced, 'top top')
  else gsap.to(window, { scrollTo: { y: target, autoKill: true }, duration: reduced ? 0 : 1.2, ease: 'power3.inOut' })
}
initNav({ nav: $('nav'), menu: $('menu'), scrollTo })
const project = createProject({ dialog: $('project'), getSmoother: () => smoother, reduced: reducedAtLoad })

// 4. Reveal. Hold the scroll until the loader lifts, then play the hero in.
document.documentElement.classList.remove('js')
const heroImg = main.querySelector('.hero__media img')
const ready = Promise.all([
  heroImg.decode?.().catch(() => {}),
  document.fonts?.ready,
])

smoother?.paused(true)
document.documentElement.classList.add('is-loading')
runLoader($('loader'), { reduced: reducedAtLoad, ready }).then(() => {
  document.documentElement.classList.remove('is-loading')
  smoother?.paused(false)
  heroCtl.intro({ reduced: reducedAtLoad })
  ScrollTrigger.refresh()
  project.fromHash()
})

// Fonts change line lengths, which moves every trigger below the fold.
document.fonts?.ready.then(() => ScrollTrigger.refresh())

if (import.meta.env.DEV) {
  window.__v4 = { gsap, ScrollTrigger, Draggable, get smoother() { return smoother }, project }
}
