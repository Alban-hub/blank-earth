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

  // The Romanesque — Roman Empire at greatest extent (Trajan, ~117 CE).
  // Tightened: removed CZE/SVK (Bohemia & Slovakia were never Roman), kept
  // ROU (Dacia, briefly Roman) and HUN (Pannonia). The audit's complaint:
  // a user with central/eastern European focus shouldn't pick up Romanesque
  // hits from countries that lie north of the Limes Germanicus.
  romanesque: [
    // Western Empire
    'ITA','ESP','PRT','FRA','GBR','MLT',
    // Central Europe (south of Rhine/Danube limes — modern borders are imperfect)
    'BEL','NLD','DEU','CHE','AUT','HUN','HRV','SVN','BIH','SRB','MNE','MKD',
    'ALB','ROU','BGR',
    // Eastern Mediterranean + Anatolia
    'GRC','CYP','TUR',
    // Levant
    'SYR','LBN','ISR','PSE','JOR',
    // North Africa
    'EGY','LBY','TUN','DZA','MAR',
  ],

  // The Hanseatic — Hanseatic League + broader Northern European maritime
  // world. The cold-water trading rim, plus its inland counterparts.
  hanseatic: [
    'DEU','NLD','BEL','DNK','NOR','SWE','FIN','EST','LVA','LTU','POL',
    'ISL','IRL','GBR',
  ],

  // The Mongol — Mongol Empire at peak (~late 13th century, all four khanates).
  // Mongolia, China (Yuan), Russia + Eastern Slavs (Golden Horde), Central
  // Asia (Chagatai), Persia/Caucasus (Ilkhanate).
  mongol: [
    'MNG','CHN',
    'RUS','UKR','BLR',
    'KAZ','UZB','TKM','KGZ','TJK',
    'IRN','IRQ','AFG','AZE','ARM','GEO',
  ],

  // The Crossroads — Caucasus + Anatolian + Iranian plateau
  crossroads: [
    'ARM','AZE','GEO','TUR','IRN',
  ],

  // The Conquistador — Spanish + Portuguese colonial reach. Iberia +
  // Hispanic Latin America + Lusophone Brazil + Spanish Philippines.
  // Replaces the v1 "Frontier" catch-all (which was just "the Americas").
  conquistador: [
    'ESP','PRT',
    // Hispanic North/Central America + Caribbean
    'MEX','GTM','HND','SLV','NIC','CRI','PAN',
    'CUB','DOM','VEN',
    // Hispanic South America
    'COL','ECU','PER','BOL','CHL','ARG','PRY','URY',
    // Lusophone
    'BRA',
    // Spanish Pacific
    'PHL',
  ],

  // The Anglosphere — countries linked by English language and the long
  // tide of British migration / law / culture. Renamed from "Pioneer" to
  // avoid valorizing colonial expansion; this is geographic/linguistic.
  anglosphere: [
    'GBR','IRL','USA','CAN','AUS','NZL',
    // South Asia (English co-official, common-law inheritance)
    'IND','PAK','BGD','LKA','MMR',
    // Anglo-Africa
    'ZAF','KEN','UGA','NGA','GHA','EGY','ZWE','ZMB','MWI','BWA','NAM','LSO','SWZ',
    // Anglo-Caribbean
    'JAM','BHS','BRB','TTO','BLZ','ATG','DMA','GRD','KNA','LCA','VCT',
    // Anglo-SE Asia
    'SGP','MYS','BRN',
  ],

  // The Songhai — West Africa. Named for the medieval Songhai Empire
  // (1430–1591), one of the largest African empires, alongside Mali and
  // Ghana — the trans-Saharan trade kingdoms whose centers lay along the
  // Niger River bend. Covers Senegal to Cameroon plus the inland Sahel
  // bend. Parallel to Mongol/Hanseatic/Romanesque in naming (a historical
  // civilizational identity, not a colonizer's identity).
  songhai: [
    // Atlantic coast (Gulf of Guinea + the Senegambia)
    'SEN','GMB','GIN','GNB','SLE','LBR','CIV','GHA','TGO','BEN','NGA','CMR',
    // Inland Sahel west (the Niger Bend kingdoms)
    'MLI','BFA','NER',
    // Cape Verde (offshore extension)
    'CPV',
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

  // The Reef-Walker — Caribbean basin (renamed from coralPath; "coral-path"
  // sounded like a route/Set, "reef-walker" describes the traveler).
  reefWalker: [
    'CUB','JAM','HTI','DOM','BHS','BRB','TTO',
    'ATG','DMA','GRD','KNA','LCA','VCT','BLZ',
  ],

  // The Dust-Road — the Sahel proper
  dustRoad: [
    'SEN','GMB','MRT','MLI','BFA','NER','TCD','SDN','SSD','ERI',
  ],

  // The Rift-Walker — East African Rift Valley (renamed from coffeeBelt;
  // "coffee-belt" sounded like a set of countries to collect, "rift-walker"
  // describes the traveler of the Great Rift Valley geography).
  riftWalker: [
    'KEN','TZA','UGA','RWA','BDI','ETH',
  ],

  // The Horn-Light — Horn of Africa
  hornLight: [
    'ETH','ERI','SOM','DJI',
  ],

  // The Cape-Light — Southern + south-central Africa.
  // Expanded to include Angola and Zambia (geographically south-central but
  // culturally aligned with the Cape rather than the Sahel/Coffee-Belt zones)
  // and Madagascar/Mauritius which sit in the same southern-Indian-Ocean
  // weather system.
  capeLight: [
    'ZAF','NAM','BWA','ZWE','LSO','SWZ','MOZ','AGO','ZMB','MWI','MDG',
  ],

  // The Monsoon-Walker — Indian Ocean rim (renamed from saffronRoad;
  // "saffron-road" sounded like a route to traverse, "monsoon-walker"
  // describes the traveler who follows the trade winds).
  monsoonWalker: [
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
// resolution logic to suppress redundant pairs (the more-specific title beats
// its general parent when both fire).
//
// Empire-renames: old-empire → romanesque, frontier → conquistador. Plus
// long-horizon ⊂ mongol (Stans were inside the Mongol Empire's Chagatai
// khanate). New Hanseatic and Pioneer don't have nested specifics.
export const NESTED = {
  'olive-branch':         ['romanesque'],
  'caravaneer':           [],   // crosses Romanesque/Mongol footprints — not cleanly nested
  'crossroads':           [],   // Caucasus/Iran straddle Mongol but pre-date it
  'long-horizon':         ['mongol'],
  'cordillera':           ['conquistador'],
  'pampas-light':         ['conquistador'],
  'river-drum':           ['conquistador'],   // Brazil = Lusophone Iberia
  'reef-walker':          ['conquistador'],   // Cuba/DR Spanish; British Caribbean is the minority
  'subcontinent-walker':  ['monsoon-walker','anglosphere'],
  'mekong-walker':        ['dragon-coast'],
  'horn-light':           ['rift-walker'],
  'songhai':              [],   // West Africa — own identity, no nested parent
  'dust-road':            ['caravaneer'],  // Sahel ⊂ Caravaneer drylands
};

export function isNested(a, b) {
  return (NESTED[a] || []).includes(b)
      || (NESTED[b] || []).includes(a);
}
