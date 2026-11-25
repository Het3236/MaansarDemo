import { useCallback, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Preloader from './components/Preloader'
import Home from './pages/Home'
import Project from './pages/Project'
import NotFound from './pages/NotFound'
import { SmoothScrollProvider } from './hooks/useSmoothScroll'
import { ScrollTrigger } from './utils/gsap'

function Shell() {
  const [started, setStarted] = useState(false)
  const location = useLocation()

  const onLoaded = useCallback(() => setStarted(true), [])

  // Route changes invalidate every pinned/scrubbed trigger.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 260)
    return () => window.clearTimeout(id)
  }, [location.pathname])

  return (
    <>
      <Preloader onDone={onLoaded} />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110]
          focus:border focus:border-ink focus:bg-limewash focus:px-5 focus:py-3 focus:text-label
          focus:uppercase focus:tracking-label"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Routes>
          <Route path="/" element={<Home started={started} />} />
          <Route path="/work/:slug" element={<Project />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <Shell />
    </SmoothScrollProvider>
  )
}
