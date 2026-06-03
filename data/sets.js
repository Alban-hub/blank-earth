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
    // v5.7 audit: replaced GRC with PAK. The historiographical consensus
    // on "primary cradles" — places where complex urban civilization
    // arose *independently* — is six: Mesopotamia (IRQ), Egypt (EGY),
    // Indus Valley (largely modern PAK with Mohenjo-daro, Harappa; IND
    // also has sites like Lothal and Dholavira), Yellow River China
    // (CHN), Norte Chico/Caral (PER), and Mesoamerica/Olmec (MEX).
    // Greece is excluded because Aegean civilization (Minoan/Mycenaean)
    // emerged in contact with Egypt and Mesopotamia — it's a successor
    // culture, not an independent cradle. PAK is added because the two
    // largest Indus Valley cities (Mohenjo-daro, Harappa) are in modern
    // Pakistan, so completing the cradle requires both IND and PAK.
    id: 'cradlesOfCiv',
    name: 'Cradles of Civilisation',
    countries: ['EGY','IRQ','IND','PAK','CHN','MEX','PER'],
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
    // v5.7 audit: removed EGY, added MRT. The Maghreb proper (Arab Maghreb
    // Union, in use since 1989) is exactly MAR/DZA/TUN/LBY/MRT. Egypt is
    // Mashriq (the Arab East), not Maghreb (the Arab West) — including
    // EGY in "the Maghreb" is the same kind of cultural-geography error
    // as putting Italy in Iberia. Mauritania is the south-western
    // bookend of the Maghreb and was the previously-missing piece.
    id: 'maghreb',
    name: 'The Maghreb',
    countries: ['MAR','DZA','TUN','LBY','MRT'],
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
    // v5.7 audit: added GTM, SLV, NIC, CRI, PNG, TWN. The Ring is a
    // subduction-volcano ring around the Pacific basin — Central America
    // (Cocos plate subducting under Caribbean plate, producing Fuego,
    // San Salvador, Concepción, Arenal, etc.), Papua New Guinea (Bismarck
    // arc, Rabaul), and Taiwan (Eurasian/Philippine plate boundary,
    // Tatun group) all belong unambiguously. CAN was considered (the
    // Garibaldi belt is technically Ring of Fire) but its volcanic
    // identity is too marginal to include — keeping the bar at "active
    // subduction volcanism is a defining geological fact of this place".
    id: 'ringOfFire',
    name: 'The Ring of Fire',
    countries: ['JPN','PHL','IDN','TWN','PNG','NZL','CHL','PER','ECU','COL',
                'CRI','NIC','SLV','GTM','MEX','USA','RUS'],
    palette: 'terracotta',
    art: 'volcano-smoke',
    teaser: 'Forty thousand kilometres of subduction zones.',
  },

  caribbeanArc: {
    // v5.7 audit: completed the arc with the six Lesser Antilles micro-
    // states (ATG, DMA, GRD, KNA, LCA, VCT). The previous 7-country
    // version was the Greater Antilles + a partial Lesser Antilles —
    // calling that "the island chain" was misleading. Sovereign Caribbean
    // island states in COUNTRIES total 13 and the set now matches that.
    // Non-sovereign Caribbean territories (Puerto Rico, Cayman, Aruba,
    // Curaçao, etc.) are deliberately not included — they're territories,
    // not countries. The territories layer (per follow-up scope) would
    // be the right home if/when added.
    id: 'caribbeanArc',
    name: 'The Caribbean Arc',
    countries: ['CUB','JAM','HTI','DOM','BHS','KNA','ATG','DMA','LCA','VCT',
                'BRB','GRD','TTO'],
    palette: 'sky',
    art: 'island-arc',
    teaser: 'The island chain bracketing the inland sea.',
  },

  roofOfWorld: {
    // v5.7 audit: added TJK. The teaser names "four mountain systems";
    // those are conventionally Himalaya, Karakoram, Hindu Kush, and Pamir.
    // Tajikistan IS the Pamir country (more than half the country is
    // above 3000m), so omitting it from "Roof of the World" was a real
    // gap. KGZ (Tien Shan) was considered and skipped — it's a separate
    // range north of the Pamir, not one of the four named systems.
    id: 'roofOfWorld',
    name: 'The Roof of the World',
    countries: ['NPL','BTN','IND','CHN','PAK','AFG','TJK'],
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
    // v5.7 audit: extended from 12 to 21 — the previous list was "the
    // major Med coastal states" but the set's name says *ring* and the
    // teaser says *around the inland sea*, so it should mean every
    // sovereign country with a Mediterranean coastline. Now matches the
    // oliveBranch region in regions.js (the title classifier and the set
    // see the same Mediterranean). Additions: MLT, CYP (Med-island
    // nations), HRV, SVN, BIH, MNE, ALB (Adriatic), SYR (Levant), MCO
    // (Riviera microstate). PSE has a tiny Gaza coast and is skipped
    // here for product reasons (statehood is contested), but it's in
    // oliveBranch — flagged as an open question.
    id: 'mediterraneanRing',
    name: 'The Mediterranean Ring',
    countries: ['ESP','FRA','MCO','ITA','MLT','SVN','HRV','BIH','MNE','ALB',
                'GRC','CYP','TUR','SYR','LBN','ISR','EGY','LBY','TUN','DZA','MAR'],
    palette: 'butter',
    art: 'olive-wave',
    teaser: 'Around the inland sea.',
  },

  // ── Season 2 sets (added 2026-06-03) — recognisable blocs & river routes,
  // every member a sovereign country present in COUNTRIES + the globe topojson.
  nordics: {
    id: 'nordics',
    name: 'The Nordics',
    countries: ['ISL','NOR','SWE','FIN','DNK'],
    palette: 'sky',
    art: 'pine-row',
    teaser: 'The five countries of the European north.',
  },

  gccGulf: {
    id: 'gccGulf',
    name: 'The Gulf States',
    countries: ['SAU','KWT','BHR','QAT','ARE','OMN'],
    palette: 'butter',
    art: 'dunes-sun',
    teaser: 'The six monarchies of the Persian Gulf.',
  },

  asean: {
    id: 'asean',
    name: 'ASEAN',
    countries: ['BRN','KHM','IDN','LAO','MYS','MMR','PHL','SGP','THA','VNM'],
    palette: 'sage',
    art: 'palm-circle',
    teaser: 'The ten nations of Southeast Asia.',
  },

  danube: {
    id: 'danube',
    name: 'The Danube',
    countries: ['DEU','AUT','SVK','HUN','HRV','SRB','ROU','BGR','MDA','UKR'],
    palette: 'sky',
    art: 'wave-trio',
    teaser: 'Ten countries strung along one river.',
  },

  fiveEyes: {
    id: 'fiveEyes',
    name: 'The Five Eyes',
    countries: ['USA','GBR','CAN','AUS','NZL'],
    palette: 'plum',
    art: 'compass',
    teaser: 'Five nations bound by a common tongue.',
  },

  nileBasin: {
    id: 'nileBasin',
    name: 'The Nile Basin',
    countries: ['EGY','SDN','SSD','ETH','UGA','KEN','TZA','RWA','BDI','COD'],
    palette: 'terracotta',
    art: 'olive-wave',
    teaser: 'Where the world’s longest river gathers.',
  },

  // ── Pacing sets (added 2026-06-03 after the progression review) — every set
  // until now completed only in the final fifth of a journey (each gated by one
  // rare micro-member). These two are reachable *early/mid* for ordinary travel,
  // so the first "complete" moment can land in the opening chapter rather than
  // at country ~170. The Grand Tour (3 of the most-visited countries on Earth)
  // is the deliberate starter; the Seven Wonders spread the reward across
  // continents so it isn't a Europe-only early game.
  grandTour: {
    id: 'grandTour',
    name: 'The Grand Tour',
    countries: ['FRA','ITA','CHE'],
    palette: 'rose',
    art: 'compass',
    teaser: 'The road every Grand Tourist once took.',
  },

  sevenWonders: {
    id: 'sevenWonders',
    name: 'The Seven Wonders',
    countries: ['ITA','JOR','IND','CHN','PER','MEX','BRA'],
    palette: 'bone',
    art: 'world',
    teaser: 'Seven modern wonders, seven countries.',
  },
};

// Display order on the cabinet. New sets append; reordering is explicit.
export const SET_ORDER = [
  'grandTour',
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
  'nordics',
  'gccGulf',
  'asean',
  'danube',
  'fiveEyes',
  'nileBasin',
  'sevenWonders',
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
