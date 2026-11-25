import { useEffect, useState } from 'react'

/** Subscribes to a media query. SSR-safe, and stable across re-renders. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** True when the visitor has asked for less motion. */
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** Below the md breakpoint. Used to simplify, never to remove, an interaction. */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')

/** Coarse pointer — no hover affordances, bigger touch targets. */
export const useIsTouch = () => useMediaQuery('(hover: none), (pointer: coarse)')

/**
 * A rough capability gate. Devices with few cores or little memory get the
 * still-image path instead of autoplaying video.
 */
export function useIsLowPower() {
  const reduced = useReducedMotion()
  const [low, setLow] = useState(false)

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 8
    const mem = navigator.deviceMemory ?? 8
    const conn = navigator.connection
    const slowNet = conn ? /2g/.test(conn.effectiveType ?? '') || conn.saveData === true : false
    setLow(cores <= 4 || mem <= 4 || slowNet)
  }, [])

  return low || reduced
}
