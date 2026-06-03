// The 8 "lines" — single tiered cards that replace the threshold-stacked
// badges from the legacy system. Each line has 3 or 4 tiers; the visible
// card represents the user's *current* tier, gilding from bronze → silver →
// gold → indigo as they progress. Locked tiers are still rendered (in the
// tier-ladder reveal) so the user always sees the path ahead.
//
// Schema for each line:
//   id           stable identifier (used for keying state + DOM)
//   name         editorial name, displayed on the card
//   axis         which metric this line tracks. Mapped to a value by
//                stats.html's lineValue() function. One of:
//                  'count' | 'land' | 'pop' | 'islands' | 'latRange'
//                  | 'hemi' | 'climate' | 'cont'
//   art          key into the art registry (renderArt)
//   tiers        array of { threshold, name } — length 3 or 4
//   description  one-line copy shown below the tier ladder
//   unit         display unit for progress copy (e.g. 'countries', '%')

export const LINES = {
  cartographer: {
    id: 'cartographer',
    name: 'The Cartographer',
    axis: 'count',
    art: 'compass',
    unit: 'countries',
    tiers: [
      { threshold: 10,  name: 'First Atlas' },
      { threshold: 30,  name: 'The Tour' },
      { threshold: 75,  name: 'The Survey' },
      { threshold: 150, name: 'The Master' },
    ],
    description: 'Each tier rewards consistent, curious, broadly-spread travel.',
  },

  surveyor: {
    id: 'surveyor',
    name: 'The Surveyor',
    axis: 'land',
    art: 'rope',
    unit: '% of land',
    tiers: [
      { threshold: 5,  name: 'First Steps' },
      { threshold: 15, name: 'Far Reaches' },
      { threshold: 35, name: 'Quartermaster' },
      { threshold: 60, name: 'Halfway Home' },
    ],
    description: 'Coverage of the world\'s inhabited land area.',
  },

  demographer: {
    id: 'demographer',
    name: 'The Demographer',
    axis: 'pop',
    art: 'crowd-5',
    unit: 'M people',
    tiers: [
      { threshold: 500,  name: 'Half a Billion' },
      { threshold: 2000, name: 'Two Billion' },
      { threshold: 4000, name: 'Four Billion' },
      { threshold: 6000, name: 'Most of Humanity' },
    ],
    description: 'Combined population of the countries you\'ve marked.',
  },

  islander: {
    id: 'islander',
    name: 'The Islander',
    axis: 'islands',
    art: 'archipelago',
    unit: 'island nations',
    tiers: [
      { threshold: 4,  name: 'First Atoll' },
      { threshold: 12, name: 'Reef-Hopper' },
      { threshold: 22, name: 'Archipelago' },
      { threshold: 30, name: 'Oceania' },
    ],
    description: 'Pure island countries — Iceland, Japan, Madagascar, the Pacific archipelagos.',
  },

  // The 8th line — added because the existing six all measure *count* on a
  // single axis. The Voyager measures *spread*: the latitude range between
  // your most northern and most southern country. Distinct concept, evocative
  // ("Pole to Pole"), reuses the existing `sextant` icon (a celestial-
  // navigation tool — fits the name).
  // v5.7 audit: re-tiered from 30/70/110/150 to 30/60/90/100. The metric
  // is the centroid latRange (Math.max(lats) - Math.min(lats) in
  // stats.html), not territorial extent. Centroid math caps at the
  // Iceland (64.9°) → New Zealand (-40.9°) span = 105.8°, so the old top
  // two tiers (110 and 150) were mathematically unreachable. New tier 4
  // of 100° is achievable but rare: requires e.g. ISL/FIN/NOR paired
  // with NZL/ARG/CHL. New tier 3 of 90° is reachable with any northern-
  // Europe + southern-cone pair.
  voyager: {
    id: 'voyager',
    name: 'The Voyager',
    axis: 'latRange',
    art: 'sextant',
    unit: '° of latitude',
    tiers: [
      { threshold: 30,  name: 'Local Range' },
      { threshold: 60,  name: 'Continental Sweep' },
      { threshold: 90,  name: 'Hemispheric' },
      { threshold: 100, name: 'Pole to Pole' },
    ],
    description: 'The latitude span between your most northern and most southern visit.',
  },

  hemispherist: {
    id: 'hemispherist',
    name: 'The Hemispherist',
    axis: 'hemi',
    art: 'hemi-quad',
    unit: 'hemispheres',
    tiers: [
      { threshold: 2, name: 'Two Halves' },
      { threshold: 3, name: 'Three Quarters' },
      { threshold: 4, name: 'All Four' },
    ],
    description: 'How many of the four hemispheres you\'ve set foot in.',
  },

  // v5.7 audit note: a single visit to any of the 7 POLAR_TERRITORY
  // countries (NOR/RUS/CAN/ISL/FIN/SWE/USA) credits BOTH that country's
  // centroid climate AND 'Polar', because their territory genuinely
  // reaches above the Arctic Circle (Svalbard, Alaska's North Slope,
  // northern Canadian islands, Russia's Arctic coast, etc.). Result:
  // a user who visits only NOR will hit Climatologist tier 2 ("Two
  // Bands") from a single visit. This is intentional — the override
  // exists *because* those countries cover two bands, and the line is
  // about latitudinal-zone diversity, not country count. The same
  // applies to the legacy `clim-polar` badge in badges.js.
  climatologist: {
    id: 'climatologist',
    name: 'The Climatologist',
    axis: 'climate',
    art: 'leaf-quad',
    unit: 'climate bands',
    tiers: [
      { threshold: 2, name: 'Two Bands' },
      { threshold: 3, name: 'Three Bands' },
      { threshold: 4, name: 'Four Bands' },
      { threshold: 5, name: 'Five Bands' },
    ],
    description: 'Latitudinal climate bands you\'ve crossed.',
  },

  continentalist: {
    id: 'continentalist',
    name: 'The Continentalist',
    axis: 'cont',
    art: 'world',
    unit: 'continents',
    tiers: [
      { threshold: 2, name: 'Crossing' },
      { threshold: 4, name: 'Four Continents' },
      { threshold: 5, name: 'Five Continents' },
      { threshold: 6, name: 'Six Continents' },
    ],
    description: 'Continents touched.',
  },
};

// Display order for the line grid. Kept here (not derived from object key
// order) so reordering is explicit and reviewable.
export const LINE_ORDER = [
  'cartographer',
  'surveyor',
  'demographer',
  'islander',
  'voyager',
  'hemispherist',
  'climatologist',
  'continentalist',
];

// Returns the user's current tier (0 = locked, 1-4 = earned tiers).
export function tierOf(line, value) {
  for (let i = line.tiers.length - 1; i >= 0; i--) {
    if (value >= line.tiers[i].threshold) return i + 1;
  }
  return 0;
}
