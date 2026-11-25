import manifest from '../data/media.json'
import loops from '../data/loops.json'

const BASE = '/media/img'

export const SIZES = {
  full: '100vw',
  half: '(max-width: 899px) 100vw, 50vw',
  panel: '(max-width: 899px) 92vw, 48vw',
  third: '(max-width: 599px) 100vw, (max-width: 899px) 50vw, 33vw',
  card: '(max-width: 899px) 72vw, 26vw',
}

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** A processed photograph as an <img>. The inline blurred placeholder from the
 *  manifest is the element's own background, so the frame is never empty and there
 *  is no second element to fade. */
export function img(slug, { alt = '', sizes = SIZES.full, cls = '', eager = false, speed = '' } = {}) {
  const m = manifest[slug]
  if (!m) return ''
  const widest = m.widths[m.widths.length - 1]
  return `<img class="${cls}" src="${BASE}/${slug}-${widest}.webp"
    srcset="${m.widths.map((w) => `${BASE}/${slug}-${w}.webp ${w}w`).join(', ')}"
    sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${esc(alt)}"
    loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}${speed ? ` data-speed="${speed}"` : ''}
    style="background-image:url(${m.lqip})" />`
}

export const loop = (key) => loops[key]
export { esc }
