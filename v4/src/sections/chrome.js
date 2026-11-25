import { gsap, ScrollTrigger } from '../lib/gsap.js'
import { NAV, BRAND } from '../data/site.js'
import { LOGO_PATHS, LOGO_VIEWBOX } from '../data/logo.js'
import { fitLogo } from './contact.js'

/* The fixed furniture: loader, nav, full-screen menu, progress hairline. */

const mark = (cls, label = '') =>
  `<svg class="${cls}" viewBox="${LOGO_VIEWBOX}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><path d="${LOGO_PATHS[0]}" /></svg>`

export function navHtml() {
  return `
    <a class="nav__brand" href="#top" data-scroll-to aria-label="${BRAND.name}, back to the top">
      ${mark('nav__mark')}
      <span>Maansar <em>Studios</em></span>
    </a>
    <nav class="nav__links" aria-label="Primary">
      ${NAV.map((n) => `<a href="${n.href}" data-scroll-to>${n.label}</a>`).join('')}
    </nav>
    <a class="btn btn--line btn--sm nav__cta" href="#contact" data-scroll-to>Enquire</a>
    <button class="nav__menu" type="button" aria-expanded="false" aria-controls="menu">
      <span class="label">Menu</span><span class="nav__burger" aria-hidden="true"><i></i><i></i></span>
    </button>`
}

export function menuHtml() {
  return `
    <nav class="menu__links" aria-label="Menu">
      ${[...NAV, { label: 'Enquire', href: '#contact' }]
        .map((n, i) => `<a href="${n.href}" data-scroll-to><span class="label">${String(i + 1).padStart(2, '0')}</span><span class="menu__word">${n.label}</span></a>`)
        .join('')}
    </nav>
    <a class="menu__ig label" href="${BRAND.instagram.url}" target="_blank" rel="noopener">${BRAND.instagram.handle}</a>`
}

export function loaderHtml() {
  return `<svg class="loader__logo" viewBox="${LOGO_VIEWBOX}">${LOGO_PATHS.map((d) => `<path d="${d}" />`).join('')}</svg>`
}

/** The loader draws the full logo in hairline, fills it, and lifts away. On a
 *  repeat visit in the same session it only lifts. Resolves when the page is ready
 *  to be revealed; `ready` is the hero photograph decoding. */
export function runLoader(loader, { reduced, ready }) {
  const logo = loader.querySelector('.loader__logo')
  fitLogo(logo)
  const paths = logo.querySelectorAll('path')
  let seen = false
  try {
    seen = sessionStorage.getItem('maansar-v4-intro') === '1'
    sessionStorage.setItem('maansar-v4-intro', '1')
  } catch {
    /* storage blocked */
  }

  if (reduced) {
    loader.remove()
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const tl = gsap.timeline({ paused: true })
    if (!seen) {
      tl.fromTo(paths, { drawSVG: 0, fillOpacity: 0 }, { drawSVG: '100%', duration: 1.7, stagger: 0.3, ease: 'power2.inOut' })
        .to(paths, { fillOpacity: 1, duration: 0.6, ease: 'power1.inOut' }, '-=0.5')
        .to(paths, { strokeOpacity: 0, duration: 0.4 }, '<')
    } else {
      gsap.set(paths, { fillOpacity: 1, strokeOpacity: 0 })
      tl.to({}, { duration: 0.25 })
    }
    tl.addLabel('lift')
      .add(() => {
        tl.pause()
        // Wait for the photograph, but never longer than a moment.
        Promise.race([ready, new Promise((r) => setTimeout(r, 1800))]).then(() => {
          resolve()
          tl.play()
        })
      })
      .to(logo, { yPercent: -30, opacity: 0, duration: 0.7, ease: 'power2.in' })
      .to(loader, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, '-=0.35')
      .add(() => loader.remove())
    tl.play()
  })
}

export function initNav({ nav, menu, scrollTo }) {
  fitLogo(nav.querySelector('.nav__mark'))
  const toggle = nav.querySelector('.nav__menu')
  menu.innerHTML = menuHtml()
  let open = false
  const words = menu.querySelectorAll('.menu__links a')

  const setMenu = (next) => {
    open = next
    toggle.setAttribute('aria-expanded', String(open))
    document.documentElement.classList.toggle('menu-open', open)
    if (open) {
      menu.hidden = false
      gsap.fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'expo.inOut' })
      gsap.fromTo(words, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.05, delay: 0.3 })
    } else {
      gsap.to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: 'expo.inOut', onComplete: () => (menu.hidden = true) })
    }
  }
  toggle.addEventListener('click', () => setMenu(!open))

  // All in-page anchors go through one scroll function (ScrollSmoother when it
  // is running, ScrollToPlugin otherwise).
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-scroll-to]')
    if (!a) return
    const id = a.getAttribute('href')
    const target = id === '#top' ? 0 : document.querySelector(id)
    if (target === null) return
    e.preventDefault()
    if (open) setMenu(false)
    scrollTo(target)
    history.replaceState(null, '', id === '#top' ? location.pathname : id)
  })

  // Hide on the way down, return on the way up; dark over dark sections.
  const progress = document.querySelector('.progress span')
  ScrollTrigger.create({
    refreshPriority: -1,
    start: 0,
    end: 'max',
    onUpdate(self) {
      progress.style.transform = `scaleX(${self.progress})`
      const y = self.scroll()
      nav.classList.toggle('is-scrolled', y > 40)
      if (!open) nav.classList.toggle('is-hidden', self.direction === 1 && y > window.innerHeight * 0.6)
    },
  })
  for (const dark of document.querySelectorAll('.section--dark')) {
    ScrollTrigger.create({
      trigger: dark,
      start: 'top 40px',
      end: 'bottom 40px',
      toggleClass: { targets: nav, className: 'is-dark' },
      // Measured after every pin above it has added its spacing.
      refreshPriority: -1,
    })
  }
}
