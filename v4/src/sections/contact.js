import { gsap } from '../lib/gsap.js'
import { BRAND, PROJECT_TYPES } from '../data/site.js'
import { LOGO_PATHS, LOGO_VIEWBOX } from '../data/logo.js'
import { headings, reveal } from '../lib/reveal.js'

/* The enquiry, and the footer.

   No email address or phone number was supplied, so the form does not pretend to
   send anything. It composes the enquiry and copies it for the visitor to send on
   Instagram, the one channel the studio actually has. Put an address in
   BRAND.email and submit becomes a normal mail handoff.

   The footer signs off with the full logo, drawn by DrawSVG as it scrolls in. */

export function html() {
  return `
  <section class="contact section" id="contact" aria-labelledby="contact-title">
    <div class="shell contact__grid">
      <div class="contact__intro">
        <p class="label" data-reveal>06 — Start something</p>
        <h2 class="display" id="contact-title" data-split>Tell us about the house.</h2>
        <p class="lede" data-reveal>
          A room, a floor or the whole thing. Say what you have and what you want out of it,
          and we will tell you honestly whether we are the right studio for it.
        </p>
        <a class="contact__handle" href="${BRAND.instagram.url}" target="_blank" rel="noopener" data-reveal>${BRAND.instagram.handle}</a>
      </div>

      <form class="form" novalidate data-reveal>
        <fieldset>
          <legend class="label">What is it</legend>
          <div class="chips">
            ${PROJECT_TYPES.map(
              (t, i) => `<button type="button" class="chip" aria-pressed="${i === 0}">${t}</button>`,
            ).join('')}
          </div>
        </fieldset>
        <label class="field">
          <span class="label">Your name</span>
          <input type="text" name="name" autocomplete="name" />
        </label>
        <label class="field">
          <span class="label">The house</span>
          <textarea name="message" rows="4" placeholder="Three bedrooms, possession in March, we want to keep the existing flooring…"></textarea>
        </label>
        <div class="form__submit">
          <button type="submit" class="btn btn--solid">${BRAND.email ? 'Send enquiry' : 'Copy enquiry'}</button>
          <p class="form__status" role="status">${BRAND.email ? '' : 'We copy it to your clipboard, ready to send on Instagram.'}</p>
        </div>
      </form>
    </div>
  </section>`
}

export function footerHtml() {
  return `
    <div class="shell footer__inner">
      <svg class="footer__logo" viewBox="${LOGO_VIEWBOX}" role="img" aria-label="${BRAND.name}">
        ${LOGO_PATHS.map((d) => `<path d="${d}" />`).join('')}
      </svg>
      <div class="footer__row">
        <span>© ${new Date().getFullYear()} ${BRAND.name}</span>
        <a href="${BRAND.instagram.url}" target="_blank" rel="noopener">Instagram</a>
        <a href="#top" data-scroll-to>Back to the door ↑</a>
      </div>
    </div>`
}

/** Crop a logo SVG's viewBox to its ink, so it can be sized by its visible edges. */
export function fitLogo(svg) {
  try {
    const b = svg.getBBox()
    if (b.width) svg.setAttribute('viewBox', `${b.x} ${b.y} ${b.width} ${b.height}`)
  } catch {
    /* not rendered yet */
  }
}

export function init(root, { reduced }) {
  const el = root.querySelector('.contact')
  headings(el, { reduced })
  reveal(el, { reduced })

  const form = el.querySelector('form')
  const status = form.querySelector('.form__status')
  const chips = [...form.querySelectorAll('.chip')]
  const idle = status.textContent

  const ac = new AbortController()
  chips.forEach((chip) =>
    chip.addEventListener(
      'click',
      () => chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip))),
      { signal: ac.signal },
    ),
  )

  form.addEventListener(
    'submit',
    async (e) => {
      e.preventDefault()
      const type = chips.find((c) => c.getAttribute('aria-pressed') === 'true')?.textContent || ''
      const name = form.elements.name.value.trim()
      const message = form.elements.message.value.trim()
      const text = [`Enquiry — ${type}`, name ? `From: ${name}` : null, '', message || '(no message yet)']
        .filter((l) => l !== null)
        .join('\n')

      if (BRAND.email) {
        location.href = `mailto:${BRAND.email}?subject=${encodeURIComponent(`Enquiry — ${type}`)}&body=${encodeURIComponent(text)}`
        return
      }
      try {
        await navigator.clipboard.writeText(text)
        status.textContent = `Copied. Paste it to ${BRAND.instagram.handle} in a direct message.`
      } catch {
        status.textContent = `Your browser blocked the clipboard. Send the same details to ${BRAND.instagram.handle}.`
      }
      setTimeout(() => (status.textContent = idle), 6000)
    },
    { signal: ac.signal },
  )

  // The sign-off: the logo draws in outline, then fills.
  const logo = document.querySelector('.footer__logo')
  fitLogo(logo)
  if (!reduced) {
    const paths = logo.querySelectorAll('path')
    gsap
      .timeline({ scrollTrigger: { trigger: logo, start: 'top 90%', once: true } })
      .fromTo(paths, { drawSVG: 0, fillOpacity: 0 }, { drawSVG: '100%', duration: 2, stagger: 0.25, ease: 'power2.inOut' })
      .to(paths, { fillOpacity: 1, duration: 0.9, ease: 'power1.inOut' }, '-=0.6')
  }

  return () => ac.abort()
}
