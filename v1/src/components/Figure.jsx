import { useEffect, useRef, useState } from 'react'
import { image, SIZES } from '../utils/media'

/**
 * A processed image with a blurred placeholder underneath.
 *
 * The wrapper holds the aspect ratio so nothing shifts while loading, and the
 * placeholder is a ~1KB inline WebP so there is never an empty box.
 */
export default function Figure({
  slug,
  alt,
  sizes = SIZES.full,
  className = '',
  imgClassName = '',
  priority = false,
  ratio,
  onLoad,
}) {
  const data = image(slug)
  const ref = useRef(null)
  const [loaded, setLoaded] = useState(false)

  // Images restored from cache can complete before React attaches onLoad.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true)
  }, [])

  if (!data) return null

  const boxRatio = ratio ?? data.ratio

  return (
    <div
      className={`relative overflow-hidden bg-plaster ${className}`}
      style={{
        // A box already given a height (h-full, aspect-*) sizes itself.
        aspectRatio: /h-full|aspect-/.test(className) ? undefined : boxRatio,
      }}
    >
      <img
        aria-hidden="true"
        src={data.lqip}
        alt=""
        className={`fill-abs scale-105 blur-xl transition-opacity duration-900 ease-arch ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <img
        ref={ref}
        src={data.src}
        srcSet={data.srcSet}
        sizes={sizes}
        alt={alt}
        width={data.width}
        height={data.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchpriority={priority ? 'high' : 'auto'}
        onLoad={() => {
          setLoaded(true)
          onLoad?.()
        }}
        className={`fill-abs transition-opacity duration-900 ease-arch ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  )
}
