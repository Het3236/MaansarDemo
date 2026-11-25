import { gsap, SplitText } from '../lib/gsap.js'
import { img, SIZES } from '../lib/media.js'
import { BRAND } from '../data/site.js'
import { reveal, plates } from '../lib/reveal.js'

/* The one paragraph the studio would say if it only got one. It is read at the
   speed you scroll: SplitText breaks it into words and each word comes up to full
   ink as it passes the middle of the screen. */

export function html() {
  return `
  <section class="studio section" id="studio" aria-labelledby="studio-title">
    <div class="shell studio__grid">
      <p class="label studio__index" data-reveal>01 — The studio</p>
      <h2 class="studio__statement" id="studio-title">${BRAND.proposition}</h2>

      <div class="studio__cols">
        <p data-reveal>
          We design and build interiors: full homes, sample houses, single rooms. The work
          starts with how a family already lives — where they eat, what they keep, which
          corner gets the afternoon — and ends with joinery that is installed, wired and cleaned.
        </p>
        <p data-reveal>
          We draw in materials rather than moods. Teak, lime plaster, powder-coated steel,
          stone, fluted glass. When a wall is going to carry the whole room, we say so early
          and spend the budget there.
        </p>
        <dl class="studio__pairs" data-reveal>
          <div><dt class="label">Design</dt><dd>Layouts, joinery drawings, materials</dd></div>
          <div><dt class="label">Build</dt><dd>Site execution and finishing</dd></div>
        </dl>
      </div>
    </div>

    <div class="shell studio__plates">
      <figure class="plate plate--tall" data-plate>
        <div class="plate__frame">${img('m2-photo-living-b', {
          alt: 'A steel-framed vitrine holding ceramics, beside a curtained window',
          sizes: SIZES.half,
          cls: 'plate__img',
          speed: 'auto',
        })}</div>
        <figcaption class="label" data-lag="0.15">Mehsana Residence II — living room vitrine</figcaption>
      </figure>
      <figure class="plate plate--low" data-plate>
        <div class="plate__frame">${img('m2-temple-02', {
          alt: 'A temple with a carved teak column standing on a white stone plinth',
          sizes: SIZES.half,
          cls: 'plate__img',
          speed: 'auto',
        })}</div>
        <figcaption class="label" data-lag="0.25">Mehsana Residence II — temple</figcaption>
      </figure>
    </div>
  </section>`
}

export function init(root, { reduced }) {
  const el = root.querySelector('.studio')
  reveal(el)
  plates(el, { reduced })
  if (reduced) return

  SplitText.create(el.querySelector('.studio__statement'), {
    type: 'words',
    wordsClass: 'word',
    autoSplit: true,
    onSplit: (self) =>
      gsap.fromTo(
        self.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: self.elements[0], start: 'top 78%', end: 'bottom 42%', scrub: true },
        },
      ),
  })
}
