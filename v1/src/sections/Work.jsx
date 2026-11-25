import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../utils/gsap'
import Figure from '../components/Figure'
import Reveal, { SplitLines } from '../components/Reveal'
import { PROJECTS } from '../data/projects'
import { useReducedMotion } from '../hooks/useMediaQuery'

/**
 * The portfolio index. Each project gets a spread rather than a card: a large
 * cover that unmasks on scroll, a secondary plate offset against it, and the
 * name set at display size.
 */
export default function Work() {
  return (
    <section id="work" className="relative scroll-mt-20 bg-limewash pb-[var(--section)]" aria-labelledby="work-heading">
      <div className="shell">
        <Reveal className="mb-14 flex items-baseline gap-6 md:mb-20">
          <span className="label shrink-0">02 — Selected work</span>
          <span className="rule mb-1" />
        </Reveal>

        <SplitLines
          id="work-heading"
          text="Three houses, built out."
          className="d2 mb-16 max-w-[14ch] font-display md:mb-24"
        />
      </div>

      <ul className="flex flex-col">
        {PROJECTS.map((project, i) => (
          <ProjectSpread key={project.slug} project={project} index={i} />
        ))}
      </ul>
    </section>
  )
}

function ProjectSpread({ project, index }) {
  const root = useRef(null)
  const reduced = useReducedMotion()
  const flipped = index % 2 === 1

  // A second image, taken from the project's own gallery.
  const secondary = project.gallery.find((g) => g.slug !== project.cover)

  useEffect(() => {
    if (reduced) return
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      // Cover unmasks upward as it enters.
      gsap.fromTo(
        '[data-cover]',
        { clipPath: 'inset(14% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 42%', scrub: true },
        },
      )
      // Slow drift inside the frame.
      // Scale stays above 1 for the whole drift, so the image can never pull
      // away from the edge of its frame and show the panel behind it.
      gsap.fromTo(
        '[data-cover] img',
        { scale: 1.12, yPercent: -3 },
        {
          scale: 1.12,
          yPercent: 3,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      gsap.fromTo(
        '[data-secondary]',
        { yPercent: 9 },
        {
          yPercent: -9,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [reduced])

  return (
    <li ref={root} className="group/spread relative border-t border-ink-12 py-[clamp(3rem,7vw,7rem)]">
      <div className="shell">
        <div
          className={`grid items-center gap-y-8 lg:grid-cols-12 lg:gap-x-8 ${
            flipped ? 'lg:[direction:rtl]' : ''
          }`}
        >
          {/* Cover */}
          <div className="relative lg:col-span-8 lg:[direction:ltr]">
            <Link
              to={`/work/${project.slug}`}
              className="block"
              aria-label={`${project.title} — view project`}
            >
              <div data-cover className="overflow-hidden bg-plaster">
                <Figure
                  slug={project.cover}
                  alt={project.coverAlt}
                  sizes="(max-width: 1023px) 100vw, 66vw"
                  className="w-full"
                  imgClassName="transition-transform duration-1200 ease-arch group-hover/spread:scale-[1.03]"
                  ratio={16 / 10}
                />
              </div>
            </Link>

            {/* Offset secondary plate, mounted on limewash so the layering
                reads as deliberate. It overlaps the cover's outer corner and
                never reaches the meta column or the page edge. The hang is a
                negative margin, not a transform — GSAP owns the transform here
                for the parallax. */}
            {secondary && (
              <div
                data-secondary
                className={`absolute bottom-0 -mb-[7%] hidden w-[18%] bg-limewash p-2 lg:block
                  ${flipped ? 'right-0' : 'left-0'}`}
              >
                <Figure
                  slug={secondary.slug}
                  alt={secondary.alt}
                  sizes="18vw"
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Meta column */}
          <div className="lg:col-span-4 lg:[direction:ltr] lg:pl-2">
            <Reveal className="flex flex-col gap-5">
              <div className="flex items-baseline gap-4">
                <span
                  aria-hidden="true"
                  className="font-display text-[clamp(2rem,3.4vw,3rem)] leading-none text-terracotta"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="label">
                  {project.category}
                  {project.location && <span className="text-ink-40"> · {project.location}</span>}
                </p>
              </div>

              <h3 className="d3 font-display">
                <Link
                  to={`/work/${project.slug}`}
                  className="transition-colors duration-400 ease-arch hover:text-clay"
                >
                  {project.title}
                </Link>
              </h3>

              <p className="max-w-[38ch] text-body text-ink-60 text-pretty">{project.summary}</p>

              <dl className="mt-1 space-y-3 border-t border-ink-12 pt-5 text-body">
                <div>
                  <dt className="label mb-1">Rooms</dt>
                  <dd className="text-ink">{project.rooms}</dd>
                </div>
                <div>
                  <dt className="label mb-1">Materials</dt>
                  <dd className="text-ink">{project.materials}</dd>
                </div>
              </dl>

              <Link
                to={`/work/${project.slug}`}
                className="link-rule mt-2 self-start text-label-lg uppercase tracking-label"
              >
                See the project
              </Link>
            </Reveal>
          </div>
        </div>

        {/* On small screens the same plate simply follows the copy. */}
        {secondary && (
          <div className="mt-8 w-1/2 max-w-[16rem] lg:hidden">
            <Figure
              slug={secondary.slug}
              alt={secondary.alt}
              sizes="50vw"
              className="w-full"
            />
          </div>
        )}
      </div>
    </li>
  )
}
