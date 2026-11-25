import manifest from '../data/media.json'

const BASE = '/media/img'

/** Everything a component needs to render one processed image. */
export function image(slug) {
  const m = manifest[slug]
  if (!m) {
    if (import.meta.env.DEV) console.warn('[media] unknown image slug:', slug)
    return null
  }
  const widest = m.widths[m.widths.length - 1]
  return {
    slug,
    src: `${BASE}/${slug}-${widest}.webp`,
    srcSet: m.widths.map((w) => `${BASE}/${slug}-${w}.webp ${w}w`).join(', '),
    width: m.w,
    height: m.h,
    ratio: m.ratio,
    lqip: m.lqip,
    isPortrait: m.ratio < 1,
  }
}

export const hasImage = (slug) => Boolean(manifest[slug])

/** Common `sizes` strings, so callers don't invent their own each time. */
export const SIZES = {
  full: '100vw',
  half: '(max-width: 767px) 100vw, 50vw',
  third: '(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw',
  card: '(max-width: 767px) 88vw, (max-width: 1279px) 46vw, 38vw',
  tile: '(max-width: 767px) 50vw, 25vw',
}
