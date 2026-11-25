import { useEffect, useRef, useState } from 'react'
import { gsap } from '../utils/gsap'
import Figure from '../components/Figure'
import Reveal, { SplitLines } from '../components/Reveal'
import { useMediaQuery, useReducedMotion } from '../hooks/useMediaQuery'

const STEPS = [
  {
    n: '01',
    title: 'Walk the space',
    body: 'We visit, measure and photograph, and talk through how the house is actually used — meals, guests, storage, who needs quiet. You leave this stage with a written brief, not a mood board.',
    image: 'm2-entry-01',
    alt: 'Entry lobby with a teak volume and a terracotta lattice screen',
  },
  {
    n: '02',
    title: 'Plan and layout',
    body: 'Room-by-room plans, furniture layouts and circulation. We resolve what moves and what stays before anything is styled, because the plan is the part that is expensive to change later.',
    image: 'm2-living-06',
    alt: 'Open-plan view from the living room through to the dining area',
  },
  {
    n: '03',
    title: 'Materials and joinery',
    body: 'Finish samples in the room they are meant for, seen in daylight. Joinery is drawn to the millimetre — shutter sizes, handle profiles, cove details — and priced from those drawings.',
    image: 'm2-wardrobe-01',
    alt: 'Wardrobe run in teak with dark reeded glass shutters',
  },
  {
    n: '04',
    title: 'Build',
    body: 'Carpentry, electrical, false ceiling, stone and paint, sequenced so trades are not undoing each other. We run the site and hold the schedule.',
    image: 'm2-kitchen-02',
    alt: 'Kitchen with pale fronts, teak screens and a dark glass upper run',
  },
  {
    n: '05',
    title: 'Finish and hand over',
    body: 'Lighting set, hardware adjusted, snags closed, the house cleaned. We hand over with the room dressed so you see it the way it was drawn.',
    image: 'm2-photo-living-a',
    alt: 'Living room seating below a chamfered teak wall with brass detailing',
  },
]

/**
 * Five steps. On desktop the image column is pinned and swaps as each step
 * scrolls past; on mobile each step simply carries its own image.
 */
export default function Process() {
  const root = useRef(null)
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  // The sticky image column only exists in the two-column layout.
  const isWide = useMediaQuery('(min-width: 1024px)')
  const pinned = !reduced && isWide

  useEffect(() => {
    if (!pinned) return
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-step]').forEach((step, i) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: 'top 62%',
            end: 'bottom 62%',
            onToggle: ({ isActive }) => isActive && setActive(i),
          },
        })
      })
    }, el)

    return () => ctx.revert()
  }, [pinned])

  return (
    <section
      id="process"
      ref={root}
      className="section-pad relative scroll-mt-20 bg-plaster"
      aria-labelledby="process-heading"
    >
      <div className="shell">
        <Reveal className="mb-14 flex items-baseline gap-6 md:mb-20">
          <span className="label shrink-0">05 — Process</span>
          <span className="rule mb-1" />
        </Reveal>

        <SplitLines
          id="process-heading"
          text="From the first walk-through to the last snag."
          className="d2 mb-16 max-w-[16ch] font-display md:mb-24"
        />

        <div className="grid gap-x-12 lg:grid-cols-12">
          {/* Pinned image column */}
          {pinned && (
            <div className="lg:col-span-5">
              <div className="sticky top-[calc(var(--nav-h)+3rem)]">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-limewash">
                  {STEPS.map((s, i) => (
                    <div
                      key={s.n}
                      className="absolute inset-0 transition-opacity duration-700 ease-arch"
                      style={{
                        // Frames below the active one stay opaque so the swap
                        // never dips through the empty background.
                        opacity: i <= active ? 1 : 0,
                        zIndex: i,
                      }}
                      aria-hidden={i === active ? undefined : 'true'}
                    >
                      <Figure
                        slug={s.image}
                        alt={s.alt}
                        sizes="(max-width: 1023px) 100vw, 40vw"
                        className="h-full w-full"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-4">
                  <span className="label tabular-nums">
                    {STEPS[active].n} / {STEPS[STEPS.length - 1].n}
                  </span>
                  <span className="relative block h-px flex-1 bg-ink-12">
                    <span
                      className="absolute inset-y-0 left-0 bg-terracotta transition-[width] duration-600 ease-arch"
                      style={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
                    />
                  </span>
                </div>
              </div>
            </div>
          )}

          <ol className={pinned ? 'lg:col-span-7' : 'lg:col-span-12'}>
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                data-step
                className="border-t border-ink-12 py-10 first:border-t-0 first:pt-0 md:py-14"
              >
                <Reveal className="grid gap-x-8 gap-y-6 md:grid-cols-[auto,1fr]">
                  <span
                    className={`font-display text-[clamp(2.5rem,5vw,4rem)] leading-none transition-colors duration-600 ease-arch md:w-[2.4em]
                      ${pinned && i === active ? 'text-terracotta' : 'text-ink-40'}`}
                    aria-hidden="true"
                  >
                    {s.n}
                  </span>
                  <div>
                    <h3 className="d4 mb-4 font-display">{s.title}</h3>
                    <p className="max-w-measure text-body text-ink-60 text-pretty">{s.body}</p>

                    {!pinned && (
                      <Figure
                        slug={s.image}
                        alt={s.alt}
                        sizes="100vw"
                        className="mt-7 w-full"
                        ratio={4 / 3}
                      />
                    )}
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
