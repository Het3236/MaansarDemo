import { gsap, SplitText, ScrollTrigger } from './gsap.js'

/* The three entrances everything on the page is built from. Each one is a single
   ScrollTrigger.batch or trigger so a long page does not carry hundreds of them. */

/** `[data-reveal]`: a short rise and fade, batched so siblings stagger together. */
export function reveal(scope, { reduced = false } = {}) {
  const items = gsap.utils.toArray('[data-reveal]', scope)
  if (!items.length || reduced) return
  gsap.set(items, { y: 24, opacity: 0 })
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 1.1, stagger: 0.08, overwrite: true }),
  })
}

/** Headings: SplitText into masked lines, which rise into place. `autoSplit`
 *  re-splits when the fonts land or the width changes, and because the tween is
 *  returned from onSplit, SplitText carries its progress over to the new lines. */
export function headings(scope, { reduced = false, selector = '[data-split]' } = {}) {
  if (reduced) return
  for (const node of gsap.utils.toArray(selector, scope)) {
    SplitText.create(node, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 105,
          duration: 1.15,
          stagger: 0.08,
          scrollTrigger: { trigger: node, start: 'top 86%', once: true },
        }),
    })
  }
}

/** `[data-plate]`: a photograph "drawn, then built". Two hairlines draw the frame,
 *  the photograph wipes up inside it, and (with ScrollSmoother running) the image
 *  drifts inside its frame through `data-speed="auto"` on the <img>. */
export function plates(scope, { reduced = false } = {}) {
  for (const plate of gsap.utils.toArray('[data-plate]', scope)) {
    const frame = plate.querySelector('.plate__frame')
    if (reduced || !frame) continue

    gsap
      .timeline({ scrollTrigger: { trigger: plate, start: 'top 85%', once: true } })
      .fromTo(plate, { '--rule': 0 }, { '--rule': 1, duration: 0.9, ease: 'power2.inOut' })
      .fromTo(
        frame,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3 },
        0.35,
      )
  }
}
