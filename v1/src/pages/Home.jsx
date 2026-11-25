import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../sections/Hero'
import Intro from '../sections/Intro'
import Work from '../sections/Work'
import Approach from '../sections/Approach'
import Motion from '../sections/Motion'
import Process from '../sections/Process'
import Instagram from '../sections/Instagram'
import Contact from '../sections/Contact'
import Seo from '../components/Seo'
import { BRAND } from '../data/site'
import { useScrollTo } from '../hooks/useSmoothScroll'

export default function Home({ started }) {
  const location = useLocation()
  const scrollTo = useScrollTo()

  // Arriving from another route with a section in mind.
  useEffect(() => {
    const target = location.state?.scrollTo
    if (!target) return
    const id = window.setTimeout(() => scrollTo(target, { offset: -8 }), 160)
    return () => window.clearTimeout(id)
  }, [location.state, scrollTo])

  return (
    <>
      <Seo
        title={`${BRAND.name} — Interior design and build`}
        description="We design and build interiors: full homes, sample houses and single rooms. Teak, lime plaster, steel and stone, drawn to the millimetre and executed on site."
        image="/media/img/hero-living-teak-1600.webp"
        path="/"
      />
      <Hero started={started} />
      <Intro />
      <Work />
      <Approach />
      <Motion />
      <Process />
      <Instagram />
      <Contact />
    </>
  )
}
