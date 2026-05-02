// The Cartographer's Title — Layer 1 of the v2 atlas.
//
// A single, computed identity that emerges from the *shape* of the user's
// visits, not the count. Two travellers with identical country counts can
// have wildly different patterns — one chases polar latitudes, one hugs the
// Mediterranean — and the title is what tells them apart.
//
// Each title is a {id, name, test, weight}:
//   id      — stable identifier (used internally)
//   name    — the line that appears at the top of the atlas
//   test    — predicate over a state object {visited, count, lats, lngs}
//   weight  — higher wins when multiple titles match. Specific
//             concentrations beat broad spreads.
//
// The classifier picks the highest-weight matching title. If none match (or
// the user has fewer than 5 visits), we show the gentle "Your atlas is just
// beginning." copy instead — no label feels better than a wrong label.

import { COUNTRIES } from './countries.js';

// Region sets used by classifiers. Inclusive over what's plausibly part of
// each region rather than strict — the test functions take care of the
// "concentration" heuristics.
const MEDITERRANEAN = new Set([
  'ESP','FRA','ITA','GRC','TUR','LBN','ISR','EGY','LBY','TUN','DZA','MAR',
  'MLT','CYP','HRV','MNE','ALB','SVN','SYR','PSE',
]);
const POLAR_NORTH  = new Set(['ISL','NOR','SWE','FIN','RUS','CAN']); // arctic-bordering
const HIGH_LAT     = (lat) => lat >= 55 || lat <= -50;               // anywhere extreme
const TROPIC_BAND  = (lat) => Math.abs(lat) <= 15;                   // |lat| ≤ 15
const OLD_WORLD = new Set([
  // Europe (most)
  'ALB','AND','AUT','BEL','BIH','BGR','HRV','CYP','CZE','DNK','EST','FIN','FRA','DEU',
  'GRC','HUN','ISL','IRL','ITA','XKX','LVA','LIE','LTU','LUX','MLT','MDA','MCO','MNE',
  'NLD','MKD','NOR','POL','PRT','ROU','SMR','SRB','SVK','SVN','ESP','SWE','CHE','UKR',
  'GBR','VAT',
  // Western Asia / Middle East
  'TUR','SYR','LBN','ISR','PSE','JOR','IRQ','IRN','SAU','KWT','BHR','QAT','ARE','OMN',
  'YEM','ARM','AZE','GEO',
  // North Africa
  'EGY','LBY','TUN','DZA','MAR','SDN',
]);
const SPICE_RIM = new Set([
  // Indian Ocean rim — east African coast through south + south-east Asia
  'KEN','TZA','MOZ','MDG','COM','ZAF','OMN','YEM','ARE','PAK','IND','LKA','MDV',
  'BGD','MMR','THA','MYS','IDN','SGP','PHL',
]);

// Shape heuristics
function meanOf(arr) { return arr.reduce((s,x) => s + x, 0) / arr.length; }
function rangeOf(arr) { return Math.max(...arr) - Math.min(...arr); }

export const TITLES = [
  {
    id: 'mediterranean',
    name: 'The Mediterranean',
    description: 'Concentrated visits ringing the inland sea — Italy, Greece, the North African coast, the Levant.',
    test: (s) => {
      const hits = [...MEDITERRANEAN].filter(c => s.visited.includes(c)).length;
      return hits >= 4 && hits / s.count >= 0.30;
    },
    weight: 12,
  },
  {
    id: 'polar-light',
    name: 'The Polar Light',
    description: 'Drawn to the high latitudes — Iceland, the Nordics, Russia’s north, the Canadian Arctic.',
    test: (s) => {
      const arctic = [...POLAR_NORTH].filter(c => s.visited.includes(c)).length;
      const highLatHits = s.lats.filter(HIGH_LAT).length;
      return arctic >= 3 || (highLatHits >= 4 && highLatHits / s.count >= 0.35);
    },
    weight: 11,
  },
  {
    id: 'tropic-hand',
    name: 'The Tropic Hand',
    description: 'Equatorial concentration — countries within fifteen degrees of the equator, in the band where the seasons barely shift.',
    test: (s) => {
      const tropics = s.lats.filter(TROPIC_BAND).length;
      return tropics >= 4 && tropics / s.count >= 0.40;
    },
    weight: 10,
  },
  {
    id: 'old-world',
    name: 'The Old World',
    description: 'Europe, Western Asia, North Africa — the long-inhabited heartland where most cities are older than most countries.',
    test: (s) => {
      const hits = [...OLD_WORLD].filter(c => s.visited.includes(c)).length;
      return hits >= 8 && hits / s.count >= 0.55;
    },
    weight: 9,
  },
  {
    id: 'spice-trader',
    name: 'The Spice Trader',
    description: 'Indian Ocean rim — east African coast through south and southeast Asia, the route that gave Europe pepper and cloves.',
    test: (s) => {
      const hits = [...SPICE_RIM].filter(c => s.visited.includes(c)).length;
      return hits >= 5 && hits / s.count >= 0.35;
    },
    weight: 9,
  },
  {
    id: 'stargazer',
    name: 'The Stargazer',
    description: 'Wide latitude range — your atlas spans from polar regions toward the tropics, or near it.',
    test: (s) => {
      if (s.lats.length < 5) return false;
      return rangeOf(s.lats) >= 100;
    },
    weight: 7,
  },
  {
    id: 'continentalist',
    name: 'The Continentalist',
    description: 'Landlocked-leaning — drawn to the interior nations rather than the coasts. The Stans, the Alps, central Africa.',
    test: (s) => {
      if (s.count < 8) return false;
      return s.landlockedCount / s.count >= 0.50;
    },
    weight: 8,
  },
  {
    id: 'wanderer',
    name: 'The Wanderer',
    description: 'Broad spread, no concentration — the world generally rather than any single region.',
    test: (s) => s.count >= 15 && s.continents >= 4,
    weight: 3,
  },
  {
    id: 'newcomer',
    name: '',
    description: '',
    test: (s) => s.count < 5,
    weight: 0,
  },
];

// Build the state object the test functions expect, given the visited list.
import { ISLAND_NATIONS, LANDLOCKED } from './countries.js';
export function buildTitleState(visited) {
  const lats = [], lngs = [];
  let landlockedCount = 0;
  const conts = new Set();
  for (const iso of visited) {
    const c = COUNTRIES[iso];
    if (!c) continue;
    lats.push(c[4]);
    lngs.push(c[5]);
    conts.add(c[0]);
    if (LANDLOCKED.has(iso)) landlockedCount++;
  }
  return {
    visited,
    count: visited.length,
    lats,
    lngs,
    landlockedCount,
    continents: conts.size,
  };
}

// Pick the title — highest-weight matching test, with a graceful fallback.
export function computeTitle(visited) {
  const state = buildTitleState(visited);
  if (state.count < 5) {
    return { id: 'newcomer', name: '', empty: true };
  }
  const matches = TITLES
    .filter(t => t.id !== 'newcomer' && t.test(state))
    .sort((a, b) => b.weight - a.weight);
  if (matches.length === 0) {
    // Visited enough to deserve a title but no pattern matched.
    const wanderer = TITLES.find(t => t.id === 'wanderer');
    return { id: 'wanderer', name: 'The Wanderer', description: wanderer.description, empty: false };
  }
  return { ...matches[0], empty: false };
}
