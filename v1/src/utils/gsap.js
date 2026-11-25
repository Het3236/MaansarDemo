// One place to register GSAP plugins, so no component does it twice.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// The site's single easing family. Matches the CSS `ease-arch` token.
gsap.defaults({ ease: 'power3.out', duration: 1 })

export { gsap, ScrollTrigger }
