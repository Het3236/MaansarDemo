import { useEffect } from 'react'

const setMeta = (selector, attr, value) => {
  if (!value) return
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    const [, key, val] = selector.match(/\[(.+?)="(.+?)"\]/) ?? []
    if (key && val) el.setAttribute(key, val)
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

/** Per-route title, description, canonical and Open Graph tags. */
export default function Seo({ title, description, image, path, type = 'website', jsonLd }) {
  useEffect(() => {
    const origin = window.location.origin
    const url = origin + (path ?? window.location.pathname)
    const img = image ? (image.startsWith('http') ? image : origin + image) : null

    if (title) document.title = title
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:type"]', 'content', type)
    setMeta('meta[property="og:url"]', 'content', url)
    if (img) setMeta('meta[property="og:image"]', 'content', img)

    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = url
  }, [title, description, image, path, type])

  useEffect(() => {
    if (!jsonLd) return
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.dataset.route = 'true'
    el.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(el)
    return () => el.remove()
  }, [jsonLd])

  return null
}
