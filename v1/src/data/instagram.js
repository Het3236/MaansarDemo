import { BRAND } from './site'

/**
 * The studio journal grid.
 *
 * No Instagram permalinks were supplied, so every tile links to the studio's
 * profile rather than to a fabricated post URL. To wire a tile to its real
 * post, put the permalink in `url` — the component uses it as-is.
 */
export const IG_POSTS = [
  { slug: 'm2-photo-living-a', caption: 'Chamfered teak, brass pins, one long sofa.', url: '' },
  { slug: 'mb-theatre-02', caption: 'Indigo walls and brass slots in the theatre.', url: '' },
  { slug: 'm2-detail-02', caption: 'The cloud pendant, from underneath.', url: '' },
  { slug: 'a77-bedroom-10', caption: 'A painted palm wall behind the bed.', url: '' },
  { slug: 'm2-temple-01', caption: 'Teak screen, brass dome, Om.', url: '' },
  { slug: 'mb-kids-02', caption: 'Every tread of the loft stair is storage.', url: '' },
  { slug: 'm2-dining-01', caption: 'A swing beside the dining table.', url: '' },
  { slug: 'm2-photo-living-b', caption: 'Steel frame, ceramics, afternoon light.', url: '' },
]

export const igLink = (post) => post.url || BRAND.instagram.url
