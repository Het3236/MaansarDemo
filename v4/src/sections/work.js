import { gsap } from '../lib/gsap.js'
import { img, SIZES, esc } from '../lib/media.js'
import { PROJECTS } from '../data/projects.js'
import { COVERS } from '../data/site.js'
import { headings, reveal } from '../lib/reveal.js'

/* Three houses on a rail. On desktop the section pins and scrolling slides the
   rail sideways; each cover photograph counter-drifts inside its frame, driven by
   the rail's own tween through `containerAnimation`. On phones the rail is simply
   a column. Opening a project is handled by project.js, which Flips the cover. */

const pad = (n) => String(n).padStart(2, '0')

export function html() {
  const projects = [...PROJECTS].sort((a, b) => a.order - b.order)
  return `
  <section class="work section" id="work" aria-labelledby="work-title">
    <div class="shell work__head">
      <p class="label" data-reveal>02 — Work</p>
      <h2 class="display" id="work-title" data-split>Three houses, each built around one idea.</h2>
      <p class="lede" data-reveal>Open a project to see all of it: every room we photographed, in the order you would walk through them.</p>
    </div>

    <div class="work__rail">
      <div class="shell work__bar" aria-hidden="true">
        <span class="label">Selected work</span>
        <span class="work__progress"><i></i></span>
        <span class="label work__count"><b>01</b> / ${pad(projects.length)}</span>
      </div>

      <ol class="work__track">
        ${projects
          .map(
            (p, i) => `
          <li class="panel">
            <button class="panel__media" type="button" data-open="${p.slug}" aria-label="Open ${esc(p.title)}">
              <span class="panel__img" data-flip-id="cover-${p.slug}">
                ${img(COVERS[p.slug] || p.cover, { alt: p.coverAlt, sizes: SIZES.panel, cls: 'panel__photo' })}
              </span>
              <span class="panel__open label" aria-hidden="true">Open</span>
            </button>
            <div class="panel__text">
              <p class="label">${pad(i + 1)} · ${[p.category, p.location].filter(Boolean).join(' · ')}</p>
              <h3 class="panel__title">${esc(p.title)}</h3>
              <p class="panel__summary">${esc(p.summary)}</p>
              <dl class="panel__facts">
                <div><dt class="label">Rooms</dt><dd>${esc(p.rooms)}</dd></div>
                <div><dt class="label">Materials</dt><dd>${esc(p.materials)}</dd></div>
              </dl>
              <button class="link-arrow" type="button" data-open="${p.slug}">
                See the project <span aria-hidden="true">→</span>
              </button>
            </div>
          </li>`,
          )
          .join('')}
      </ol>
    </div>
  </section>`
}

export function init(root, { reduced, desktop }) {
  const el = root.querySelector('.work')
  headings(el, { reduced })
  reveal(el, { reduced })
  if (reduced) return

  const rail = el.querySelector('.work__rail')
  const track = el.querySelector('.work__track')
  const panels = gsap.utils.toArray('.panel', track)
  const count = el.querySelector('.work__count b')
  const bar = el.querySelector('.work__progress i')

  if (!desktop) {
    for (const panel of panels) {
      gsap.from(panel.querySelector('.panel__img'), {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 1.3,
        scrollTrigger: { trigger: panel, start: 'top 82%', once: true },
      })
    }
    return
  }

  const distance = () => track.scrollWidth - rail.clientWidth

  const slide = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: rail,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
      onUpdate(self) {
        bar.style.transform = `scaleX(${self.progress})`
        const i = Math.min(panels.length - 1, Math.round(self.progress * (panels.length - 1)))
        const label = pad(i + 1)
        if (count.textContent !== label) count.textContent = label
      },
    },
  })

  // Parallax inside each frame, positioned against the horizontal tween.
  for (const panel of panels) {
    gsap.fromTo(
      panel.querySelector('.panel__photo'),
      { xPercent: -6 },
      {
        xPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: slide,
          start: 'left right',
          end: 'right left',
          scrub: true,
        },
      },
    )
    gsap.from(panel.querySelectorAll('.panel__text > *'), {
      y: 30,
      opacity: 0,
      stagger: 0.07,
      duration: 1,
      scrollTrigger: { trigger: panel, containerAnimation: slide, start: 'left 70%', once: true },
    })
  }
}
