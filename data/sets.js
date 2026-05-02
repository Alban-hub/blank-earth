// Sets — Layer 2 of the v2 atlas.
//
// Each set is a curated grouping of countries that belong together
// historically, geographically, or culturally. The achievement is *completing*
// the set — the individual countries are stops along the way.
//
// Schema:
//   id         — stable identifier (used for keying state + DOM)
//   name       — editorial name, displayed on the card
//   countries  — ISO-3 codes, in a meaningful order (canonical sequence)
//   palette    — key into the badge PALETTE (visual hue for the card)
//   art        — key into the art registry (renderArt)
//   teaser     — one-line pedagogical hook (≤ 12 words)
//
// We launch with 12 flagship sets covering the seven thematic shelves from
// the v2 deep-dive: trade routes, civilisations, climate/geography,
// language, microstates, and physical geography. New sets will ship one a
// season afterwards — the v2 deep-dive lists ~50 candidates.

export const SETS = {
  silkRoad: {
    id: 'silkRoad',
    name: 'The Silk Road',
    countries: ['CHN','KAZ','UZB','TKM','IRN','TUR','ITA'],
    palette: 'butter',
    art: 'caravan',
    teaser: 'The overland route from Chang’an to Rome.',
  },

  spiceIslands: {
    id: 'spiceIslands',
    name: 'The Spice Islands',
    countries: ['IND','LKA','IDN','MYS','MDG'],
    palette: 'terracotta',
    art: 'spice-sprig',
    teaser: 'The Indian Ocean rim that gave Europe pepper and cloves.',
  },

  polarCrown: {
    id: 'polarCrown',
    name: 'The Polar Crown',
    countries: ['ISL','NOR','SWE','FIN','RUS','CAN','USA'],
    palette: 'sky',
    art: 'aurora-peaks',
    teaser: 'The seven Arctic-bordering states.',
  },

  cradlesOfCiv: {
    id: 'cradlesOfCiv',
    name: 'Cradles of Civilisation',
    countries: ['EGY','IRQ','IND','CHN','MEX','PER','GRC'],
    palette: 'bone',
    art: 'ziggurat',
    teaser: 'Where humans independently invented cities and writing.',
  },

  fiveMicrostates: {
    id: 'fiveMicrostates',
    name: 'The Five Microstates',
    countries: ['VAT','MCO','SMR','LIE','AND'],
    palette: 'rose',
    art: 'microcrowns',
    teaser: 'Five countries you can drive across in under an hour.',
  },

  maghreb: {
    id: 'maghreb',
    name: 'The Maghreb',
    countries: ['MAR','DZA','TUN','LBY','EGY'],
    palette: 'butter',
    art: 'arch-crescent',
    teaser: 'North Africa’s western reach.',
  },

  stans: {
    id: 'stans',
    name: 'The Stans',
    countries: ['KAZ','UZB','TKM','TJK','KGZ','AFG','PAK'],
    palette: 'sage',
    art: 'yurt-steppe',
    teaser: 'Persian and Turkic suffix tracing the steppe.',
  },

  ringOfFire: {
    id: 'ringOfFire',
    name: 'The Ring of Fire',
    countries: ['JPN','PHL','IDN','NZL','CHL','PER','ECU','COL','MEX','USA','RUS'],
    palette: 'terracotta',
    art: 'volcano-smoke',
    teaser: 'Forty thousand kilometres of subduction zones.',
  },

  caribbeanArc: {
    id: 'caribbeanArc',
    name: 'The Caribbean Arc',
    countries: ['CUB','JAM','HTI','DOM','TTO','BHS','BRB'],
    palette: 'sky',
    art: 'island-arc',
    teaser: 'The island chain bracketing the inland sea.',
  },

  roofOfWorld: {
    id: 'roofOfWorld',
    name: 'The Roof of the World',
    countries: ['NPL','BTN','IND','CHN','PAK','AFG'],
    palette: 'plum',
    art: 'prayer-flags',
    teaser: 'Where four mountain systems collide.',
  },

  continentSpanners: {
    id: 'continentSpanners',
    name: 'The Continent-Spanners',
    countries: ['TUR','RUS','EGY','KAZ','AZE','GEO','PAN'],
    palette: 'plum',
    art: 'span-bridge',
    teaser: 'Countries that physically straddle two continents.',
  },

  mediterraneanRing: {
    id: 'mediterraneanRing',
    name: 'The Mediterranean Ring',
    countries: ['ESP','FRA','ITA','GRC','TUR','LBN','ISR','EGY','LBY','TUN','DZA','MAR'],
    palette: 'butter',
    art: 'olive-wave',
    teaser: 'Around the inland sea.',
  },
};

// Display order on the cabinet. New sets append; reordering is explicit.
export const SET_ORDER = [
  'silkRoad',
  'cradlesOfCiv',
  'polarCrown',
  'spiceIslands',
  'fiveMicrostates',
  'mediterraneanRing',
  'maghreb',
  'stans',
  'roofOfWorld',
  'continentSpanners',
  'ringOfFire',
  'caribbeanArc',
];

// Compute progress for a given set against a list of visited country codes.
// Returns { count, total, complete, have, missing } — render code uses
// `have` to chip-display visited countries differently from missing ones.
export function setProgress(set, visited) {
  const visitedSet = new Set(visited);
  const have    = set.countries.filter(c => visitedSet.has(c));
  const missing = set.countries.filter(c => !visitedSet.has(c));
  return {
    count: have.length,
    total: set.countries.length,
    complete: have.length === set.countries.length,
    have,
    missing,
  };
}
