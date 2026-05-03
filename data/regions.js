// Regions — curated country lists for the v5.7 title classifier.
//
// One file, one source of truth for "what countries belong to what region".
// Used exclusively by data/titles.js for regional + latitude-band scoring.
//
// Naming convention: REGIONS keys are camelCase versions of the title id
// (the kebab-case slug). E.g. REGIONS.oliveBranch powers id 'olive-branch'.
// Some title *display names* diverge from their ids after the v5.7 rename
// pass — e.g. REGIONS.mongol still powers id 'mongol', shown as
// "The Steppe-Empire". Ids are stable (so persisted state stays valid);
// names are editorial.
//
// Curatorial notes:
//   • Regions overlap intentionally — a country can be in multiple. The
//     scoring model handles this via density + nesting.
//   • Inclusivity bias: regions reach slightly wider than strict definitions,
//     since the 0.50 density floor + min-count gates do the discrimination.
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

  // The Steppe-Empire (id 'mongol') — Mongol Empire at peak (~late 13th
  // century, all four khanates). Kept the id 'mongol' for state stability;
  // display name renamed to deemphasize conquest framing and ethnic
  // identity, parallel to the Pioneer→Anglosphere rename. The region itself
  // is unchanged: Mongolia, China (Yuan), Russia + Eastern Slavs (Golden
  // Horde), Central Asia (Chagatai), Persia/Caucasus (Ilkhanate).
  mongol: [
    'MNG','CHN',
    'RUS','UKR','BLR',
    'KAZ','UZB','TKM','KGZ','TJK',
    'IRN','IRQ','AFG','AZE','ARM','GEO',
  ],

  // The Plateau-Walker (id 'crossroads') — Caucasus + Anatolian + Iranian
  // plateau. Renamed: "The Crossroads" read as a place/axis, not a
  // character; "Plateau-Walker" joins the -Walker family.
  crossroads: [
    'ARM','AZE','GEO','TUR','IRN',
  ],

  // The Iberoamerican (id 'conquistador') — Spanish + Portuguese colonial
  // reach. Iberia + Hispanic Latin America + Lusophone Brazil + Spanish
  // Philippines. Renamed: "The Conquistador" labelled the user as an heir
  // of the conqueror identity (parallel to the Pioneer rename); the
  // geography is the same, the framing is now neutral.
  //
  // v5.7 audit: added GNQ. Equatorial Guinea is the only Spanish-speaking
  // country in Africa (Spanish colony 1778–1968) — same outlier-but-real-
  // Iberian-presence pattern that justifies including PHL. Lusophone
  // Africa (AGO/MOZ/CPV/GNB/STP) is deliberately not added: those are
  // already covered by capeLight / songhai / atlanticBridge and adding
  // them would shift Iberoamerican from "the Americas + outliers" to "any
  // Iberian colony anywhere", which is a different identity.
  conquistador: [
    'ESP','PRT',
    // Hispanic North/Central America + Caribbean
    'MEX','GTM','HND','SLV','NIC','CRI','PAN',
    'CUB','DOM','VEN',
    // Hispanic South America
    'COL','ECU','PER','BOL','CHL','ARG','PRY','URY',
    // Lusophone
    'BRA',
    // Spanish Pacific + Spanish Africa
    'PHL','GNQ',
  ],

  // The Anglosphere — countries linked by English language and the long
  // tide of British migration / law / culture.
  //
  // v5.7 audit:
  //   • Removed EGY. Egypt was a British protectorate (1882–1922) and
  //     under heavy British influence until 1952, but its primary cultural
  //     and linguistic identity is Arab/African — English is not co-
  //     official and is not a primary marker of national identity. Same
  //     reasoning would exclude SDN. The line for inclusion is "English
  //     is a working language of public life", which EGY doesn't meet.
  //   • Added TZA, SLE, GMB, LBR. All four have English as official or
  //     co-official and are former British (LBR is Anglo-American by
  //     founding, with English as its sole official language). They
  //     parallel KEN/UGA/NGA/GHA in the Anglo-Africa cluster and should
  //     fire the title for users with Anglo-African concentration.
  anglosphere: [
    'GBR','IRL','USA','CAN','AUS','NZL',
    // South Asia (English co-official, common-law inheritance)
    'IND','PAK','BGD','LKA','MMR',
    // Anglo-Africa
    'ZAF','KEN','TZA','UGA','NGA','GHA','SLE','GMB','LBR',
    'ZWE','ZMB','MWI','BWA','NAM','LSO','SWZ',
    // Anglo-Caribbean
    'JAM','BHS','BRB','TTO','BLZ','ATG','DMA','GRD','KNA','LCA','VCT',
    // Anglo-SE Asia
    'SGP','MYS','BRN',
  ],

  // The Niger-Bend (id 'songhai') — West Africa. Renamed for the same
  // reason as Mongol → Steppe-Empire: a title shouldn't attach a user to
  // an empire-or-people name. The geography (Senegal to Cameroon plus the
  // inland Sahel bend) is unchanged; the description still names Mali,
  // Songhai and Ghana as the medieval trade kingdoms whose centres lay
  // along the Niger Bend.
  songhai: [
    // Atlantic coast (Gulf of Guinea + the Senegambia)
    'SEN','GMB','GIN','GNB','SLE','LBR','CIV','GHA','TGO','BEN','NGA','CMR',
    // Inland Sahel west (the Niger Bend kingdoms)
    'MLI','BFA','NER',
    // Cape Verde (offshore extension)
    'CPV',
  ],

  // The Andes-Walker (id 'cordillera') — Andean spine. Renamed: "The
  // Cordillera" read as a place to collect (same failure mode as
  // Coral-Path → Reef-Walker).
  cordillera: [
    'ARG','BOL','CHL','COL','ECU','PER','VEN',
  ],

  // The Pampas-Light — Southern Cone
  //
  // v5.7 audit: removed BOL. The title's description is "the temperate
  // south of the New World — the grasslands, the Patagonian wind, the
  // long nights at high southern latitudes". Bolivia is tropical/sub-
  // tropical altiplano; it doesn't fit the Pampas-Light identity. BOL
  // is already in cordillera (Andean) which is the right home for it.
  // Some sources include BOL in an extended Cono Sur (via Mercosur
  // associate-membership), but the geographic identity excludes it.
  pampasLight: [
    'ARG','CHL','URY','PRY',
  ],

  // The River-Drum — Amazon basin
  riverDrum: [
    'BRA','PER','COL','ECU','BOL','VEN','GUY','SUR',
  ],

  // The Reef-Walker — Caribbean basin.
  reefWalker: [
    'CUB','JAM','HTI','DOM','BHS','BRB','TTO',
    'ATG','DMA','GRD','KNA','LCA','VCT','BLZ',
  ],

  // The Sahel-Walker (id 'dust-road') — the Sahel proper. Renamed:
  // "Dust-Road" read as a route/Set name (parallel to the Silk Road,
  // which IS a Set in this app).
  dustRoad: [
    'SEN','GMB','MRT','MLI','BFA','NER','TCD','SDN','SSD','ERI',
  ],

  // The Rift-Walker — East African Rift Valley
  //
  // v5.7 audit: added MWI. The Western Rift extends through Lake Malawi
  // (the third-deepest lake in the world, formed by Rift tectonics), so
  // MWI is squarely on the Rift system. MOZ is borderline (Shire River
  // valley is technically on the southernmost Rift extension); not added
  // because MOZ is more strongly identified with capeLight / monsoon-
  // walker, and adding it would dilute the East-African-Rift identity.
  riftWalker: [
    'KEN','TZA','UGA','RWA','BDI','ETH','MWI',
  ],

  // The Horn-Light — Horn of Africa
  hornLight: [
    'ETH','ERI','SOM','DJI',
  ],

  // The Cape-Light — Southern + south-central Africa.
  capeLight: [
    'ZAF','NAM','BWA','ZWE','LSO','SWZ','MOZ','AGO','ZMB','MWI','MDG',
  ],

  // The Monsoon-Walker — Indian Ocean rim
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

  // The Pacific-Walker (id 'dragon-coast') — E + SE Asia Pacific. Renamed:
  // "Dragon-Coast" read as a route/Set name; -Walker family is consistent.
  //
  // v5.7 audit: removed MNG. Mongolia is landlocked and steppe-cultural,
  // not Pacific. The title's description is "the great Asian rim from the
  // Pacific shore" — MNG fails the Pacific-shore test. MNG is already
  // covered by caravaneer/longHorizon/mongol. LAO is kept (also land-
  // locked) because it's part of the Indochinese cluster (mekong-walker
  // nests under dragon-coast) and shares the SE-Asian cultural sphere
  // in a way Mongolia does not.
  dragonCoast: [
    'JPN','KOR','PRK','TWN','CHN',
    'VNM','LAO','KHM','THA','MMR','MYS','SGP','BRN','IDN','PHL','TLS',
  ],

  // The Trade-Winds — Pacific Rim (with spread requirement)
  //
  // v5.7 audit: added the five remaining Pacific microstates (NRU, MHL,
  // FSM, PLW, TUV) for consistency with KIR/TON/WSM/FJI/SLB/VUT which
  // were already in. The previous list was inconsistent — having KIR but
  // not TUV, etc. Pacific microstates are unambiguously in the Pacific.
  tradeWinds: [
    // Asian Pacific
    'JPN','KOR','PRK','CHN','TWN','PHL','IDN','MYS','BRN','VNM',
    // Oceania
    'AUS','NZL','PNG','FJI','TON','WSM','SLB','VUT',
    'KIR','TUV','PLW','MHL','FSM','NRU',
    // American Pacific
    'USA','CAN','MEX','GTM','SLV','NIC','CRI','PAN',
    'COL','ECU','PER','CHL',
    // Pacific edge
    'RUS',
  ],

  // The Atlantic-Bridge — both Atlantic shores (with spread requirement)
  //
  // v5.7 audit: added CPV (Cabo Verde). It's an Atlantic-only island
  // nation (~570 km off the West African coast) and was the previous
  // most-glaring omission — its identity is fully Atlantic. Caribbean
  // micro-arc states (ATG/DMA/GRD/KNA/LCA/VCT/BRB) are deliberately
  // NOT added: they're more strongly identified with reefWalker, and
  // adding them would make the spread-requirement near-trivial.
  atlanticBridge: [
    // Western European Atlantic
    'ISL','GBR','IRL','PRT','ESP','FRA',
    // West African Atlantic
    'MAR','MRT','SEN','GMB','GIN','SLE','LBR','CIV','GHA',
    'TGO','BEN','NGA','CMR','GNQ','GAB','COG','COD','AGO','NAM','ZAF',
    // Atlantic islands (West African offshore)
    'CPV',
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
  //
  // v5.7 audit: kept as-is. Suspects considered and rejected:
  //   • NPL — Nepal's southernmost point is ~26.4°N, north of the Tropic
  //     of Cancer (23.5°N). No tropical territory.
  //   • CHN — Hainan + southern Yunnan is tropical, but China's identity
  //     is so dominantly non-tropical that adding it would dilute the
  //     Equator-Hand region (the country is too big to be "reach").
  //   • IRN — southern coast is at ~25°N, just north of the Tropic; no
  //     tropical territory by climateZone definition.
  //   • AUS — northern Queensland / Northern Territory is tropical,
  //     but Australia's identity is southernCross / tradeWinds. Adding
  //     would shift the title's center of mass.
  // The current "reach" set (MEX/IND/BGD/MMR/THA + Central America +
  // southern Africa) covers countries whose territory is *meaningfully*
  // tropical, not "barely brushes the Tropic" cases.
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

  // The Aurora-Bound — polar reach (Arctic-bordering or near).
  // The Aurora-Bound test in titles.js *also* enforces a Nordic-spread
  // requirement (≥ 2 of ISL/NOR/SWE/FIN) so that a USA+CAN+RUS+EST atlas
  // doesn't fire the title without any actual Nordic visit — the name is
  // aurora-coded, not just polar-coded.
  //
  // v5.7 audit: removed EST and LVA. Estonia (centroid 59°N, north-most
  // ~59.7°) and Latvia (57°N, north-most ~58°) are Baltic-temperate, not
  // Arctic — they sit ~7° of latitude below the Arctic Circle (66.5°)
  // and have no polar territory. They were a long-standing miscoding.
  // DNK is kept: its sovereign territory includes Greenland, which
  // reaches 83°N (this is the same reasoning the Arctic Council uses
  // when including Denmark as one of its 8 member states).
  polarReach: [
    'ISL','NOR','SWE','FIN','DNK','RUS','CAN','USA',
  ],
};

// Top-10 most populous countries — powers The Megapolitan title.
export const TOP_POPULOUS = new Set([
  'CHN','IND','USA','IDN','PAK','NGA','BRA','BGD','RUS','MEX',
]);

// Spread-requirement helper for The Atlantic-Bridge.
// Must include at least one country from BOTH the Western shore (Americas)
// AND the Eastern shore (Europe + W. Africa + Atlantic islands) to qualify.
export function requireSpreadAtlantic(inRegion) {
  const W = ['CAN','USA','MEX','BRA','ARG','COL','VEN','BHS','CUB','HTI','DOM',
             'JAM','GUY','SUR','URY'];
  const E = ['GBR','PRT','ESP','MAR','SEN','GMB','GIN','SLE','LBR','CIV','GHA',
             'TGO','BEN','NGA','CMR','GNQ','GAB','COG','COD','AGO','NAM','ZAF',
             'ISL','IRL','FRA','MRT','CPV'];
  return inRegion.some(c => W.includes(c)) && inRegion.some(c => E.includes(c));
}

// Spread-requirement helper for The Trade-Winds.
// Must touch at least 2 of: Asian Pacific, American Pacific, Oceania.
// Already included all 14 Oceania entries; v5.7 audit kept the buckets
// in sync with the tradeWinds region (which now includes all 14 Pacific
// microstates) so the helper remains exhaustive.
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

// Antipodal-pair detection (kept for the future Badges layer — the
// Antipodean title was retired in v5.6 because visiting an antipodal pair
// is a one-shot fact, not a kind of traveler).
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
// resolution logic to suppress redundant pairs (the more-specific title
// beats its general parent when both fire).
//
// Note on "nesting": entries here are *specificity orderings*, not strict
// geographic subsets. Some pairs are full subsets (pampas-light ⊂
// conquistador, dust-road ⊂ caravaneer), others are partial overlaps
// where the specific name is the better identity when both fire (river-
// drum/conquistador ~75% overlap; mongol/caravaneer ~44% overlap on the
// steppe-dryland zone of Eurasia). The rule is the same in both cases:
// when both score above threshold, the specific wins.
//
// v5.7 fixes:
//   • long-horizon now nests under BOTH mongol AND caravaneer (the seven
//     long-horizon countries are 6/7 inside the caravaneer drylands, so
//     a perfect Stans atlas was previously firing both at score 100 and
//     tie-breaking alphabetically into Caravaneer — wrong).
//   • mongol now nests under caravaneer. The Mongol Empire's heartland
//     (steppe + Stans + Persia) overlaps the Caravaneer drylands on
//     ~7 countries; when an atlas fires both — e.g. 8 visits across
//     MNG/CHN/RUS/KAZ/UZB/TKM/IRN/AFG — both pegged 100 and the
//     alphabetical tie-break gave "caravaneer" wrongly. The Mongol
//     Empire is the more specific identity for that atlas shape.
//   • reef-walker no longer nests under conquistador. Of the 14 countries
//     in reefWalker, only CUB and DOM are in conquistador — the British /
//     French / Dutch Caribbean is the *majority*. The old nesting was
//     wrong as data and was suppressing Conquistador in cases where it
//     genuinely fit the user's atlas better.
//   • horn-light no longer nests under rift-walker. Horn (ETH, ERI, SOM,
//     DJI) and Rift (KEN, TZA, UGA, RWA, BDI, ETH) overlap on Ethiopia
//     only — they're adjacent regions, not nested.
export const NESTED = {
  'olive-branch':         ['romanesque'],
  'caravaneer':           [],   // crosses Romanesque/Mongol footprints — not cleanly nested upward
  'crossroads':           [],   // Caucasus/Iran straddle Mongol but pre-date it
  'long-horizon':         ['mongol', 'caravaneer'],
  'mongol':               ['caravaneer'],     // steppe heartland is dryland; Mongol is the specific name
  'cordillera':           ['conquistador'],
  'pampas-light':         ['conquistador'],
  'river-drum':           ['conquistador'],   // Brazil = Lusophone Iberia, the others are Hispanic
  'subcontinent-walker':  ['monsoon-walker','anglosphere'],
  'mekong-walker':        ['dragon-coast'],
  'songhai':              [],   // West Africa — own identity, no nested parent
  'dust-road':            ['caravaneer'],     // Sahel ⊂ Caravaneer drylands
};

export function isNested(a, b) {
  return (NESTED[a] || []).includes(b)
      || (NESTED[b] || []).includes(a);
}
