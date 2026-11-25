import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import Figure from '../components/Figure'
import { PROJECTS } from '../data/projects'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found — Maansar Studios" description="This page does not exist." />
      <section className="flex min-h-[100svh] flex-col justify-center bg-limewash pt-[var(--nav-h)]">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="label mb-8">404</p>
            <h1 className="d2 mb-7 max-w-[14ch] font-display">This room does not exist.</h1>
            <p className="mb-10 max-w-measure text-body text-ink-60 text-pretty">
              The page you were looking for is not here. The work is, though.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/" className="btn">
                Back to the studio
              </Link>
              <Link to="/" state={{ scrollTo: '#work' }} className="btn-ghost">
                See the work
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Figure
              slug={PROJECTS[0].cover}
              alt={PROJECTS[0].coverAlt}
              sizes="(max-width: 1023px) 100vw, 40vw"
              className="w-full"
            />
          </div>
        </div>
      </section>
    </>
  )
}
