import { useEffect, useRef } from 'react'
import { gsap } from '../utils/gsap'
import Figure from '../components/Figure'
import Reveal, { SplitLines } from '../components/Reveal'
import { useReducedMotion } from '../hooks/useMediaQuery'

// Four positions, stated plainly. Large numerals, no icons, no cards.
const POSITIONS = [
  {
    n: '01',
    title: 'We measure before we draw',
    body: 'Every plan starts from a survey of the actual space — ceiling heights, beam drops, where the plumbing already runs. Drawings that ignore the site get rebuilt on the site.',
  },
  {
    n: '02',
    title: 'One idea per room',
    body: 'A room holds a single strong move: a teak headboard wall, an indigo theatre, a lit vitrine two storeys tall. Everything else is kept plain so the move reads.',
  },
  {
    n: '03',
    title: 'Storage disappears into wall',
    body: 'Wardrobes run floor to ceiling, handleless, in a finish that continues the wall. Storage stops being furniture and the floor stays clear.',
  },
  {
    n: '04',
    title: 'We stay until it is finished',
    body: 'Design and execution are the same job here. We are on site through joinery, wiring, painting and snagging, so the drawing and the built room match.',
  },
]

export default function Approach() {
  const root = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-position]').forEach((row) => {
        gsap.fromTo(
          row.querySelector('[data-position-rule]'),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 86%', once: true },
          },
        )
      })
      gsap.fromTo(
        '[data-approach-media] img',
        { scale: 1.12 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-approach-media]',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="approach"
      ref={root}
      data-nav-dark
      className="section-pad relative scroll-mt-20 bg-ink text-limewash"
      aria-labelledby="approach-heading"
    >
      <div className="shell">
        <Reveal className="mb-14 flex items-baseline gap-6 md:mb-20">
          <span className="label-light shrink-0">03 — How we work</span>
          <span className="block h-px w-full bg-limewash-16" />
        </Reveal>

        <div className="grid gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SplitLines
              id="approach-heading"
              text="Four things we hold to on every job."
              className="d2 font-display text-limewash"
            />

            <Reveal delay={0.15} data-approach-media className="mt-12 hidden overflow-hidden lg:block">
              <Figure
                slug="m2-entry-01"
                alt="Entry lobby with a teak volume and a terracotta lattice screen"
                sizes="(max-width: 1023px) 100vw, 40vw"
                className="w-full"
              />
            </Reveal>
          </div>

          <ol className="lg:col-span-7 lg:pl-8">
            {POSITIONS.map((p, i) => (
              <li key={p.n} data-position className="relative pb-10 pt-10 first:pt-0">
                <span
                  data-position-rule
                  className="absolute inset-x-0 top-0 block h-px origin-left bg-limewash-16 first:hidden"
                  style={{ display: i === 0 ? 'none' : undefined }}
                  aria-hidden="true"
                />
                <Reveal className="grid gap-x-6 gap-y-3 sm:grid-cols-[auto,1fr]">
                  <span
                    className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-none text-terracotta sm:w-[2.6em]"
                    aria-hidden="true"
                  >
                    {p.n}
                  </span>
                  <div>
                    <h3 className="d4 mb-3 font-display text-limewash">{p.title}</h3>
                    <p className="max-w-measure text-body text-limewash/60 text-pretty">{p.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
