import { useEffect, useRef } from 'react'
import { gsap } from '../utils/gsap'
import Figure from '../components/Figure'
import Reveal, { SplitLines } from '../components/Reveal'
import { SIZES } from '../utils/media'
import { useReducedMotion } from '../hooks/useMediaQuery'

/** The studio, told through one long sentence and two photographs. */
export default function Intro() {
  const root = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-parallax]').forEach((node) => {
        const depth = Number(node.dataset.parallax) || 1
        gsap.fromTo(
          node,
          { yPercent: 6 * depth },
          {
            yPercent: -6 * depth,
            ease: 'none',
            scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    }, el)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="studio"
      ref={root}
      className="section-pad relative scroll-mt-24 bg-limewash"
      aria-labelledby="studio-heading"
    >
      <div className="shell">
        <Reveal className="mb-14 flex items-baseline gap-6 md:mb-20">
          <span className="label shrink-0">01 — The studio</span>
          <span className="rule mb-1" />
        </Reveal>

        <div className="grid gap-x-10 gap-y-14 lg:grid-cols-12">
          <div className="lg:col-span-7 lg:pr-10">
            <SplitLines
              id="studio-heading"
              text="We are a studio for the long middle of a project — after the drawing, before the housewarming."
              className="d2 font-display"
            />
          </div>

          <div className="flex flex-col justify-end gap-7 lg:col-span-5">
            <Reveal className="space-y-6 text-body text-ink-60 text-pretty md:text-body-lg">
              <p>
                We design and build interiors: full homes, sample houses, single rooms.
                The work starts with how a family already lives — where they eat, what
                they keep, which corner gets the afternoon — and ends with joinery that
                is installed, wired and cleaned.
              </p>
              <p>
                We draw in materials rather than moods. Teak, lime plaster, powder-coated
                steel, stone, fluted glass. When a wall is going to carry the whole room,
                we say so early and spend the budget there.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="flex flex-wrap gap-x-10 gap-y-5 border-t border-ink-12 pt-7">
              {[
                ['Design', 'Layouts, joinery drawings, materials'],
                ['Build', 'Site execution and finishing'],
              ].map(([k, v]) => (
                <div key={k} className="min-w-[8rem] flex-1">
                  <p className="label mb-2">{k}</p>
                  <p className="text-body text-ink">{v}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>

      {/* Two plates, offset. The taller one sits lower and moves less. */}
      <div className="shell mt-20 grid gap-6 md:mt-28 md:grid-cols-12 md:gap-8">
        <div data-parallax="1.3" className="md:col-span-7 md:mt-0">
          <Figure
            slug="m2-photo-living-b"
            alt="A steel-framed vitrine holding ceramics, beside a curtained window"
            sizes={SIZES.half}
            className="w-full"
          />
          <p className="label mt-4">Mehsana Residence II — living room vitrine</p>
        </div>
        <div data-parallax="0.6" className="md:col-span-5 md:mt-24">
          <Figure
            slug="m2-temple-02"
            alt="A temple with a carved teak column standing on a white stone plinth"
            sizes={SIZES.half}
            className="w-full"
          />
          <p className="label mt-4">Mehsana Residence II — temple</p>
        </div>
      </div>
    </section>
  )
}
