// Brand facts and the copy that is not a project record.
//
// Same rule as v1–v3: nothing is invented. Names come from the logo and brand
// guide, the Instagram handle from the brand guide footer, and every descriptive
// line from what is visible in the studio's own photographs and footage. Fields we
// were not given are left empty and simply do not render.

export const BRAND = {
  name: 'Maansar Studios',
  tagline: 'Interior design and build',
  proposition:
    'We design homes around the people who live in them — the light they wake to, the way they cook, where they put things down.',
  instagram: { handle: '@maansarstudios', url: 'https://www.instagram.com/maansarstudios/' },
  // Left blank deliberately — no email or phone was supplied. Fill `email` and the
  // enquiry form becomes a mail handoff instead of a copy-to-clipboard.
  email: '',
}

export const NAV = [
  { label: 'Studio', href: '#studio' },
  { label: 'Work', href: '#work' },
  { label: 'Rooms', href: '#film' },
  { label: 'Materials', href: '#materials' },
  { label: 'Process', href: '#process' },
]

// Cover photograph per project for the work rail. The hero already uses the
// Mehsana Bungalow living room, so that project leads with its theatre here.
export const COVERS = {
  'mehsana-residence-ii': 'm2-photo-living-c',
  'mehsana-bungalow': 'mb-photo-theatre',
  'arcadia-77-sample-house': 'a77-bedroom-01',
}

// The studio's walk-through footage, cut short and muted (shared with v1/v2).
export const REELS = [
  { key: 'loop-m2-living', project: 'Mehsana Residence II', room: 'Living room', note: 'A teak panel wall beside a glass stair, under a cloud pendant.' },
  { key: 'loop-mb-living', project: 'Mehsana Bungalow', room: 'Entry', note: 'A dark wood console, two planters and a white sculpture.' },
  { key: 'loop-m2-dining', project: 'Mehsana Residence II', room: 'Dining', note: 'A table beside a hanging swing, framed by teak screens.' },
  { key: 'loop-m2-kitchen', project: 'Mehsana Residence II', room: 'Kitchen', note: 'Teak-framed screens and open shelves in front of the kitchen.' },
  { key: 'loop-a77-bedroom', project: 'Arcadia 77 Sample House', room: 'Bedroom', note: 'A dark walnut wall behind a white upholstered bed.' },
  { key: 'loop-mb-theatre', project: 'Mehsana Bungalow', room: 'Home theatre', note: 'Indigo walls, red recliners and a ceiling of pinpoint lights.' },
]

// Every entry is a material that appears in the photographs, paired with one.
export const MATERIALS = [
  { name: 'Teak veneer', note: 'Panelling, screens, headboard walls', swatch: '#7A5343', slug: 'm2-detail-01', alt: 'Teak headboard wall with a brass reading light' },
  { name: 'Terracotta', note: 'Textured panels, lattice screens', swatch: '#A57764', slug: 'mb-living-02', alt: 'Textured terracotta panel wall behind a low sofa' },
  { name: 'Lime plaster', note: 'Double-height walls, kept flat and quiet', swatch: '#E5D8CB', slug: 'm2-living-01', alt: 'Living room seen from the stair, pale plaster above the teak panelling' },
  { name: 'Blackened steel', note: 'Vitrines, stair frames, slim sections', swatch: '#2A2320', slug: 'm2-living-02', alt: 'Black steel display wall beside the living room seating' },
  { name: 'Brass', note: 'Reading lights, temple domes, wall slots', swatch: '#B08D57', slug: 'mb-theatre-02', alt: 'Indigo theatre wall with vertical brass light slots' },
  { name: 'Fluted glass', note: 'Temple doors, wardrobe shutters', swatch: '#9FB1B8', slug: 'mb-temple-01', alt: 'Temple behind fluted glass doors, lit from within' },
]

export const STEPS = [
  {
    title: 'The walk-through',
    body: 'We come to the site before we draw anything. Where the light lands at four in the afternoon decides more than any mood board will.',
  },
  {
    title: 'The plan',
    body: 'Layouts first, in plan and in section. Circulation, sightlines, where the sun gets in and where the storage goes. Nothing decorative is decided yet.',
  },
  {
    title: 'The joinery',
    body: 'Every wardrobe, screen and panel is drawn to the millimetre and made to those drawings. This is where a house stops looking bought and starts looking built.',
  },
  {
    title: 'The handover',
    body: 'Lighting balanced room by room, handles fitted, snags closed. We hand over a house that is finished, not one that is nearly finished.',
  },
]

export const PROJECT_TYPES = [
  'Full home interior',
  'Apartment',
  'Sample house / show flat',
  'Single room',
  'Renovation',
  'Something else',
]
