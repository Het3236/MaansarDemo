# Maansar Studios — v3

The studio website as one walk through a home. As you scroll, the camera moves
through six finished Maansar rooms — entry, living, temple, dining, bedroom,
home theatre — and ends on the enquiry. Scroll drives the video's time, so
scrolling back up walks you backwards.

It is built on the scrub technique from
[scroll-world](https://github.com/oso95/scroll-world) (MIT). Scroll-world
normally generates its whole world with AI. Here the rooms are real footage
from the studio's own reels, and only the optional passages *between* rooms
are generated.

`../v1` and `../v2` are the earlier sites and still run on their own.

```bash
npm install
npm run media    # cut + encode the footage from ../Assets (needs ../Assets present)
npm run dev      # http://localhost:5388
npm run build    # production build into dist/
```

`public/media/scenes` is already built, so `npm run dev` works without running
`media` first. Run it again when you change a shot or add a connector.

## How it fits together

```
src/scenes.js           the six scenes: which reel, which seconds, the copy
src/engine.js           the scrub engine (adapted from scroll-world)
src/main.js             mounts the flight, renders the contact panel
src/styles.css          the whole design system
src/media.json          written by `npm run media` — which connectors exist
scripts/build-media.mjs footage → scrub encodes, posters, seam frames
media-src/connectors/   where generated joins go; README + JOBS.md explain
media-src/frames/       seam frames for connector generation (generated, gitignored)
public/media/scenes/    <id>.mp4, <id>-m.mp4, <id>.webp, <id>-m.webp (+ conn-<i>)
```

**A scene is one continuous shot.** The reels are edited, with a cut every 3–4
seconds, and scrubbing across a cut reads as a jump. Each `from`/`to` in
`scenes.js` was found with ffmpeg's scene-change detection and then trimmed by
eye. If you pick a new range, check it has no cut: `npm run media` writes
`media-src/frames/<id>-first.png` and `-last.png`, and both should show the
same shot.

**The footage is 9:16, and the page is built around that.** On desktop the clip
plays in a portrait frame beside the copy. The room around it is a blurred wash
of the current frame, painted into a 54×96 canvas (cheap, and no second video).
On phones the frame is the whole screen, so the mobile version is native
portrait, not a crop. Phones get the lighter `-m.mp4` encodes (720 wide, GOP 4).

**Scroll pacing is per scene.** `scroll` is how many screen-heights a scene lasts.
`linger` (0–0.6) slows the camera in the middle, where the copy peaks, and speeds
it up toward the seams. The first and last frames of a clip are never moved.

**There are two kinds of seam.** Between two real shots the engine dissolves over
0.55 screens with a slight forward push: the outgoing room grows as the next one
fades up over it. With a connector in place, the seam is frame-matched and
crossfades over 0.07 screens. Both are decided from `media.json`, so no code
changes when connectors arrive.

**Kept from scroll-world, on purpose.**
- Clips load as Blobs, so they can always be seeked, whatever the host does
  with range requests.
- Seeks are coalesced, so a fast flick can't freeze the decoder.
- The poster stays up until a video frame has painted, and videos are primed on
  first touch. Without this, iOS shows a blank scene.
- On touch devices, height-only resizes are ignored, so the URL bar can't make
  the page jump.
If you port the engine, keep the `muted` and `playsinline` attributes.

**Reduced motion loads no video at all.** The posters dissolve as you scroll,
with no push.

**Development helper.** In dev only, `window.__flight` exposes the segment chain
and `jumpTo(i)`.

## Content

The copy only describes what is visible in each shot. `BRAND.email` in
`src/main.js` is empty because no email was supplied, so the contact panel
points to Instagram. Fill in the email and a mail button appears.

## Deploying

Any static host will do. Set the real domain in the canonical URL, the Open
Graph tags and the JSON-LD block in `index.html`. The scene videos total about
25 MB on desktop and 15 MB on phones, but the engine only fetches the clips
within about two screens of where the visitor is.
