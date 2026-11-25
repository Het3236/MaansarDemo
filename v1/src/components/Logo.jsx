import { BRAND } from '../data/site'

/**
 * The logo is used exactly as supplied — never recoloured, stretched or
 * outlined. Clear space equal to the cap height is applied by the callers'
 * padding; the minimum on-screen width of 120px is enforced here.
 */
export function LogoLockup({ className = '', width = 168 }) {
  const w = Math.max(120, width)
  return (
    <img
      src="/media/brand/logo-lockup-600.png"
      srcSet="/media/brand/logo-lockup-600.png 600w, /media/brand/logo-lockup-1000.png 1000w"
      sizes={`${w}px`}
      alt={`${BRAND.name} logo`}
      width={w}
      height={Math.round((w * 2647) / 5340)}
      className={className}
      style={{ width: w, height: 'auto' }}
      draggable="false"
    />
  )
}

/** Just the Devanagari mark, for tight spots and the preloader. */
export function LogoMark({ className = '', size = 40 }) {
  return (
    <img
      src="/media/brand/logo-mark-256.png"
      srcSet="/media/brand/logo-mark-256.png 256w, /media/brand/logo-mark-512.png 512w"
      sizes={`${size}px`}
      alt=""
      aria-hidden="true"
      width={size}
      height={Math.round((size * 2647) / 1716)}
      className={className}
      style={{ width: size, height: 'auto' }}
      draggable="false"
    />
  )
}
