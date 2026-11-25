import './styles.css'
import { SCENES } from './scenes.js'
import media from './media.json'
import { mountFlight } from './engine.js'

const BRAND = {
  instagram: { handle: '@maansarstudios', url: 'https://www.instagram.com/maansarstudios/' },
  // Left blank deliberately — no email or phone was supplied. Fill `email` and the
  // contact panel offers a mail link as well.
  email: '',
}

// Same records as v1/v2 (src/data/projects.js there), trimmed to what this page shows.
const PROJECTS = [
  { title: 'Mehsana Residence II', category: 'Full home interior', place: 'Mehsana' },
  { title: 'Mehsana Bungalow', category: 'Full home interior', place: 'Mehsana' },
  { title: 'Arcadia 77 Sample House', category: 'Sample house', place: '' },
]

mountFlight(document.getElementById('flight'), {
  scenes: SCENES,
  connectors: media.connectors,
})

const shown = [...new Set(SCENES.map((s) => s.project))]
document.getElementById('contact').innerHTML = `
  <div class="contact__inner">
    <p class="label">Start a project</p>
    <h2 class="contact__title">Tell us about the home you want to live in.</h2>
    <p class="contact__body">
      Full homes, apartments, sample houses and single rooms, designed and built.
      The quickest way to reach the studio is a message on Instagram.
    </p>
    <div class="contact__actions">
      <a class="btn btn--solid" href="${BRAND.instagram.url}" target="_blank" rel="noopener">Message ${BRAND.instagram.handle}</a>
      ${BRAND.email ? `<a class="btn btn--line" href="mailto:${BRAND.email}">${BRAND.email}</a>` : ''}
    </div>

    <div class="rule"></div>

    <div class="contact__grid">
      <div>
        <p class="label">Projects</p>
        <ul class="projects">
          ${PROJECTS.map((p) => `
            <li>
              <span class="projects__title">${p.title}</span>
              <span class="projects__meta">${[p.category, p.place].filter(Boolean).join(' · ')}</span>
            </li>`).join('')}
        </ul>
      </div>
      <div>
        <p class="label">In this walk-through</p>
        <p class="contact__note">
          Every room above is a finished Maansar interior, filmed on site —
          ${shown.join(' and ')}.${media.connectors.some(Boolean)
            ? ' The short passages between rooms are generated to join the shots.'
            : ''}
        </p>
      </div>
    </div>

    <footer class="footer">
      <span>© ${new Date().getFullYear()} Maansar Studios</span>
      <a href="#top">Back to the door ↑</a>
    </footer>
  </div>
`
