import { useEffect, useRef, useState } from 'react'
import { gsap } from '../utils/gsap'
import Reveal, { SplitLines } from '../components/Reveal'
import { useIsLowPower, useIsMobile, useReducedMotion } from '../hooks/useMediaQuery'
import loops from '../data/loops.json'

// The studio's own walk-through footage, cut short and muted.
const REELS = [
  { key: 'loop-m2-living', label: 'Mehsana Residence II', room: 'Living room' },
  { key: 'loop-a77-bedroom', label: 'Arcadia 77 Sample House', room: 'Bedroom' },
  { key: 'loop-mb-living', label: 'Mehsana Bungalow', room: 'Living room' },
  { key: 'loop-m2-dining', label: 'Mehsana Residence II', room: 'Dining' },
  { key: 'loop-mb-theatre', label: 'Mehsana Bungalow', room: 'Home theatre' },
  { key: 'loop-m2-kitchen', label: 'Mehsana Residence II', room: 'Kitchen' },
]

/**
 * A horizontal run of the studio's walk-through clips.
 *
 * On desktop the section is a tall block containing a sticky, viewport-tall
 * panel; scrolling through the block slides the track sideways. This uses
 * `position: sticky` rather than ScrollTrigger's `pin`, because pinning wraps
 * the section in a spacer element — DOM that React did not create and then
 * cannot remove when the route changes, which crashes the tree on navigation.
 *
 * On touch it becomes a native swipe rail: same content, the platform's own
 * scroll physics, and no hijacking on a device where that always feels wrong.
 */
export default function Motion() {
  const root = useRef(null)
  const track = useRef(null)
  const reduced = useReducedMotion()
  const isMobile = useIsMobile()
  const sliding = !reduced && !isMobile
  const [distance, setDistance] = useState(0)

  // How far the track must travel for its last card to reach the edge.
  useEffect(() => {
    if (!sliding) {
      setDistance(0)
      return
    }
    const el = track.current
    if (!el) return

    const measure = () =>
      setDistance(Math.max(0, Math.round(el.scrollWidth - window.innerWidth)))

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [sliding])

  useEffect(() => {
    if (!sliding || !distance) return
    const el = root.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.to(track.current, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [sliding, distance])

  return (
    <section
      ref={root}
      data-nav-dark
      className="relative bg-ink text-limewash"
      style={sliding && distance ? { height: `calc(100svh + ${distance}px)` } : undefined}
      aria-labelledby="motion-heading"
    >
      <div
        className={
          sliding
            ? 'sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden'
            : 'section-pad'
        }
      >
        <div className="shell mb-10 md:mb-14">
          <Reveal className="mb-8 flex items-baseline gap-6">
            <span className="label-light shrink-0">04 — In motion</span>
            <span className="block h-px w-full bg-limewash-16" />
          </Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SplitLines
              id="motion-heading"
              text="Walk through the rooms."
              className="d3 max-w-[14ch] font-display text-limewash"
            />
            <Reveal delay={0.1}>
              <p className="label-light">
                {sliding ? 'Scroll sideways' : 'Swipe'} · Filmed on site
              </p>
            </Reveal>
          </div>
        </div>

        <div
          className={
            sliding
              ? 'w-full'
              : 'w-full overflow-x-auto overscroll-x-contain no-scrollbar [scroll-snap-type:x_mandatory]'
          }
        >
          <div ref={track} className="flex w-max gap-4 px-[var(--gutter)] md:gap-6">
            {REELS.map((reel, i) => (
              <Reel key={reel.key} reel={reel} index={i} />
            ))}
            <div className="w-[var(--gutter)] shrink-0" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Reel({ reel, index }) {
  const meta = loops[reel.key]
  const videoRef = useRef(null)
  const wrapRef = useRef(null)
  const lowPower = useIsLowPower()
  const [visible, setVisible] = useState(false)

  // Only the clips actually on screen are allowed to fetch, decode and play.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '300px',
      threshold: 0.05,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v || lowPower) return
    if (visible) {
      const p = v.play()
      if (p?.catch) p.catch(() => {})
    } else {
      v.pause()
    }
  }, [visible, lowPower])

  if (!meta) return null

  return (
    <figure
      ref={wrapRef}
      className="w-[68vw] shrink-0 [scroll-snap-align:center] sm:w-[46vw] md:w-[30vw] lg:w-[23vw] xl:w-[19vw]"
    >
      <div className="relative aspect-[9/16] overflow-hidden bg-[#1a1512]">
        {lowPower || !visible ? (
          <img
            src={meta.poster}
            alt={`${reel.room}, ${reel.label}`}
            loading="lazy"
            decoding="async"
            className="fill-abs"
          />
        ) : (
          <video
            ref={videoRef}
            src={meta.src}
            poster={meta.poster}
            muted
            loop
            playsInline
            preload="none"
            aria-label={`${reel.room}, ${reel.label}`}
            className="fill-abs"
          />
        )}
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-3">
        <span className="text-body text-limewash">{reel.room}</span>
        <span className="label-light shrink-0">{String(index + 1).padStart(2, '0')}</span>
      </figcaption>
      <p className="label-light mt-1 !text-limewash/40">{reel.label}</p>
    </figure>
  )
}
