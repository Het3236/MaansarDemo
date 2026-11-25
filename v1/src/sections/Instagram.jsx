import Figure from '../components/Figure'
import Reveal, { SplitLines } from '../components/Reveal'
import { IG_POSTS, igLink } from '../data/instagram'
import { BRAND } from '../data/site'
import { SIZES } from '../utils/media'

/**
 * The journal. Built from the studio's own frames and laid out on the site's
 * grid, so it reads as part of the page rather than an embedded widget.
 */
export default function Instagram() {
  return (
    <section
      id="instagram"
      className="section-pad relative scroll-mt-20 bg-limewash"
      aria-labelledby="instagram-heading"
    >
      <div className="shell">
        <Reveal className="mb-14 flex items-baseline gap-6 md:mb-20">
          <span className="label shrink-0">06 — Journal</span>
          <span className="rule mb-1" />
        </Reveal>

        <div className="mb-12 flex flex-col gap-7 md:mb-16 md:flex-row md:items-end md:justify-between">
          <SplitLines
            id="instagram-heading"
            text="From the studio."
            className="d2 max-w-[10ch] font-display"
          />

          <Reveal delay={0.1} className="flex flex-col items-start gap-4 md:items-end">
            <p className="max-w-[36ch] text-body text-ink-60 text-pretty md:text-right">
              Rooms as they are finished, details before they are covered up, and the
              occasional site photograph.
            </p>
            <a
              href={BRAND.instagram.url}
              target="_blank"
              rel="noreferrer noopener"
              className="link-rule text-label-lg uppercase tracking-label"
            >
              Follow {BRAND.instagram.handle}
            </a>
          </Reveal>
        </div>
      </div>

      {/* Editorial grid: the first tile is double-width on wide screens. */}
      <div className="shell">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {IG_POSTS.map((post, i) => (
            <li
              key={post.slug}
              className={`aspect-square ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
            >
              <a
                href={igLink(post)}
                target="_blank"
                rel="noreferrer noopener"
                className="group relative block h-full w-full overflow-hidden bg-plaster"
              >
                <Figure
                  slug={post.slug}
                  alt={post.caption}
                  sizes={i === 0 ? SIZES.half : SIZES.tile}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-1200 ease-arch group-hover:scale-[1.05]"
                />

                {/* Caption washes up on hover; on touch it is simply not needed. */}
                <span
                  className="pointer-events-none absolute inset-0 flex items-end p-4 opacity-0
                    transition-opacity duration-600 ease-arch group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(42,35,32,0.80) 0%, rgba(42,35,32,0.12) 58%, rgba(42,35,32,0) 100%)',
                  }}
                >
                  <span className="text-body text-limewash text-pretty">{post.caption}</span>
                </span>

                <span className="sr-only">Open on Instagram</span>
              </a>
            </li>
          ))}
        </ul>

        <Reveal className="mt-10 flex justify-center md:mt-14">
          <a
            href={BRAND.instagram.url}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-ghost"
          >
            See the full feed
          </a>
        </Reveal>
      </div>
    </section>
  )
}
