import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogoLockup } from './Logo'
import { BRAND, NAV } from '../data/site'
import { PROJECTS } from '../data/projects'
import { useScrollTo } from '../hooks/useSmoothScroll'

export default function Footer() {
  const location = useLocation()
  const navigate = useNavigate()
  const scrollTo = useScrollTo()
  const year = new Date().getFullYear()

  const go = (href) => (e) => {
    e.preventDefault()
    const [path, hash] = href.split('#')
    if (location.pathname !== (path || '/')) {
      navigate(path || '/', { state: hash ? { scrollTo: `#${hash}` } : undefined })
      return
    }
    if (hash) scrollTo(`#${hash}`, { offset: -8 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer data-nav-dark className="bg-ink text-limewash">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            {/* On dark the logo keeps its own colour — it is never recoloured. */}
            <Link
              to="/"
              onClick={go('/')}
              aria-label={`${BRAND.name} — home`}
              className="inline-block py-2"
            >
              <LogoLockup width={180} className="md:!w-[210px]" />
            </Link>
            <p className="mt-7 max-w-[34ch] text-body text-limewash/60 text-pretty">
              {BRAND.tagline}. We design homes around the people who live in them.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="label-light mb-5">Site</p>
            <ul className="space-y-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={go(item.href)}
                    className="-my-2 inline-block py-2 text-body text-limewash/70 transition-colors duration-400 ease-arch hover:text-terracotta"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className="label-light mb-5">Work</p>
            <ul className="space-y-3">
              {PROJECTS.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/work/${p.slug}`}
                    className="-my-2 inline-block py-2 text-body text-limewash/70 transition-colors duration-400 ease-arch hover:text-terracotta"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="label-light mb-5">Elsewhere</p>
            <ul className="space-y-3">
              <li>
                <a
                  href={BRAND.instagram.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="-my-2 inline-block py-2 text-body text-limewash/70 transition-colors duration-400 ease-arch hover:text-terracotta"
                >
                  Instagram
                </a>
              </li>
              {BRAND.email && (
                <li>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="-my-2 inline-block py-2 text-body text-limewash/70 transition-colors duration-400 ease-arch hover:text-terracotta"
                  >
                    {BRAND.email}
                  </a>
                </li>
              )}
              {BRAND.phone && (
                <li>
                  <a
                    href={`tel:${BRAND.phone.replace(/\s/g, '')}`}
                    className="-my-2 inline-block py-2 text-body text-limewash/70 transition-colors duration-400 ease-arch hover:text-terracotta"
                  >
                    {BRAND.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-limewash-16 pt-7 sm:flex-row sm:items-center sm:justify-between md:mt-20">
          <p className="label-light">
            © {year} {BRAND.name}
          </p>
          <a
            href={BRAND.instagram.url}
            target="_blank"
            rel="noreferrer noopener"
            className="label-light -my-2 inline-block py-2 transition-colors duration-400 hover:!text-terracotta"
          >
            {BRAND.instagram.handle}
          </a>
        </div>
      </div>
    </footer>
  )
}
