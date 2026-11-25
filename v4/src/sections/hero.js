import { gsap, ScrollTrigger, SplitText } from '../lib/gsap.js'
import { img } from '../lib/media.js'
import { BRAND } from '../data/site.js'

/* The opening: a limewash wall with one arched opening cut into it, and the
   Mehsana Bungalow living room visible through the arch. Scrolling pushes you
   through the doorway — MorphSVG turns the arch into a rectangle bigger than the
   screen, the wall is gone, and you are standing in the room.

   The wall is an SVG rect masked by the arch, not a CSS clip-path on the photo.
   That keeps the photograph an ordinary responsive <img>, and the only thing that
   morphs is one path in pixel space, rebuilt from the viewport on every refresh. */

export function html() {
  return `
  <section class="hero" id="top" aria-labelledby="hero-title">
    <div class="hero__media">
      ${img('hero-living-terracotta', {
        alt: 'Living room in Mehsana Bungalow with a textured terracotta panel wall, a low pale sofa and a marble coffee table',
        eager: true,
      })}
    </div>

    <svg class="hero__wall" aria-hidden="true" focusable="false">
      <defs>
        <mask id="hero-mask" maskUnits="userSpaceOnUse">
          <rect class="hero__mask-ground" fill="#fff" />
          <path class="hero__hole" fill="#000" />
        </mask>
      </defs>
      <rect class="hero__ground" mask="url(#hero-mask)" />
      <path class="hero__outline" fill="none" />
    </svg>

    <div class="hero__copy shell">
      <p class="label hero__label">${BRAND.tagline} — Gujarat</p>
      <h1 class="hero__title" id="hero-title">A house is a sequence of rooms.</h1>
      <div class="hero__foot">
        <p class="hero__lede">Walk in. Three homes, as they were built, in the order you would meet them.</p>
        <a class="hero__cue" href="#studio" data-scroll-to>
          <span class="label">Scroll to enter</span>
          <span class="hero__cue-line" aria-hidden="true"><i></i></span>
        </a>
      </div>
    </div>

    <p class="hero__caption label">Mehsana Bungalow — living room</p>
  </section>`
}

/* Geometry, in CSS pixels of the hero itself. Both shapes are written with the same
   commands in the same order (M L C C L Z), so the morph is point-for-point and never
   has to guess how to match the arch's curve to the rectangle's corners. */
function geometry(w, h) {
  const desktop = w >= 900
  // On a phone the arch sits above the heading and has to leave room for it.
  const aw = desktop ? Math.min(w * 0.3, h * 0.44) : Math.min(w * 0.56, h * 0.3)
  const ah = desktop ? h * 0.66 : aw * 1.3
  const cx = desktop ? w * 0.7 : w / 2
  const top = desktop ? h * 0.2 : Math.max(h * 0.11, 80)
  return { aw, ah, cx, top, bottom: top + ah }
}

// A semicircle as two cubic Béziers: k is the standard quarter-circle handle ratio.
const K = 0.5523
function archPath({ aw, cx, top, bottom }) {
  const r = aw / 2
  const x0 = cx - r
  const x1 = cx + r
  const spring = top + r
  return `M${x0},${bottom} L${x0},${spring} C${x0},${spring - r * K} ${cx - r * K},${top} ${cx},${top} C${cx + r * K},${top} ${x1},${spring - r * K} ${x1},${spring} L${x1},${bottom} Z`
}

function roomPath(w, h) {
  const b = 4 // bleed, so no hairline of wall survives antialiasing at the edge
  const x0 = -b
  const x1 = w + b
  const y0 = -b
  const y1 = h + b
  const cx = w / 2
  return `M${x0},${y1} L${x0},${y0} C${x0},${y0} ${cx},${y0} ${cx},${y0} C${cx},${y0} ${x1},${y0} ${x1},${y0} L${x1},${y1} Z`
}

export function create(root) {
  const el = root.querySelector('.hero')
  const svg = el.querySelector('.hero__wall')
  const hole = el.querySelector('.hero__hole')
  const outline = el.querySelector('.hero__outline')
  const title = el.querySelector('.hero__title')

  const size = () => {
    const w = el.clientWidth
    const h = el.clientHeight
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
    // The wall overhangs the hero by a few pixels so no sliver of photograph
    // shows along an edge when the height is fractional.
    for (const r of svg.querySelectorAll('rect')) {
      r.setAttribute('x', -8)
      r.setAttribute('y', -8)
      r.setAttribute('width', w + 16)
      r.setAttribute('height', h + 16)
    }
    return { w, h, arch: archPath(geometry(w, h)), room: roomPath(w, h) }
  }

  let dims = size()
  hole.setAttribute('d', dims.arch)
  outline.setAttribute('d', dims.arch)

  // Keep the drawing in step with the viewport before any trigger measures.
  ScrollTrigger.addEventListener('refreshInit', () => {
    dims = size()
  })

  let introPlayed = false

  return {
    /** Runs once, after the loader: the arch draws itself, the room fades up
     *  inside it, the heading rises line by line. */
    intro({ reduced }) {
      SplitText.create(title, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'line',
        autoSplit: true,
        onSplit(self) {
          if (introPlayed || reduced) return
          return gsap.from(self.lines, { yPercent: 105, duration: 1.2, stagger: 0.09, delay: 0.35 })
        },
      })

      if (reduced) {
        introPlayed = true
        return gsap.timeline()
      }

      const tl = gsap.timeline({ onComplete: () => (introPlayed = true) })
      tl.fromTo(outline, { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 1.6, ease: 'power2.inOut' }, 0)
        .from(el.querySelector('.hero__media img'), { scale: 1.35, opacity: 0, duration: 1.8 }, 0.5)
        .from(el.querySelectorAll('.hero__label, .hero__foot > *'), { y: 16, opacity: 0, duration: 1, stagger: 0.08 }, 0.7)
      return tl
    },

    /** The scroll: through the doorway. */
    scroll({ reduced }) {
      if (reduced) return
      const media = el.querySelector('.hero__media img')

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      // Function-based values are re-read on every refresh, so a resize mid-page
      // rebuilds both ends of the morph from the new viewport.
      tl.fromTo(
        [hole, outline],
        { morphSVG: () => dims.arch },
        { morphSVG: () => dims.room, ease: 'power2.in', duration: 1 },
        0,
      )
        .fromTo(media, { scale: 1.12 }, { scale: 1, duration: 1 }, 0)
        .to(outline, { opacity: 0, duration: 0.35 }, 0.55)
        .to(el.querySelector('.hero__copy'), { yPercent: -18, opacity: 0, duration: 0.45 }, 0)
        .fromTo(el.querySelector('.hero__caption'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.2 }, 0.8)

      return () => {
        tl.scrollTrigger?.kill()
        tl.kill()
        gsap.set([hole, outline], { clearProps: 'all' })
        hole.setAttribute('d', dims.arch)
        outline.setAttribute('d', dims.arch)
      }
    },

  }
}
