import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from './useMediaQuery'

const LenisContext = createContext(null)

/**
 * Drives the page with Lenis and keeps ScrollTrigger in step with it.
 * When the visitor prefers reduced motion we skip Lenis entirely and let the
 * browser scroll natively — smoothing is a motion effect like any other.
 */
export function SmoothScrollProvider({ children }) {
  const reduced = useReducedMotion()
  const lenisRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (reduced) {
      setReady(true)
      return
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices keep their native scroll physics; smoothing them
      // fights the platform and feels laggy.
      syncTouch: false,
      touchMultiplier: 1.6,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const onRaf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(onRaf)
    gsap.ticker.lagSmoothing(0)

    setReady(true)

    return () => {
      gsap.ticker.remove(onRaf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  return (
    <LenisContext.Provider value={{ lenisRef, ready, reduced }}>{children}</LenisContext.Provider>
  )
}

export function useLenis() {
  return useContext(LenisContext)
}

/** Scroll helper that works with or without Lenis running. */
export function useScrollTo() {
  const ctx = useContext(LenisContext)

  return (target, opts = {}) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target
    if (!el) return
    const lenis = ctx?.lenisRef?.current
    if (lenis) {
      lenis.scrollTo(el, { offset: opts.offset ?? 0, duration: 1.2 })
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0)
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }
}

/** Lock/unlock page scroll — used by the mobile menu and the preloader. */
export function useScrollLock(locked) {
  const ctx = useContext(LenisContext)

  useEffect(() => {
    const lenis = ctx?.lenisRef?.current
    if (locked) {
      lenis?.stop()
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
        lenis?.start()
      }
    }
  }, [locked, ctx])
}
