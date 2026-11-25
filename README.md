# Maansar Studios — website versions

Three directions for the Maansar Studios website, kept side by side so they can be
reviewed against each other.

## Live preview

| | | |
|---|---|---|
| **Index** | all three versions | https://het3236.github.io/MaansarDemo/ |
| **v1** | the classic studio site — multi-page, smooth scroll, project pages | https://het3236.github.io/MaansarDemo/v1/ |
| **v3** | one walk through a home — scroll scrubs a film of six rooms | https://het3236.github.io/MaansarDemo/v3/ |
| **v4** | drawn, then built — one page, vanilla JS + GSAP, lightest build | https://het3236.github.io/MaansarDemo/v4/ |

The preview is served by GitHub Pages from the `docs/` folder on `main`
(Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/docs`).

## Repository layout

```
v1/      React + Vite, Tailwind, GSAP, Lenis, Framer Motion, react-router
v3/      Vanilla JS + Vite, scroll-scrubbed video
v4/      Vanilla JS + Vite, GSAP 3.15 only
docs/    the published preview (built output — do not edit by hand)
tools/   build-preview.mjs, which produces docs/
```

Each version still runs on its own:

```bash
cd v1 && npm install && npm run dev
```

## Rebuilding the preview

`docs/` is generated. After changing any version, rebuild and commit the result:

```bash
node tools/build-preview.mjs
```

The script builds each version with Vite's `base` set to its subpath
(`/MaansarDemo/v1/` …), copies the output into `docs/<version>/`, prefixes the
root-absolute `/media/...` paths that live in JSX, JSON data and CSS, and writes the
site's `404.html`. That 404 page is what makes deep links into v1's router survive a
reload: GitHub Pages serves it for any unknown path, it bounces `/v1/work/x` to
`/v1/?/work/x`, and a small script in each version's `index.html` puts the real path
back before the app boots.

For a build that is served from a domain root instead, pass an empty prefix:

```bash
node tools/build-preview.mjs --prefix=
```

## Not in this repository

Raw footage (`Assets/`, `v3/media-src/`) and `node_modules/` are excluded. The
processed media each site actually uses is committed under `v<n>/public/media/`.
