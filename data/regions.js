// Regions — curated country lists for the v5.1 title classifier.
//
// One file, one source of truth for "what countries belong to what region".
// Used exclusively by data/titles.js for regional + latitude-band scoring.
//
// Naming convention: regions are camelCase ids that match the title id
// (without "the-" prefix). E.g. REGIONS.oliveBranch powers The Olive-Branch.
//
// Curatorial notes:
//   • Regions overlap intentionally — a country can be in multiple. The
//     scoring model handles this via density + nesting.
//   • Inclusivity bias: regions reach slightly wider than strict definitions,
//     since the 0.45 density floor + min-count gates do the discrimination.
//   • Latitude-band patterns (equatorialReach, polarReach) are *reach* lists
//     — a country is included if its territory meaningfully touches the band,
//     even if the centroid is outside it (Mexico, India, Bangladesh for the
//     tropics; USA via Alaska for the polar reach).

export const REGIONS = {
  // === Family A — regional archetypes ===

  // The Olive-Branch — Mediterranean basin
  oliveBranch: [
    'ESP','FRA','ITA','MLT','GRC','CYP','TUR','SYR','LBN','ISR','PSE',
    'EGY','LBY','TUN','DZA','MAR','MCO','SVN','HRV','BIH','MNE','ALB',
  ],

  // The Caravaneer — drylands (Maghreb + Sahel + Arabian + Central Asia interior)
  caravaneer: [
    'MAR','DZA','TUN','LBY','EGY',
    'MRT','MLI','NER','TCD','SDN','SSD',
    'SAU','OMN','YEM','ARE','JOR','IRQ','IRN','KWT','BHR','QAT',
    'AFG','TKM','UZB','KAZ','TJK','MNG',
  ],

  // The Long-Horizon — Steppe / open interior
  longHorizon: [
    'KAZ','UZB','TKM','TJK','KGZ','MNG','AFG',
  ],

  // The Old-Empire — EU + Western Asia + N. Africa heartland
  oldEmpire: [
    // Europe
    'ALB','AND','AUT','BEL','BIH','BGR','HRV','CYP','CZE','DNK','EST','FIN',
    'FRA','DEU','GRC','HUN','ISL','IRL','ITA','XKX','LVA','LIE','LTU','LUX',
    'MLT','MDA','MCO','MNE','NLD','MKD','NOR','POL','PRT','ROU','SMR','SRB',
    'SVK','SVN','ESP','SWE','CHE','UKR','GBR','VAT','BLR','RUS',
    // W. Asia / Middle East
    'TUR','GEO','ARM','AZE','SYR','LBN','ISR','PSE','JOR','IRQ','IRN',
    'KWT','SAU','BHR','QAT','ARE','OMN','YEM',
    // N. Africa
    'EGY','LBY','TUN','DZA','MAR',
  ],

  // The Crossroads — Caucasus + Anatolian + Iranian plateau
  crossroads: [
    'ARM','AZE','GEO','TUR','IRN',
  ],

  // The Frontier — the Americas
  frontier: [
    // North America + Caribbean + Central America
    'CAN','USA','MEX','GTM','BLZ','HND','SLV','NIC','CRI','PAN',
    'CUB','JAM','HTI','DOM','BHS','BRB','TTO','LCA','VCT','GRD','ATG','KNA','DMA',
    // South America
    'COL','VEN','GUY','SUR','ECU','PER','BOL','BRA','CHL','ARG','URY','PRY',
  ],

  // The Cordillera — Andean spine
  cordillera: [
    'ARG','BOL','CHL','COL','ECU','PER','VEN',
  ],

  // The Pampas-Light — Southern Cone
  pampasLight: [
    'ARG','CHL','URY','PRY','BOL',
  ],

  // The River-Drum — Amazon basin
  riverDrum: [
    'BRA','PER','COL','ECU','BOL','VEN','GUY','SUR',
  ],

  // The Coral-Path — Caribbean basin
  coralPath: [
    'CUB','JAM','HTI','DOM','BHS','BRB','TTO',
    'ATG','DMA','GRD','KNA','LCA','VCT','BLZ',
  ],

  // The Dust-Road — the Sahel proper
  dustRoad: [
    'SEN','GMB','MRT','MLI','BFA','NER','TCD','SDN','SSD','ERI',
  ],

  // The Coffee-Belt — East African highlands
  coffeeBelt: [
    'KEN','TZA','UGA','RWA','BDI','ETH',
  ],

  // The Horn-Light — Horn of Africa
  hornLight: [
    'ETH','ERI','SOM','DJI',
  ],

  // The Cape-Light — Southern Africa
  capeLight: [
    'ZAF','NAM','BWA','ZWE','LSO','SWZ','MOZ',
  ],

  // The Saffron-Road — Indian Ocean rim
  saffronRoad: [
    'IND','PAK','LKA','BGD','MMR','THA','MYS','SGP','IDN',
    'MDV','KEN','TZA','MOZ','MDG','MUS','SYC','COM','YEM','OMN',
  ],

  // The Subcontinent-Walker — South Asia
  subcontinentWalker: [
    'IND','PAK','BGD','NPL','BTN','LKA','MDV',
  ],

  // The Mekong-Walker — Indochina
  mekongWalker: [
    'VNM','LAO','KHM','THA','MMR',
  ],

  // The Dragon-Coast — E + SE Asia Pacific
  dragonCoast: [
    'JPN','KOR','PRK','TWN','CHN','MNG',
    'VNM','LAO','KHM','THA','MMR','MYS','SGP','BRN','IDN','PHL','TLS',
  ],

  // The Trade-Winds — Pacific Rim (with spread requirement)
  tradeWinds: [
    // Asian Pacific
    'JPN','KOR','PRK','CHN','TWN','PHL','IDN','MYS','BRN','VNM',
    // Oceania
    'AUS','NZL','PNG','FJI','TON','WSM','SLB','VUT','KIR',
    // American Pacific
    'USA','CAN','MEX','GTM','SLV','NIC','CRI','PAN',
    'COL','ECU','PER','CHL',
    // Pacific edge
    'RUS',
  ],

  // The Atlantic-Bridge — both Atlantic shores (with spread requirement)
  atlanticBridge: [
    // Western European Atlantic
    'ISL','GBR','IRL','PRT','ESP','FRA',
    // West African Atlantic
    'MAR','MRT','SEN','GMB','GIN','SLE','LBR','CIV','GHA',
    'TGO','BEN','NGA','CMR','GNQ','GAB','COG','COD','AGO','NAM','ZAF',
    // Eastern American Atlantic
    'CAN','USA','CUB','BHS','JAM','HTI','DOM',
    'COL','VEN','GUY','SUR','BRA','URY','ARG',
  ],

  // The Southern-Cross — Oceania
  southernCross: [
    'AUS','NZL','PNG','FJI','TON','WSM','SLB','VUT',
    'KIR','TUV','PLW','MHL','FSM','NRU',
  ],

  // === Family B — latitude-band patterns ===

  // The Equator-Hand — equatorial reach (within ±15° OR territory touches it)
  equatorialReach: [
    // Centroid within ±15°
    'COL','VEN','ECU','GUY','SUR','BRA','PER',
    'IDN','MYS','SGP','BRN','PHL','TLS','PNG',
    'KEN','UGA','TZA','RWA','BDI','COD','COG','GAB','GNQ','STP','CMR','CAF',
    'NGA','GHA','TGO','BEN','CIV','LBR','SLE','GIN','GNB','SEN','GMB',
    'BFA','NER','TCD','SSD','ETH','SOM','DJI','ERI','VNM',
    'MDV','LKA',
    'KIR','NRU','TUV','MHL','FSM','PLW','WSM','SLB','VUT',
    // Reach: centroid outside ±15° but territory meaningfully tropical
    'MEX','IND','BGD','MMR','THA','HND','NIC','GTM','SLV','CRI','PAN',
    'AGO','ZMB','MOZ','MWI','MDG',
  ],

  // The Aurora-Bound — polar reach (Arctic-bordering or near)
  polarReach: [
    'ISL','NOR','SWE','FIN','DNK','EST','LVA','RUS','CAN','USA',
  ],
};

// Top-10 most populous countries — powers The Megapolitan title.
export const TOP_POPULOUS = new Set([
  'CHN','IND','USA','IDN','PAK','NGA','BRA','BGD','RUS','MEX',
]);

// Spread-requirement helper for The Atlantic-Bridge.
// Must include at least one country from BOTH the Western shore (Americas)
// AND the Eastern shore (Europe + W. Africa) to qualify.
export function requireSpreadAtlantic(inRegion) {
  const W = ['CAN','USA','MEX','BRA','ARG','COL','VEN','BHS','CUB','HTI','DOM',
             'JAM','GUY','SUR','URY'];
  const E = ['GBR','PRT','ESP','MAR','SEN','GMB','GIN','SLE','LBR','CIV','GHA',
             'TGO','BEN','NGA','CMR','GNQ','GAB','COG','COD','AGO','NAM','ZAF',
             'ISL','IRL','FRA','MRT'];
  return inRegion.some(c => W.includes(c)) && inRegion.some(c => E.includes(c));
}

// Spread-requirement helper for The Trade-Winds.
// Must touch at least 2 of: Asian Pacific, American Pacific, Oceania.
export function requireSpreadPacific(inRegion) {
  const asianPac = ['JPN','KOR','PRK','TWN','PHL','VNM','IDN','MYS','BRN','CHN'];
  const amPac    = ['USA','CAN','MEX','GTM','SLV','NIC','CRI','PAN','COL','ECU','PER','CHL'];
  const oceania  = ['AUS','NZL','PNG','FJI','SLB','VUT','TON','WSM','KIR','TUV',
                    'PLW','MHL','FSM','NRU'];
  const buckets = [
    inRegion.some(c => asianPac.includes(c)),
    inRegion.some(c => amPac.includes(c)),
    inRegion.some(c => oceania.includes(c)),
  ];
  return buckets.filter(Boolean).length >= 2;
}

// Antipodal-pair detection (powers The Antipodean).
// Two countries are antipodal if their centroids' lats sum to ~0 (within 13°)
// AND their lngs differ by ~180° (within 13°). About 1500 km tolerance.
export function isAntipodal(a, b) {
  const latSum  = Math.abs(a.lat + b.lat);
  const lngDiff = Math.abs(Math.abs(a.lng - b.lng) - 180);
  return latSum < 13 && lngDiff < 13;
}

export function hasAntipodalPair(visited, COUNTRIES) {
  for (let i = 0; i < visited.length; i++) {
    for (let j = i + 1; j < visited.length; j++) {
      const a = COUNTRIES[visited[i]];
      const b = COUNTRIES[visited[j]];
      if (!a || !b) continue;
      if (isAntipodal({ lat: a[4], lng: a[5] }, { lat: b[4], lng: b[5] })) {
        return true;
      }
    }
  }
  return false;
}

// Title-nesting map: { specificId: [generalIds] }. Used by computeTitle's
// secondary-tag logic to suppress redundant pairs like
// "The Olive-Branch • The Old-Empire" (where Olive-Branch ⊂ Old-Empire).
export const NESTED = {
  'olive-branch':         ['old-empire'],
  'caravaneer':           ['old-empire'],
  'crossroads':           ['old-empire'],
  'cordillera':           ['frontier'],
  'pampas-light':         ['frontier'],
  'river-drum':           ['frontier'],
  'coral-path':           ['frontier'],
  'subcontinent-walker':  ['saffron-road'],
  'mekong-walker':        ['dragon-coast'],
  'horn-light':           ['coffee-belt'],
};

export function isNested(a, b) {
  return (NESTED[a] || []).includes(b)
      || (NESTED[b] || []).includes(a);
}
