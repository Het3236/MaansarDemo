// The flight, in order. One entry per scene.
//
// `source` points at a single continuous shot inside one of the studio's own reels
// (../Assets). `from`/`to` are seconds, chosen by cut detection and then trimmed by
// eye so no edit falls inside the range — a cut inside a scrubbed clip reads as a
// jump. `scripts/build-media.mjs` turns each range into the files under
// public/media/scenes/.
//
// Every descriptive line is drawn from what is visible in that shot. Nothing about
// clients, budgets, dates or sizes is stated.
//
// The joins between scenes are `connectors`: optional generated clips whose first
// frame is the previous scene's last frame and whose last frame is the next scene's
// first. Until one exists the seam dissolves instead — see media-src/connectors/README.md.

export const SCENES = [
  {
    id: 'arrival',
    label: 'Entry',
    project: 'Mehsana Bungalow',
    source: 'Mehsana Bunglow Project/REELS/Living Room.mp4',
    from: 3.36,
    to: 6.1,
    scroll: 1.7,
    linger: 0.35,
    eyebrow: 'Maansar Studios — interior design and build',
    title: 'The house starts at the door.',
    body: 'A dark wood console, two planters and a white sculpture under a cove-lit ceiling. The first thing you see sets the tone for every room after it.',
  },
  {
    id: 'living',
    label: 'Living',
    project: 'Mehsana Bungalow',
    source: 'Mehsana Bunglow Project/REELS/Living Room.mp4',
    from: 22.78,
    to: 26.58,
    scroll: 1.4,
    linger: 0.3,
    eyebrow: 'Living room',
    title: 'One wall, and nothing competing with it.',
    body: 'Textured terracotta panelling runs behind the screen, with a slim floating console beneath it. The floor, ceiling and furniture stay pale so the wall carries the room.',
  },
  {
    id: 'temple',
    label: 'Temple',
    project: 'Mehsana Bungalow',
    source: 'Mehsana Bunglow Project/REELS/Temple, Dining and Kitchen.mp4',
    from: 7.66,
    to: 11.1,
    scroll: 1.4,
    linger: 0.3,
    eyebrow: 'Temple',
    title: 'A prayer room given the same care as the living room.',
    body: 'Painted arches, brass shelving and tall fluted-glass panels, lit from within so the room glows when the rest of the house is dark.',
  },
  {
    id: 'dining',
    label: 'Dining',
    project: 'Arcadia 77 Sample House',
    source: 'Arcadia 77 Sample House/REELS/Dining and Kitchen.mp4',
    from: 0.05,
    to: 3.38,
    scroll: 1.3,
    linger: 0.25,
    eyebrow: 'Dining',
    title: 'One clear idea per room.',
    body: 'A white stone table, blue-grey chairs and a lit ceiling cove, seen past a lattice column. A show home has to explain itself in a single walk-through.',
  },
  {
    id: 'bedroom',
    label: 'Bedroom',
    project: 'Mehsana Bungalow',
    source: 'Mehsana Bunglow Project/REELS/Bedroom-2.mp4',
    from: 19.0,
    to: 22.6,
    scroll: 1.4,
    linger: 0.3,
    eyebrow: 'Bedroom',
    title: 'Upstairs, the rooms change temperature.',
    body: 'Walnut panelling, a sculpted mirror and spiral pendant lights beside a pale upholstered bed. It is warmer and quieter than the rooms below.',
  },
  {
    id: 'theatre',
    label: 'Theatre',
    project: 'Mehsana Bungalow',
    source: 'Mehsana Bunglow Project/REELS/Home Theatre.mp4',
    from: 0.08,
    to: 7.7,
    scroll: 2.2,
    linger: 0.2,
    eyebrow: 'Home theatre',
    title: 'And one room built for the dark.',
    body: 'Deep blue walls, red recliners and a ceiling of pinpoint lights. We design each room around how it will be used. Tell us about yours.',
    cta: {
      primary: { label: 'Start a project', href: '#contact' },
      secondary: { label: 'See more on Instagram', href: 'https://www.instagram.com/maansarstudios/' },
    },
  },
]

// Prompts for the generated joins, one per seam. Written for a grounded, photoreal
// walkthrough (scroll-world architecture A grammar): the camera keeps drifting
// forward through the seam and never pulls back.
export const CONNECTOR_PROMPTS = [
  'Single continuous handheld-gimbal camera move, no cuts, photoreal interior. Continue the slow forward drift past the entry console and sculpture, turn gently through the open doorway, and glide into a bright living room with a textured terracotta panelled wall and a wall-mounted screen. Soft daylight, pale marble floor. Empty, unoccupied, no people. Smooth, slow, steady. No text.',
  'Single continuous gimbal camera move, no cuts, photoreal interior. Continue drifting forward along the terracotta living wall, pass through a wide opening, and arrive facing a temple of painted arches, brass shelves and tall fluted-glass panels. Warm light. Empty, unoccupied, no people. Smooth, slow, steady. No text.',
  'Single continuous gimbal camera move, no cuts, photoreal interior. Continue forward past the temple glass, move out into an open-plan space, and glide toward a dining table in white stone with blue-grey chairs, seen past a tall lattice column. Soft daylight. Empty, unoccupied, no people. Smooth, slow, steady. No text.',
  'Single continuous gimbal camera move, no cuts, photoreal interior. Continue forward past the dining table, through a doorway and along a short corridor, arriving in a calm room with walnut panelling, a sculpted mirror and spiral pendant lights. Empty, unoccupied, no people, architectural, tasteful. Smooth, slow, steady. No text.',
  'Single continuous gimbal camera move, no cuts, photoreal interior. Continue forward out of the walnut-panelled room, the light dimming, through a doorway into a home theatre with deep blue walls, red recliner seats and a ceiling of pinpoint lights. Empty, unoccupied, no people. Smooth, slow, steady. No text.',
]
