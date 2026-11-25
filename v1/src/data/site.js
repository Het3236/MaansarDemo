// Single source of truth for brand-level facts.
// Nothing here is invented: names come from the logo and brand guide, the
// Instagram handle from the brand guide footer. Fields we were not given are
// left empty and simply do not render.

export const BRAND = {
  name: 'Maansar Studios',
  shortName: 'Maansar',
  tagline: 'Interior design and build',
  // The one line the whole site is built around.
  proposition:
    'We design homes around the people who live in them — the light they wake to, the way they cook, where they put things down.',
  instagram: {
    handle: '@maansarstudios',
    url: 'https://www.instagram.com/maansarstudios/',
  },
  // Left blank deliberately — no address, phone or email was provided.
  email: '',
  phone: '',
  location: '',
}

export const NAV = [
  { label: 'Studio', href: '/#studio' },
  { label: 'Work', href: '/#work' },
  { label: 'Approach', href: '/#approach' },
  { label: 'Process', href: '/#process' },
  { label: 'Instagram', href: '/#instagram' },
  { label: 'Contact', href: '/#contact' },
]

export const PROJECT_TYPES = [
  'Full home interior',
  'Apartment',
  'Sample house / show flat',
  'Single room',
  'Renovation',
  'Something else',
]
