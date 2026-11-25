// Project records.
//
// Every descriptive line below is drawn from what is actually visible in the
// photographs and film supplied for each project — materials, colours, joinery,
// rooms. Nothing about budgets, dates, square footage, awards or client names
// is stated, because none of that was provided.
//
// Locations come from the source folder names ("Mehsana"); where a location was
// not given, the field is left empty and the site simply omits it.

export const PROJECTS = [
  {
    slug: 'mehsana-residence-ii',
    title: 'Mehsana Residence II',
    category: 'Full home interior',
    location: 'Mehsana',
    order: 1,
    // One line, used on the index card.
    summary: 'A double-height living room in teak and lime plaster, wrapped around a steel-framed vitrine.',
    intro:
      'The house turns on its living room. Two storeys of plaster on three sides, teak on the fourth, and a black steel vitrine tall enough that you read the whole wall at once when you come through the door.',
    story: [
      'Teak runs through the house as the constant. It panels the headboard walls, frames the kitchen screens, carries the temple, and returns in the living room as a full-height field of chamfered squares. Everything else — plaster, terrazzo-toned floors, linen upholstery — stays quiet enough to let it read.',
      'The plan is open on the ground floor. Living, dining and kitchen share one volume, separated by teak screens rather than walls, so the sightline from the entry door runs the full depth of the house. A swing hangs beside the dining table. The stair is glass and steel, kept slim so it does not interrupt the double height.',
      'Upstairs the rooms change temperature. Warm teak and brass in the main bedroom, grey lacquer and mirror in the dressing rooms, a terracotta-patterned wall behind one bed. The wardrobes are floor-to-ceiling in every room, with handles milled into the shutter edge instead of applied.',
    ],
    rooms: 'Living, dining, kitchen, temple, five bedrooms, dressing rooms',
    materials: 'Teak veneer, lime plaster, black powder-coated steel, brass, fluted glass',
    hero: 'm2-photo-living-c',
    cover: 'm2-photo-living-c',
    coverAlt:
      'Double-height living room in Mehsana Residence II with teak panelling, a black steel vitrine and pale linen sofas',
    // Ordered gallery. `wide` marks images that get a full-bleed or two-column slot.
    gallery: [
      { slug: 'm2-photo-living-a', alt: 'Living room seating below a chamfered teak wall with brass detailing', wide: true },
      { slug: 'm2-living-03', alt: 'Living room with a cloud-form pendant and a black steel display wall' },
      { slug: 'm2-living-04', alt: 'Marble coffee table and low linen sofas in the double-height living room' },
      { slug: 'm2-photo-living-b', alt: 'Steel-framed vitrine with ceramics beside a curtained window' },
      { slug: 'm2-living-01', alt: 'Living room seen from the stair, with teak panelling and a glass balustrade' },
      { slug: 'm2-living-06', alt: 'Open-plan view from living through to the dining area', wide: true },
      { slug: 'm2-dining-01', alt: 'Dining table beside a hanging swing framed by teak screens' },
      { slug: 'm2-dining-02', alt: 'Dining chairs under a cluster pendant with the kitchen beyond' },
      { slug: 'm2-kitchen-02', alt: 'Kitchen with pale shaker fronts, teak screens and a dark glass upper run', wide: true },
      { slug: 'm2-kitchen-01', alt: 'Kitchen counter run in stone with a teak column screen' },
      { slug: 'm2-kitchen-03', alt: 'Kitchen worktop and tall units in teak and cream' },
      { slug: 'm2-entry-01', alt: 'Entry lobby with a teak volume and a terracotta lattice screen' },
      { slug: 'm2-temple-02', alt: 'Temple with a carved teak column and a white stone plinth' },
      { slug: 'm2-temple-01', alt: 'Temple screen in teak with a brass dome and an Om motif' },
      { slug: 'm2-bedroom-02', alt: 'Bedroom with a full-height teak headboard wall and a cove-lit ceiling', wide: true },
      { slug: 'm2-bedroom-03', alt: 'Bed against teak panelling with a wall clock and glass vases' },
      { slug: 'm2-bedroom-01', alt: 'Bedroom with a wall-mounted television on teak and a low console' },
      { slug: 'm2-bedroom-05', alt: 'Bedroom with checked curtains, an armchair and a teak feature wall' },
      { slug: 'm2-detail-01', alt: 'Headboard detail in teak with a brass reading light and glass vases' },
      { slug: 'm2-wardrobe-01', alt: 'Wardrobe run in teak with dark reeded glass shutters' },
      { slug: 'm2-bedroom-06', alt: 'Bedroom with a leather headboard, framed prints and pale walls', wide: true },
      { slug: 'm2-bedroom-07', alt: 'Bed with a cream side table and a dark upholstered headboard' },
      { slug: 'm2-bedroom-08', alt: 'Bedroom with a padded headboard wall and a mirrored wardrobe edge' },
      { slug: 'm2-bedroom-09', alt: 'Bedroom with a terracotta-patterned wall and a tan leather headboard' },
      { slug: 'm2-wardrobe-03', alt: 'Grey lacquer wardrobes with a teak plinth beside the bed' },
      { slug: 'm2-wardrobe-04', alt: 'Grey wardrobe run with a full-length mirror' },
      { slug: 'm2-wardrobe-02', alt: 'Dressing room in cream lacquer with a full-height mirror' },
      { slug: 'm2-dressing-01', alt: 'Dressing area with a teak screen, round stool and mirror' },
      { slug: 'm2-study-01', alt: 'Study desk in stone and teak set into a teak wall' },
      { slug: 'm2-lounge-01', alt: 'Two grey lounge chairs and a side table beside a teak screen' },
      { slug: 'm2-detail-02', alt: 'Sculptural cloud pendant seen from below against the ceiling' },
      { slug: 'm2-living-05', alt: 'Television wall in teak with sheer curtains alongside' },
      { slug: 'm2-living-02', alt: 'Living room vitrine lit from within, holding ceramics and sculpture' },
      { slug: 'm2-bedroom-04', alt: 'Bedroom television wall in teak with a linen armchair' },
    ],
  },

  {
    slug: 'mehsana-bungalow',
    title: 'Mehsana Bungalow',
    category: 'Full home interior',
    location: 'Mehsana',
    order: 2,
    summary: 'A family bungalow that changes character room by room — a terracotta living wall, a blue theatre, a loft bed under a mural.',
    intro:
      'A house with room to be different in each room. The living areas stay warm and level; the theatre goes deep blue; the children get a loft, a mural and a football.',
    story: [
      'The living room sets the register. A textured panel wall in terracotta runs behind the seating, broken by a slim horizontal console and a single large plant. The sofa is low, wide and pale, and a marble coffee table sits square to it. Nothing competes with the wall.',
      'Behind the dining area a temple sits in fluted glass, lit from inside so it reads as a lantern when the rest of the floor is dark. The dining ceiling is coffered in wood; the wall behind it is a white fretwork grid holding small objects.',
      'The home theatre is the one room that commits fully to colour — indigo walls, slotted brass sconces down both sides, a stepped platform and red recliners. The children’s room takes the opposite approach: a loft bed reached by an open-riser stair, storage built into every tread, and a mural that runs the width of the room.',
    ],
    rooms: 'Living, dining, kitchen, temple, home theatre, bedrooms, children’s room',
    materials: 'Textured terracotta panelling, walnut veneer, fluted glass, brass, marble',
    hero: 'mb-photo-living',
    cover: 'mb-photo-living',
    coverAlt:
      'Living room in Mehsana Bungalow with a textured terracotta panel wall, a low pale sofa and a marble coffee table',
    gallery: [
      { slug: 'mb-living-02', alt: 'Terracotta panel wall behind a low sofa with a single large plant', wide: true },
      { slug: 'mb-living-01', alt: 'Entry console in walnut with a sculpture and framed prints' },
      { slug: 'mb-living-03', alt: 'Sectional sofa and marble coffee table under a linear pendant' },
      { slug: 'mb-photo-theatre', alt: 'Home theatre with indigo walls, brass wall slots and red recliner seating', wide: true },
      { slug: 'mb-theatre-01', alt: 'Home theatre seating stepped on a red platform' },
      { slug: 'mb-theatre-02', alt: 'Indigo theatre wall with vertical brass light slots' },
      { slug: 'mb-theatre-03', alt: 'Theatre ceiling with recessed lighting above the seating tiers' },
      { slug: 'mb-photo-kids', alt: 'Children’s room with a loft bed, football headboard and a forest mural', wide: true },
      { slug: 'mb-kids-01', alt: 'Loft bed with a balustrade above a built-in desk in yellow and blue' },
      { slug: 'mb-kids-02', alt: 'Open-riser stair to the loft with storage built into each tread' },
      { slug: 'mb-kids-03', alt: 'Children’s bed below the loft with a football-panel headboard' },
      { slug: 'mb-photo-bedroom', alt: 'Bedroom with walnut panelling, a gallery wall of small prints and a fluted screen', wide: true },
      { slug: 'mb-bedroom-01', alt: 'Bedroom with a carved mirror, pendant light and patterned cushions' },
      { slug: 'mb-bedroom-02', alt: 'Bedroom study nook with open shelving and a lit glass display case' },
      { slug: 'mb-bedroom-03', alt: 'Walnut wall with a framed metal artwork and a console below' },
      { slug: 'mb-temple-01', alt: 'Temple behind fluted glass doors, lit from within', wide: true },
      { slug: 'mb-dining-01', alt: 'Dining table under a coffered wood ceiling against a white fretwork wall' },
      { slug: 'mb-dining-02', alt: 'Tall walnut units flanking the dining and kitchen threshold' },
      { slug: 'mb-kitchen-01', alt: 'Kitchen with a tall integrated fridge run and a view to the dining area' },
    ],
  },

  {
    slug: 'arcadia-77-sample-house',
    title: 'Arcadia 77 Sample House',
    category: 'Sample house',
    location: '',
    order: 3,
    summary: 'A show home built to be understood in one walk-through — four bedrooms, each with a different wall.',
    intro:
      'A sample house has to explain itself quickly. Someone walks in, spends four minutes inside and leaves with an opinion. So each room here is given one clear idea and nothing else.',
    story: [
      'The bedrooms are the argument. Each one takes a single full-height feature wall — dark walnut behind an upholstered bed in the first, a framed print and planting in the second, a slim shelf in walnut running the width of the third, a painted palm mural in the fourth — and then keeps every other surface plain.',
      'Wardrobes are floor-to-ceiling and handleless throughout, in warm grey and cream, so storage reads as wall rather than furniture. Beds are upholstered in off-white with a throw and two cushions; nothing is over-styled.',
      'The dining and kitchen share one open run. A glass-topped dining table with grey chairs sits under a linear pendant, and the kitchen behind it is a single galley in stone and pale lacquer, with the island facing back into the room.',
    ],
    rooms: 'Four bedrooms, dining, kitchen',
    materials: 'Walnut veneer, matt lacquer, stone worktops, upholstered headboards',
    hero: 'a77-bedroom-01',
    cover: 'a77-bedroom-01',
    coverAlt:
      'Bedroom in the Arcadia 77 sample house with a dark walnut feature wall and an upholstered off-white bed',
    gallery: [
      { slug: 'a77-bedroom-01', alt: 'Upholstered bed against a full-height walnut wall', wide: true },
      { slug: 'a77-bedroom-02', alt: 'Bed with a linen throw and a walnut headboard wall' },
      { slug: 'a77-bedroom-03', alt: 'Handleless floor-to-ceiling wardrobes in warm grey' },
      { slug: 'a77-bedroom-04', alt: 'Bedroom with a walnut feature wall and a bedside vase', wide: true },
      { slug: 'a77-bedroom-05', alt: 'Three framed prints above a planter beside the wardrobe run' },
      { slug: 'a77-bedroom-06', alt: 'Cream wardrobes with a dressing counter and mirror' },
      { slug: 'a77-bedroom-07', alt: 'Bed with a grey headboard below a framed botanical print' },
      { slug: 'a77-bedroom-08', alt: 'Walnut wardrobe wall with cove lighting above the bed', wide: true },
      { slug: 'a77-bedroom-09', alt: 'Carved chest of drawers with dried grasses in a glass vase' },
      { slug: 'a77-bedroom-10', alt: 'Bed against a painted palm mural with layered cushions' },
      { slug: 'a77-bedroom-11', alt: 'Grey upholstered bed below the palm mural panel' },
      { slug: 'a77-bedroom-12', alt: 'Slim walnut shelf running the width of the bedroom wall' },
      { slug: 'a77-dining-01', alt: 'Glass dining table with grey chairs under a ring pendant', wide: true },
      { slug: 'a77-dining-02', alt: 'Dining area looking through to the living room seating' },
      { slug: 'a77-kitchen-01', alt: 'Tall kitchen units in cream with integrated appliances' },
      { slug: 'a77-kitchen-02', alt: 'Kitchen island in stone with a marble splashback behind the hob' },
    ],
  },
]

export const getProject = (slug) => PROJECTS.find((p) => p.slug === slug)

export const getRelated = (slug) => PROJECTS.filter((p) => p.slug !== slug)
