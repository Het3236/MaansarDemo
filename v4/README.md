# Maansar Studios — v4

The studio website, drawn and then built. Vanilla JS and Vite, and one library:
[GSAP](https://github.com/greensock/GSAP) 3.15. Since 3.13 the whole GSAP toolset
is free and ships in the public `gsap` package, and this version uses it for
everything: no Lenis, no hand-written SplitText, no React.

`../v1`, `../v2` and `../v3` are the earlier sites and still run on their own. v4
shares their brand tokens, copy and processed media, and nothing else.

```bash
npm install
npm run dev      # http://localhost:5173 (the launch config uses 5488)
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## The idea

v2 and v3 were dark rooms. v4 goes back to the brand guide's own limewash and
treats the page as a drawing board: hairlines first, then the photograph. Each
GSAP plugin has one job.

| Where | What happens | Plugin |
| --- | --- | --- |
| Loader | The full logo draws in outline, fills, and lifts away | DrawSVG |
| Hero | An arched doorway in a limewash wall. Scrolling pushes you through it: the arch morphs into a rectangle bigger than the screen | MorphSVG, ScrollTrigger (pin) |
| Everywhere | Smooth scroll on pointer devices, and `data-speed` parallax on photographs inside their frames | ScrollSmoother |
| Headings | Masked lines rise into place and re-split on resize and font load | SplitText (`autoSplit`, `mask`) |
| Studio | The proposition comes up to full ink one word at a time as you read | SplitText, ScrollTrigger (scrub) |
| Work | A pinned horizontal rail; each cover drifts inside its frame | ScrollTrigger (`containerAnimation`) |
| Project | The cover you click grows into the open project, then goes back when you close it | Flip |
| Rooms | Six muted loops stacked like prints; each scroll step slides the next one over | ScrollTrigger (pin, scrub) |
| Materials | A board of six samples you can throw | Draggable, Inertia |
| Process | A floor plan drawn in four passes, one per stage, with a dot walking in from the front door | DrawSVG, MotionPath |
| Footer | The logo signs off, drawn again | DrawSVG |
| All of it | One ease, `plaster`, the same curve as the CSS `--ease` token | CustomEase |

## Structure

```
index.html              shell: loader, nav, menu, smooth wrapper, project dialog
src/main.js             renders the sections, owns gsap.matchMedia and the smoother
src/lib/gsap.js         plugin registration, the ease, media queries
src/lib/reveal.js       the three shared entrances: reveal, headings, plates
src/lib/media.js        responsive <img> with the inline blurred placeholder
src/sections/           hero, studio, work, project, film, materials, process,
                        contact (and footer), chrome (loader, nav, menu)
src/data/               site.js (brand, reels, materials, steps), projects.js,
                        media.json, loops.json, logo.js
src/styles.css          the whole design system
public/media/           img/ (WebP, 2–4 widths), video/ (muted loops), brand/
```

Each section module exports `html()`, a string template over the data, and
`init(root, conditions)`, which builds its animation and returns a cleanup when
it needs one.

## Things worth knowing before you edit

**Everything responsive lives in one `gsap.matchMedia` call** in `main.js`, in page
order. When the viewport crosses 900px or the visitor turns reduced motion on or
off, GSAP reverts every tween, ScrollTrigger, pin and SplitText made there, and the
function runs again from clean. Create new ScrollTriggers inside it and in the
order their sections appear, or pins further down the page will measure wrong.

**matchMedia only runs its callback when at least one condition matches.** That is
why `mobile` is listed even though nothing reads it. Remove it and phones get no
animation at all.

**Anything `position: fixed` goes outside `#smooth-wrapper`.** ScrollSmoother
transforms `#smooth-content`, and a transformed ancestor breaks fixed positioning.
The loader, nav, menu, progress bar and project dialog all sit outside it for that
reason.

**The hero morph is rebuilt from the viewport on every refresh.** The arch and the
room are generated in pixel space by `archPath()` and `roomPath()` in `hero.js`,
with the same commands in the same order, so MorphSVG matches them point for point.
The morph uses function-based values, which ScrollTrigger re-reads on refresh. If
you change the arch, keep both paths structurally identical.

**The project dialog has its own scroller.** ScrollSmoother is paused while it is
open. Its reveals are ScrollTriggers bound to that scroller, created per open inside
a `gsap.context`, and refreshed once the dialog is visible, because triggers created
while it was `display: none` measure nothing. Closing uses `Flip.fit()` rather than
`Flip.from()`, because the cover sits inside a clipped, transformed rail and cannot
be animated out of it. Projects deep-link as `/#work/<slug>`, and the back button
closes them.

**Only one video plays.** The Rooms section gives a `<video>` its `src` only when
it is the current or next clip, and pauses the others. On save-data or low-core
devices nothing autoplays.

**The floor plan is a diagram, not a client's house.** It carries no dimensions.
The numbers in the SVG are drawing coordinates.

## Motion

`prefers-reduced-motion` turns off the loader, ScrollSmoother, every pin and every
scrubbed animation. The hero shows the room in the arch, the loops become a grid
with controls, the plan is shown finished, and all four stages are listed. The
Materials board can still be dragged, because the visitor moves it themselves.

## Design system

The brand guide's palette on limewash. The tokens are at the top of `styles.css`.

| Token | Hex | Use |
| --- | --- | --- |
| `--limewash` | `#FAF8F5` | page |
| `--plaster` | `#F2EAE3` | panels, the plan's paper |
| `--ink` | `#2A2320` | text, walls in the plan |
| `--umber` | `#1D1815` | the Rooms section and the menu |
| `--terracotta` | `#A57764` | the logo, hairlines, the walking dot |
| `--clay` | `#7A5343` | the filled button, links, joinery in the plan |

Playfair Display for headings, Karla for text at 17px and never below 16px.
All-caps only on `.label`. Square corners, hairline rules, one filled button per
screen.

## Content

Same rule as v1–v3: every descriptive line comes from what is visible in the
studio's photographs and footage. The reel and material captions in `site.js` were
checked against the frames. `BRAND.email` is empty because no address was supplied,
so the enquiry form copies the message to the clipboard for Instagram. Fill it in
and submitting becomes a mail handoff.

## Deploying

Any static host will do. Deep links use the hash, so no SPA fallback is needed
(`vercel.json` keeps one anyway). Set the real domain in the canonical URL, the
Open Graph tags and the JSON-LD block in `index.html`.

The script bundle is about 130 KB gzipped: GSAP with eleven plugins, plus the
inline image placeholders in `media.json`.

**Development helper.** In dev only, `window.__v4` exposes `gsap`, `ScrollTrigger`,
`Draggable`, the current `smoother` and the project dialog (`__v4.project.open(slug)`).
