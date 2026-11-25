import { useEffect, useRef, useState } from 'react'
import { gsap } from '../utils/gsap'
import Figure from '../components/Figure'
import { SplitLines } from '../components/Reveal'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { useScrollTo } from '../hooks/useSmoothScroll'
import { BRAND } from '../data/site'

// Three rooms, cross-faded slowly. All three are real photographs, cropped for
// the hero so the studio's own watermark does not collide with the copy.
const FRAMES = [
  { slug: 'hero-living-teak', alt: 'Double-height living room in teak and lime plaster by Maansar Studios' },
  { slug: 'hero-living-terracotta', alt: 'Living room with a textured terracotta panel wall' },
  { slug: 'mb-photo-bedroom', alt: 'Bedroom with walnut panelling and a gallery wall of small prints' },
]

export default function Hero({ started }) {
  const root = useRef(null)
  // The outgoing frame stays fully opaque underneath while the incoming one
  // fades in over it — a straight cross-dissolve would dip through the dark
  // background and wash both rooms out at the midpoint.
  const [{ cur, prev }, setFrame] = useState({ cur: 0, prev: null })
  const reduced = useReducedMotion()
  const scrollTo = useScrollTo()

  // Slow cross-fade between the three rooms.
  useEffect(() => {
    if (reduced || !started) return
    const id = window.setInterval(
      () => setFrame((f) => ({ cur: (f.cur + 1) % FRAMES.length, prev: f.cur })),
      5600,
    )
    return () => window.clearInterval(id)
  }, [reduced, started])

  // Entrance, then a gentle parallax as you leave.
  useEffect(() => {
    if (!started) return
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.fromTo(
          '[data-hero-media]',
          { scale: 1.14 },
          { scale: 1, duration: 2.2, ease: 'power3.out' },
        )
        gsap.fromTo(
          '[data-hero-fade]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.1, delay: 0.55, ease: 'power3.out' },
        )
        gsap.to('[data-hero-media]', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to('[data-hero-copy]', {
          yPercent: -18,
          opacity: 0.15,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
        })
      }
    }, el)

    return () => ctx.revert()
  }, [started, reduced])

  return (
    <section
      ref={root}
      data-nav-dark
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink"
      aria-label="Introduction"
    >
      <div data-hero-media className="absolute inset-0">
        {FRAMES.map((f, i) => {
          const isCur = i === cur
          const isPrev = i === prev
          return (
            <div
              key={f.slug}
              className="absolute inset-0"
              style={{
                opacity: isCur || isPrev ? 1 : 0,
                zIndex: isCur ? 2 : isPrev ? 1 : 0,
                transition: isCur ? 'opacity 1500ms cubic-bezier(0.22,1,0.36,1)' : 'none',
              }}
              aria-hidden={isCur ? undefined : 'true'}
            >
              <Figure
                slug={f.slug}
                alt={i === 0 ? f.alt : ''}
                sizes="100vw"
                priority={i === 0}
                className="h-full w-full"
                imgClassName="[object-position:50%_42%]"
              />
            </div>
          )
        })}
      </div>

      {/* Two washes: one for the copy at the base, one to keep the nav legible. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(42,35,32,0.88) 0%, rgba(42,35,32,0.46) 34%, rgba(42,35,32,0.12) 58%, rgba(42,35,32,0.34) 82%, rgba(42,35,32,0.62) 100%)',
        }}
        aria-hidden="true"
      />

      <div data-hero-copy className="shell relative z-10 pb-12 pt-[calc(var(--nav-h)+3rem)] md:pb-16">
        <p data-hero-fade className="label-light mb-7 md:mb-9">
          {BRAND.tagline}
        </p>

        <SplitLines
          as="h1"
          text="Rooms that hold their quiet."
          animate="immediate"
          delay={0.18}
          stagger={0.085}
          className="d1 max-w-[12ch] font-display text-limewash"
        />

        <div className="mt-9 flex flex-col gap-8 md:mt-12 md:flex-row md:items-end md:justify-between">
          <p
            data-hero-fade
            className="max-w-[46ch] text-body text-limewash/80 md:text-body-lg"
          >
            {BRAND.proposition}
          </p>

          <div data-hero-fade className="flex shrink-0 items-center gap-6">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault()
                scrollTo('#work')
              }}
              className="border border-limewash/40 px-6 py-4 text-label-lg uppercase tracking-label text-limewash
                transition-colors duration-400 ease-arch hover:border-limewash hover:bg-limewash hover:text-ink"
            >
              See the work
            </a>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-limewash-16 pt-6 md:mt-16">
          <button
            type="button"
            onClick={() => scrollTo('#studio')}
            className="label-light -my-2 flex items-center gap-3 py-2 transition-colors duration-400 hover:!text-terracotta"
          >
            <span className="relative block h-8 w-px overflow-hidden bg-limewash/30" aria-hidden="true">
              <span className="absolute inset-x-0 top-0 h-3 animate-[drift_2.6s_ease-in-out_infinite] bg-terracotta" />
            </span>
            Scroll
          </button>

          <div className="flex gap-2" role="tablist" aria-label="Hero images">
            {FRAMES.map((f, i) => (
              <button
                key={f.slug}
                type="button"
                role="tab"
                aria-selected={i === cur}
                aria-label={`Show image ${i + 1}`}
                onClick={() => setFrame((f) => (f.cur === i ? f : { cur: i, prev: f.cur }))}
                className="group flex h-11 w-8 items-center justify-center"
              >
                <span
                  className={`block h-px transition-all duration-600 ease-arch
                    ${i === cur ? 'w-6 bg-terracotta' : 'w-3 bg-limewash/40 group-hover:bg-limewash'}`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
