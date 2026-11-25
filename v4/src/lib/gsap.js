// Every GSAP plugin this site uses, registered once. Since 3.13 the whole toolset
// ships in the public `gsap` package, so SplitText, ScrollSmoother, MorphSVG,
// DrawSVG and Inertia come from npm like everything else.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { Flip } from 'gsap/Flip'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  SplitText,
  DrawSVGPlugin,
  MorphSVGPlugin,
  MotionPathPlugin,
  Flip,
  Draggable,
  InertiaPlugin,
  CustomEase,
)

// The studio's one ease: quick to leave, long to settle. Same curve as the CSS
// `--ease` token, so CSS transitions and tweens land the same way.
CustomEase.create('plaster', 'M0,0 C0.22,1 0.36,1 1,1')
gsap.defaults({ ease: 'plaster', duration: 1.1 })

// Touch devices resize the viewport height whenever the URL bar moves. Refreshing
// every pin on that would make the page jump.
ScrollTrigger.config({ ignoreMobileResize: true })

export const MQ = {
  desktop: '(min-width: 900px)',
  mobile: '(max-width: 899px)',
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
}

export const prefersReduced = () => window.matchMedia(MQ.reduced).matches

export {
  gsap,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  Flip,
  Draggable,
  MorphSVGPlugin,
  DrawSVGPlugin,
}
