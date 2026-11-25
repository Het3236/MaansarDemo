import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useMediaQuery'

/**
 * Scroll reveal for anything that is not a heading.
 * Lifts the element once, on the way in.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  y = 20,
  start = 'top 88%',
  className = '',
  ...rest
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start, once: true },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [reduced, delay, y, start])

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}

/**
 * A heading whose real, rendered lines rise from behind a mask.
 *
 * Line breaks are measured rather than hard-coded, so the effect survives every
 * viewport width, font swap and text change — a wrapped line would otherwise
 * escape its mask and the whole heading would sit in the wrong place.
 *
 * The plain text is rendered first, so it is correct before JavaScript runs and
 * for anyone who has asked for reduced motion.
 */
export function SplitLines({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  stagger = 0.075,
  start = 'top 86%',
  animate = 'scroll', // 'scroll' | 'immediate' | 'none'
  ...rest
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [split, setSplit] = useState(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced || animate === 'none') return

    let frame = 0
    let ctx = null
    let live = true

    /** Rebuilds the masked-line markup from `text` at the current width. */
    const build = () => {
      if (!live || !el.isConnected) return
      ctx?.revert()
      ctx = null

      // 1. Lay the words out inline and let the browser wrap them.
      el.textContent = ''
      const words = text.split(/\s+/).filter(Boolean)
      const nodes = words.map((w) => {
        const s = document.createElement('span')
        s.textContent = w
        s.style.display = 'inline-block'
        return s
      })
      nodes.forEach((n, i) => {
        el.appendChild(n)
        if (i < nodes.length - 1) el.appendChild(document.createTextNode(' '))
      })

      // 2. Group them by the row they landed on.
      const rows = []
      let top = null
      for (const n of nodes) {
        const t = n.offsetTop
        if (top === null || Math.abs(t - top) > 2) {
          rows.push([])
          top = t
        }
        rows[rows.length - 1].push(n.textContent)
      }

      // 3. Rebuild as one mask per row.
      el.textContent = ''
      const inners = rows.map((row) => {
        const mask = document.createElement('span')
        mask.style.display = 'block'
        mask.style.overflow = 'hidden'
        mask.style.paddingBottom = '0.08em'

        const inner = document.createElement('span')
        inner.style.display = 'block'
        inner.textContent = row.join(' ')
        inner.setAttribute('data-line-inner', '')

        mask.appendChild(inner)
        el.appendChild(mask)
        return inner
      })

      if (!inners.length) return

      ctx = gsap.context(() => {
        const from = { yPercent: 110 }
        const to = {
          yPercent: 0,
          duration: 1.15,
          delay,
          stagger,
          ease: 'power3.out',
          willChange: 'transform',
          // Drop the layer hint once the line has landed.
          onComplete() {
            this.targets().forEach((t) => (t.style.willChange = ''))
          },
        }
        if (animate === 'immediate') {
          gsap.fromTo(inners, from, to)
        } else {
          gsap.fromTo(inners, from, {
            ...to,
            scrollTrigger: { trigger: el, start, once: true },
          })
        }
      }, el)
    }

    build()

    // Re-measure when the element's width changes (resize, orientation, fonts).
    let last = el.offsetWidth
    const ro = new ResizeObserver(() => {
      if (Math.abs(el.offsetWidth - last) < 2) return
      last = el.offsetWidth
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        build()
        ScrollTrigger.refresh()
      })
    })
    ro.observe(el)

    // Web fonts change metrics after first paint.
    document.fonts?.ready.then(() => {
      if (live) frame = requestAnimationFrame(build)
    })

    setSplit(true)

    return () => {
      live = false
      ro.disconnect()
      cancelAnimationFrame(frame)
      ctx?.revert()
      el.textContent = ''
    }
  }, [text, reduced, delay, stagger, start, animate])

  return (
    <Tag className={className} {...rest}>
      {/* React owns this node and never has it mutated. It carries the text
          until the lines are built, then steps aside so the heading is not
          duplicated for search engines or assistive tech. */}
      <span hidden={split}>{text}</span>
      {/* The effect owns this one outright — React puts no children in it, so
          rebuilding the masked lines can never fight reconciliation. */}
      <span ref={ref} className="block" />
    </Tag>
  )
}
