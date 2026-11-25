# Maansar Studios

The studio website. React + Vite, Tailwind for the design system, GSAP/ScrollTrigger
for scroll work, Lenis for smooth scrolling, Framer Motion for the mobile menu.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # regenerates sitemap.xml, then builds to dist/
npm run preview  # serve the production build
```

## Structure

```
src/
  components/   Figure, Logo, Nav, Footer, Preloader, Reveal, Seo
  sections/     Hero, Intro, Work, Approach, Motion, Process, Instagram, Contact
  pages/        Home, Project, NotFound
  hooks/        useMediaQuery (+ reduced motion, low power), useSmoothScroll
  utils/        gsap (plugin registration), media (responsive image helper)
  data/         site.js, projects.js, instagram.js, media.json, loops.json
public/media/   img/ (WebP, four widths each), video/ (muted loops), brand/ (logo)
```

## Design system

Straight from the brand guide, encoded in `tailwind.config.js`:

| Token | Hex | Use |
| --- | --- | --- |
| `terracotta` | `#A57764` | the logo colour; accents only |
| `clay` | `#7A5343` | buttons and links |
| `plaster` | `#F2EAE3` | tinted panels |
| `limewash` | `#FAF8F5` | page background |
| `ink` | `#2A2320` | text and dark sections |
| `indigo` | `#2F3E52` | rare |

Playfair Display for headings (sentence case), Karla for text at 17px and never
below 16px. All-caps is reserved for the small `.label` class. Square corners,
hairline rules instead of shadows, one filled button per screen.

## Things worth knowing before you edit

**Content is data.** `src/data/projects.js` holds every project, its copy and its
ordered gallery. `src/data/site.js` holds the brand name, nav and Instagram handle.
Renaming a project or reordering the portfolio is a one-file change.

**`BRAND.email` and `BRAND.phone` are empty.** No contact details were supplied, so
they are blank and the site simply does not render those rows. Fill `email` in
`site.js` and the enquiry form switches from "copy this and send it to us on
Instagram" to a normal mail handoff — see `onSubmit` in `sections/Contact.jsx`.
Point that handler at a real endpoint when you have one.

**Instagram tiles link to the profile, not to posts.** No permalinks were provided.
Put a real post URL in a tile's `url` field in `src/data/instagram.js` and that tile
starts using it.

**Images are generated.** Everything under `public/media` was produced from the raw
footage and photographs in `../Assets`: stills pulled from the reels, seven
photographs, and six short muted loops. Each image ships as WebP at 640/1080/1600/2200
plus an inline blurred placeholder recorded in `src/data/media.json`. Add an image by
adding its slug to that manifest and dropping the WebP files alongside.

**Headings measure their own line breaks.** `SplitLines` renders the text, measures
where the browser wrapped it, then rebuilds it as one mask per line. Do not hard-code
line breaks — they would escape the mask at other widths. It also keeps React's node
and the animated node separate, because React cannot reconcile DOM an effect rewrote.

**The horizontal reel section uses `position: sticky`, not ScrollTrigger's `pin`.**
Pinning wraps the section in a spacer element that React did not create and cannot
remove on navigation, which crashes the tree. If you add another pinned section, use
the same sticky pattern.

**Parallax on an image keeps a constant scale above 1.** Animating scale down to 1
while translating pulls the image off its own frame and shows the panel behind it.

## Motion

Every animation is disabled by `prefers-reduced-motion` — including Lenis and the
preloader, which are motion effects like any other. Video loops are replaced by their
poster frames on low-core, low-memory or save-data devices (`useIsLowPower`).
Reel clips only fetch and play while on screen.

## Deploying

Static host, SPA fallback required so `/work/<slug>` resolves. `public/_redirects`
covers Netlify, `vercel.json` covers Vercel; on nginx use `try_files $uri /index.html`.

Set the real domain in three places before going live: the canonical and Open Graph
URLs in `index.html`, the JSON-LD block in the same file, and `SITE_URL` for
`gen-sitemap.mjs` (defaults to `https://maansarstudios.com`).
