import { useEffect, useRef } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../utils/gsap'
import Figure from '../components/Figure'
import Reveal, { SplitLines } from '../components/Reveal'
import Seo from '../components/Seo'
import { getProject, getRelated } from '../data/projects'
import { BRAND } from '../data/site'
import { SIZES, image } from '../utils/media'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { useScrollTo } from '../hooks/useSmoothScroll'

export default function Project() {
  const { slug } = useParams()
  const project = getProject(slug)
  const root = useRef(null)
  const reduced = useReducedMotion()
  const scrollTo = useScrollTo()

  useEffect(() => {
    window.scrollTo(0, 0)
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => window.clearTimeout(id)
  }, [slug])

  useEffect(() => {
    if (reduced || !project) return
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-img] img',
        { scale: 1.14 },
        { scale: 1, duration: 2, ease: 'power3.out' },
      )
      // The media box is oversized (see -inset-y) so this drift cannot
      // uncover the section behind it.
      gsap.to('[data-hero-img]', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.utils.toArray('[data-plate]').forEach((plate) => {
        gsap.fromTo(
          plate.querySelector('img:last-of-type'),
          { scale: 1.1, yPercent: -2.5 },
          {
            scale: 1.1,
            yPercent: 2.5,
            ease: 'none',
            scrollTrigger: { trigger: plate, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    }, el)

    return () => ctx.revert()
  }, [reduced, project, slug])

  if (!project) return <Navigate to="/404" replace />

  const related = getRelated(project.slug)
  const cover = image(project.cover)

  // Group the gallery into an editorial rhythm: wide plates break the flow,
  // everything else pairs up.
  const blocks = []
  let pair = []
  for (const item of project.gallery) {
    if (item.wide) {
      if (pair.length) {
        blocks.push({ kind: 'pair', items: pair })
        pair = []
      }
      blocks.push({ kind: 'wide', items: [item] })
    } else {
      pair.push(item)
      if (pair.length === 2) {
        blocks.push({ kind: 'pair', items: pair })
        pair = []
      }
    }
  }
  if (pair.length) blocks.push({ kind: 'pair', items: pair })

  return (
    <div ref={root}>
      <Seo
        title={`${project.title} — ${BRAND.name}`}
        description={project.summary}
        image={cover ? `/media/img/${project.cover}-1600.webp` : undefined}
        path={`/work/${project.slug}`}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.summary,
          creator: { '@type': 'Organization', name: BRAND.name },
          ...(project.location ? { locationCreated: project.location } : {}),
        }}
      />

      {/* ——— Hero ——— */}
      <section data-hero data-nav-dark className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden bg-ink">
        <div data-hero-img className="absolute -inset-y-[8%] inset-x-0">
          <Figure
            slug={project.hero}
            alt={project.coverAlt}
            sizes="100vw"
            priority
            className="h-full w-full"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(42,35,32,0.88) 0%, rgba(42,35,32,0.34) 46%, rgba(42,35,32,0.14) 70%, rgba(42,35,32,0.42) 100%)',
          }}
          aria-hidden="true"
        />

        <div className="shell relative z-10 pb-14 pt-[calc(var(--nav-h)+4rem)]">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link to="/#work" className="label-light transition-colors duration-400 hover:!text-terracotta">
              ← All work
            </Link>
          </nav>

          <p className="label-light mb-6">
            {project.category}
            {project.location && <span className="!text-limewash/40"> · {project.location}</span>}
          </p>

          <SplitLines
            as="h1"
            key={project.slug}
            text={project.title}
            animate="immediate"
            delay={0.1}
            className="d1 max-w-[11ch] font-display text-limewash"
          />
        </div>
      </section>

      {/* ——— Introduction ——— */}
      <section className="section-pad bg-limewash">
        <div className="shell grid gap-x-12 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SplitLines as="p" text={project.intro} className="d3 font-display" />
          </div>
          <div className="lg:col-span-5 lg:pl-6">
            <Reveal className="space-y-6 text-body text-ink-60 text-pretty">
              {project.story.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </Reveal>

            <Reveal delay={0.1} className="mt-10 space-y-5 border-t border-ink-12 pt-7">
              <div>
                <p className="label mb-2">Rooms</p>
                <p className="text-body text-ink">{project.rooms}</p>
              </div>
              <div>
                <p className="label mb-2">Materials</p>
                <p className="text-body text-ink">{project.materials}</p>
              </div>
              {project.location && (
                <div>
                  <p className="label mb-2">Location</p>
                  <p className="text-body text-ink">{project.location}</p>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ——— Gallery ——— */}
      <section className="bg-limewash pb-[var(--section)]" aria-label={`${project.title} gallery`}>
        <div className="shell flex flex-col gap-6 md:gap-10">
          {blocks.map((block, i) => {
            if (block.kind === 'wide') {
              const item = block.items[0]
              // A tall photograph blown up to full width becomes a wall of
              // ceiling. Portraits get a generous centre column instead; only
              // the landscape frames run edge to edge.
              const portrait = image(item.slug)?.isPortrait
              return (
                <figure
                  key={i}
                  data-plate
                  className={portrait ? 'mx-auto w-full max-w-[44rem]' : 'w-full'}
                >
                  <Figure
                    slug={item.slug}
                    alt={item.alt}
                    sizes={portrait ? '(max-width: 767px) 100vw, 44rem' : SIZES.full}
                    className="w-full"
                  />
                  <figcaption className="label mt-4">{item.alt}</figcaption>
                </figure>
              )
            }
            return (
              <div key={i} className="grid gap-6 md:grid-cols-2 md:gap-8">
                {block.items.map((item, j) => (
                  <figure key={item.slug} data-plate className={j === 1 ? 'md:mt-16' : ''}>
                    <Figure
                      slug={item.slug}
                      alt={item.alt}
                      sizes={SIZES.half}
                      className="w-full"
                    />
                  </figure>
                ))}
              </div>
            )
          })}
        </div>
      </section>

      {/* ——— Related ——— */}
      <section data-nav-dark className="section-pad bg-ink text-limewash">
        <div className="shell">
          <Reveal className="mb-12 flex items-baseline gap-6 md:mb-16">
            <span className="label-light shrink-0">Next</span>
            <span className="block h-px w-full bg-limewash-16" />
          </Reveal>

          <ul className="grid gap-10 md:grid-cols-2 md:gap-8">
            {related.map((p) => (
              <li key={p.slug}>
                <Link to={`/work/${p.slug}`} className="group block">
                  <div className="overflow-hidden bg-[#1a1512]">
                    <Figure
                      slug={p.cover}
                      alt={p.coverAlt}
                      sizes={SIZES.half}
                      className="w-full"
                      ratio={16 / 10}
                      imgClassName="transition-transform duration-1200 ease-arch group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="label-light mt-5">
                    {p.category}
                    {p.location && <span className="!text-limewash/40"> · {p.location}</span>}
                  </p>
                  <h2 className="d4 mt-2 font-display text-limewash transition-colors duration-400 ease-arch group-hover:text-terracotta">
                    {p.title}
                  </h2>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-16 flex flex-col items-start gap-6 border-t border-limewash-16 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="d4 max-w-[20ch] font-display text-limewash">
              Working on something similar?
            </p>
            <Link
              to="/"
              state={{ scrollTo: '#contact' }}
              className="btn shrink-0"
            >
              Book a consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

