import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LogoLockup } from './Logo'
import { BRAND, NAV } from '../data/site'
import { useScrollLock, useScrollTo } from '../hooks/useSmoothScroll'
import { useReducedMotion } from '../hooks/useMediaQuery'

const EASE = [0.22, 1, 0.36, 1]

// Hrefs are written from the site root; when the build is served from a
// subpath (the client preview), the visible href has to carry that base.
// Navigation itself still goes through `go()` with the root-relative href.
const withBase = (href) => `${import.meta.env.BASE_URL}${href.replace(/^\//, '')}`

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [onDark, setOnDark] = useState(true) // hero is a dark image
  const [scrolled, setScrolled] = useState(false)
  const lastY = useRef(0)
  // While a nav click is scrolling the page, the bar must not treat that
  // movement as the visitor scrolling away and hide itself.
  const holdUntil = useRef(0)
  const location = useLocation()
  const navigate = useNavigate()
  const scrollTo = useScrollTo()
  const reduced = useReducedMotion()

  useScrollLock(open)

  // Hide on scroll down, show on scroll up. Also tracks whether the nav is
  // currently over a dark section so the logo and links stay legible.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      setHidden(y > 240 && y > lastY.current && !open && Date.now() > holdUntil.current)
      lastY.current = y

      const probe = document.elementFromPoint(24, 28)
      const dark = probe?.closest('[data-nav-dark]')
      setOnDark(Boolean(dark))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  useEffect(() => setOpen(false), [location.pathname])

  // Escape closes the menu.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = useCallback(
    (href) => (e) => {
      e.preventDefault()
      setOpen(false)
      holdUntil.current = Date.now() + 1600
      const [path, hash] = href.split('#')
      const target = hash ? `#${hash}` : null

      if (location.pathname !== (path || '/')) {
        navigate(path || '/', { state: target ? { scrollTo: target } : undefined })
        return
      }
      if (target) window.setTimeout(() => scrollTo(target, { offset: -8 }), 60)
      else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    },
    [location.pathname, navigate, scrollTo, reduced],
  )

  // `light` — nav sits over a dark section, so links go pale.
  // `overImage` — nav sits over photography, so the logo needs its own plate.
  const light = onDark && !open && !scrolled
  const overImage = light

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-600 ease-arch
          ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
      >
        {/* Backdrop appears only once you've left the hero. */}
        <div
          className={`absolute inset-0 -z-10 border-b transition-all duration-600 ease-arch
            ${scrolled && !open ? 'border-ink-12 bg-limewash/92 backdrop-blur-md' : 'border-transparent bg-transparent'}`}
        />
        {/* Over photography, a short wash keeps the links readable against a
            bright ceiling without putting a bar across the image. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-[calc(var(--nav-h)+3rem)]
            transition-opacity duration-600 ease-arch ${light ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background:
              'linear-gradient(to bottom, rgba(42,35,32,0.62) 0%, rgba(42,35,32,0.34) 46%, rgba(42,35,32,0) 100%)',
          }}
        />
        <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-6">
          <a
            href={withBase('/')}
            onClick={go('/')}
            aria-label={`${BRAND.name} — home`}
            className="relative -ml-[var(--gutter)] flex items-center py-3 pl-[var(--gutter)] pr-5"
          >
            {/* The brand guide puts the logo on white or off-white and keeps it
                off busy photographs, so over imagery it sits on a solid plate
                with its own clear space rather than being recoloured. */}
            <span
              className={`absolute inset-0 -z-10 bg-limewash transition-opacity duration-600 ease-arch
                ${overImage ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden="true"
            />
            <LogoLockup width={140} className="md:!w-[164px]" />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={withBase(item.href)}
                onClick={go(item.href)}
                className={`label transition-colors duration-400 ease-arch hover:!text-terracotta
                  ${light ? '!text-limewash/80' : '!text-ink-60'}`}
              >
                {item.label}
              </a>
            ))}
            <a
              href={withBase('/#contact')}
              onClick={go('/#contact')}
              className={`border px-5 py-3 text-label uppercase tracking-label transition-colors duration-400 ease-arch
                ${
                  light
                    ? 'border-limewash/40 text-limewash hover:border-limewash hover:bg-limewash hover:text-ink'
                    : 'border-clay text-clay hover:bg-clay hover:text-limewash'
                }`}
            >
              Book a consultation
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="group -mr-2 flex h-12 w-12 items-center justify-center lg:hidden"
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span className="relative block h-3 w-7">
              <span
                className={`absolute left-0 block h-px w-full transition-all duration-400 ease-arch
                  ${open ? 'top-1.5 rotate-45' : 'top-0'}
                  ${open || !light ? 'bg-ink' : 'bg-limewash'}`}
              />
              <span
                className={`absolute left-0 block h-px transition-all duration-400 ease-arch
                  ${open ? 'top-1.5 w-full -rotate-45' : 'top-3 w-1/2'}
                  ${open || !light ? 'bg-ink' : 'bg-limewash'}`}
              />
            </span>
          </button>
        </div>
      </header>

      <MobileMenu open={open} onNavigate={go} onClose={() => setOpen(false)} />
    </>
  )
}

function MobileMenu({ open, onNavigate, onClose }) {
  const panelRef = useRef(null)

  // Keep focus inside the panel while it is open.
  useEffect(() => {
    if (!open) return
    const first = panelRef.current?.querySelector('a, button')
    first?.focus({ preventScroll: true })
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-40 flex flex-col bg-limewash lg:hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.62, ease: EASE }}
        >
          <div className="h-[var(--nav-h)] shrink-0" />

          <nav
            aria-label="Mobile"
            className="shell flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-8"
          >
            {NAV.map((item, i) => (
              <div key={item.href} className="overflow-hidden">
                <motion.a
                  href={withBase(item.href)}
                  onClick={onNavigate(item.href)}
                  className="block py-3 font-display text-[clamp(2rem,10vw,3.25rem)] leading-[1.06] text-ink"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '110%', transition: { duration: 0.3, ease: EASE } }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.12 + i * 0.055 }}
                >
                  {item.label}
                </motion.a>
              </div>
            ))}
          </nav>

          <motion.div
            className="shell shrink-0 border-t border-ink-12 py-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
          >
            <a
              href={withBase('/#contact')}
              onClick={onNavigate('/#contact')}
              className="btn w-full"
            >
              Book a consultation
            </a>
            <div className="mt-6 flex items-center justify-between">
              <a
                href={BRAND.instagram.url}
                target="_blank"
                rel="noreferrer noopener"
                className="label !text-clay"
              >
                {BRAND.instagram.handle}
              </a>
              <button type="button" onClick={onClose} className="label">
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
