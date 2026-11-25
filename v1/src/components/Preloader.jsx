import { useEffect, useRef, useState } from 'react'
import { LogoMark } from './Logo'
import { useReducedMotion } from '../hooks/useMediaQuery'
import { useScrollLock } from '../hooks/useSmoothScroll'

/**
 * A short, quiet load. The mark, a rule that draws across, and a count.
 * It waits for the hero image and the fonts, then leaves — capped at 2.2s so a
 * slow network never holds the page hostage.
 */
export default function Preloader({ onDone }) {
  const reduced = useReducedMotion()
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)
  const doneRef = useRef(false)

  useScrollLock(!gone)

  useEffect(() => {
    if (reduced) {
      setGone(true)
      onDone?.()
      return
    }

    let raf
    const start = performance.now()
    const MAX = 2200

    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      setPct(100)
      setLeaving(true)
      window.setTimeout(() => {
        setGone(true)
        onDone?.()
      }, 900)
    }

    // Real signals: fonts ready + the hero image decoded.
    const hero = new Image()
    hero.src = '/media/img/hero-living-teak-1600.webp'
    const ready = Promise.allSettled([
      document.fonts?.ready ?? Promise.resolve(),
      hero.decode().catch(() => {}),
    ])

    let settled = false
    ready.then(() => {
      settled = true
    })

    const tick = (now) => {
      const elapsed = now - start
      // Ease toward 92% while waiting, then release.
      const target = settled ? 100 : 92
      const eased = target * (1 - Math.pow(2, (-3.4 * elapsed) / 1000))
      setPct((p) => Math.max(p, Math.min(target, Math.round(eased))))

      if ((settled && elapsed > 620) || elapsed > MAX) {
        finish()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [reduced, onDone])

  if (gone) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-limewash px-[var(--gutter)] py-8
        transition-[opacity,transform] duration-900 ease-arch
        ${leaving ? '-translate-y-3 opacity-0' : 'translate-y-0 opacity-100'}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex justify-between">
        <span className="label">Maansar Studios</span>
        <span className="label tabular-nums">{pct}</span>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <LogoMark size={44} className="animate-drift opacity-90 md:!w-[56px]" />
      </div>

      <div>
        <div className="h-px w-full bg-ink-12">
          <div
            className="h-px bg-terracotta transition-[width] duration-400 ease-arch"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="label mt-4">Interior design and build</p>
      </div>
    </div>
  )
}
