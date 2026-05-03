// titles.js — v5.7
//
// The Atlas Title classifier. 36 titles in 3 families (regional / pattern /
// tier), plus 4 honest-fallback names, graded scoring.
// See docs/titles-redesign-v5.md for the design doc.
//
// Three-layer principle (the rule that picks names):
//   • Sets   are *places*    — "The Maghreb",       answers "completed?"
//   • Lines  are *axes*      — "The Demographer",   answers "how far?"
//   • Titles are *characters*— "The Caravaneer",    answers "what kind of traveller?"
//
// Each title returns a 0–100 score from its `test(ctx)`. computeTitle picks
// the highest scorer above 30; below that, an honest fallback applies. The
// 0.50 density floor + per-region weights guarantee that popular regions
// (Mediterranean, Old World) cannot mislabel users with light incidental
// visits — the audit's core failure mode is closed.
//
// v5.7 changes from v5.6 (audit pass):
//   • Display-name renames (ids stable for state compatibility):
//       The Mongol         → The Steppe-Empire    (id 'mongol')
//       The Crossroads     → The Plateau-Walker   (id 'crossroads')
//       The Conquistador   → The Iberoamerican    (id 'conquistador')
//       The Songhai        → The Niger-Bend       (id 'songhai')
//       The Cordillera     → The Andes-Walker     (id 'cordillera')
//       The Dust-Road      → The Sahel-Walker     (id 'dust-road')
//       The Dragon-Coast   → The Pacific-Walker   (id 'dragon-coast')
//       The Long-March     → The Long-Stride      (id 'long-march')
//   • Description scrubs: removed travel-mode language ("ferries",
//     "riverboats") and a "triangular trade" euphemism (atlantic-bridge).
//     Mongol/Steppe-Empire description rewritten to deemphasize conquest
//     speed; Conquistador/Iberoamerican description rewritten to remove
//     the colonizer-perspective opener.
//   • Sphere-Walker test: hemispheric quota alone duplicated Hemispherist
//     tier 4 (same problem that retired Five-Skies). Now also requires
//     real spread — lat span ≥ 100° AND lng reach ≥ 180°.
//   • Aurora-Bound: added Nordic spread requirement (≥ 2 of ISL/NOR/SWE/
//     FIN) so a USA+CAN+RUS-only polar atlas doesn't fire an aurora-coded
//     title without any actual Nordic visit.
//   • Min-count calibration: caravaneer 5→6, anglosphere 7→8, monsoon-
//     walker 5→6 (target band 25–35% of region size).
//   • Suppression rule loosened from `>` to `>=`. The strict-greater rule
//     correctly handled Mongol-vs-Long-Horizon (94<100 → no suppression)
//     but mishandled ties at the 100 cap: a perfect Long-Horizon atlas
//     scored 100 on both Long-Horizon and Caravaneer (its newly-added
//     general parent) and lost to Caravaneer alphabetically. With `>=`,
//     specific wins ties at cap, which is what the nesting intends.
//   • buildTitleState now dedupes the visited list defensively. Pure
//     function, but a caller passing duplicates would have inflated
//     ctx.count and broken density math.
//   • NESTED fixes (in regions.js): long-horizon now also nests under
//     caravaneer; reef-walker no longer nests under conquistador (Caribbean
//     is mostly British/French/Dutch, not Iberian); horn-light no longer
//     nests under rift-walker (adjacent, not nested).

import { COUNTRIES, LANDLOCKED, ISLAND_NATIONS } from './countries.js';
import {
  REGIONS,
  TOP_POPULOUS,
  requireSpreadAtlantic,
  requireSpreadPacific,
  hasAntipodalPair,
  isNested,
  NESTED,
} from './regions.js';

// === Helpers ===

// Latitude → climate band. Matches stats.html's climateZone for consistency.
function climateZone(lat) {
  const a = Math.abs(lat);
  if (a < 23.5) return 'Tropical';
  if (a < 35)   return 'Subtropical';
  if (a < 55)   return 'Temperate';
  if (a < 66.5) return 'Subarctic';
  return 'Polar';
}

// Countries whose territory reaches above the Arctic Circle even though
// their centroid is below 66.5° (so climateZone alone misses them).
// Visiting any of these registers as the Polar climate band.
const POLAR_TERRITORY = new Set(['NOR','RUS','CAN','ISL','FIN','SWE','USA']);

// Nordic core for the Aurora-Bound spread check. Iceland counts even
// though it's geographically Atlantic — culturally aurora-coded.
const NORDIC_CORE = ['ISL','NOR','SWE','FIN'];

// === Scoring ===

// Regional / latitude-band score. Density-floored, weight-bumped, capped 100.
// This is the scoring function for almost every Family A and Family B title.
//
//   density  = inRegion / total visits   (how concentrated)
//   coverage = inRegion / regionList     (how much of the region is visited)
//
// Density is the dominant signal. The weight bump (1.20 for rare regions
// like Long-Horizon, 0.85 for broad ones like Iberoamerican) is what
// enforces the "specificity beats popularity" principle.
function regionalScore(ctx, regionList, opts = {}) {
  const { minCount = 4, weight = 1.0, requireSpread } = opts;
  const visitedSet = ctx.visitedSet;

  const inRegion = regionList.filter(c => visitedSet.has(c));
  const inRegionCount = inRegion.length;
  if (inRegionCount < minCount) return 0;

  const density  = inRegionCount / ctx.count;
  const coverage = inRegionCount / regionList.length;

  // The 0.50 density floor. At 0.45–0.50 a region is incidental, not
  // identity-defining: a user with 5 of 11 visits in one place is more
  // "broadly travelling, including some X" than "X-leaning". Especially
  // important for broad sub-regions like the Andes-Walker that would
  // otherwise fire on any user with a moderate Latin-America itinerary.
  if (density < 0.50) return 0;

  // Density curve: 0.50→55, 0.60→75, 0.80→92, 1.00→100.
  let score;
  if (density < 0.60)      score = 55 + (density - 0.50) * 200;
  else if (density < 0.80) score = 75 + (density - 0.60) * 85;
  else                     score = 92 + (density - 0.80) * 40;

  // Coverage bonus, capped to keep density dominant.
  score += Math.min(5, coverage * 12);

  // Spread requirements (Atlantic-Bridge needs both shores, Trade-Winds
  // needs ≥ 2 of 3 Pacific clusters).
  if (requireSpread && !requireSpread(inRegion)) return 0;

  // Apply weight then cap. Order matters: weight × value lets rare-region
  // multipliers push a near-pegged score to 100.
  return Math.min(100, Math.round(score * weight));
}

// Tier score builder. Used by Long-Stride / Globetrotter / Completist /
// Universalist. Cosmographer is handled by short-circuit in computeTitle.
function tierScore(count, formula, weight, capRaw = 100) {
  const raw = Math.min(capRaw, formula(count));
  return Math.min(100, Math.round(raw * weight));
}

// === The 35 ranked titles + Cosmographer (short-circuited) ===
//
// Field shape:
//   id          stable identifier (kebab-case) — DO NOT rename casually,
//               persisted state may reference these
//   name        display name (proper noun, character-named)
//   family      'regional' | 'pattern' | 'tier'  (used for tie-break)
//   description 50-word blurb shown in the masthead and tap-reveal
//   test(ctx)   returns a score 0–100; 0 means "doesn't apply"

export const TITLES = [
  // ============= Family A — Regional archetypes (25) =============
  //
  // Voice rule for descriptions: each blurb names a *kind of traveler*, not
  // a place or an achievement. No "you've reached", no "you've completed".
  // Avoid travel-mode language ("ferries", "riverboats", "the long flights",
  // "the queue at the gate") — describe the geography, not the itinerary.

  {
    id: 'olive-branch', name: 'The Olive-Branch', family: 'regional',
    description: 'You travel where the inland sea is the central character. Yours is an atlas of olives, harbours, port towns, midday shade — the long warm coast that has hosted three thousand years of arrival and departure.',
    test: (ctx) => regionalScore(ctx, REGIONS.oliveBranch, { minCount: 6, weight: 0.95 }),
  },
  {
    id: 'caravaneer', name: 'The Caravaneer', family: 'regional',
    description: 'You belong to the dry latitudes — Maghreb to the Stans, the Sahel to the Arabian wells. Your atlas is the geography of the long road, the well-watched well, salt and dust and stars overhead.',
    // minCount 5→6 in v5.7. The drylands list is 26 countries; 5/26 was
    // 19%, below the 25–35% target band. 6/26 = 23%, closer.
    test: (ctx) => regionalScore(ctx, REGIONS.caravaneer, { minCount: 6, weight: 1.20 }),
  },
  {
    id: 'long-horizon', name: 'The Long-Horizon', family: 'regional',
    description: 'You travel where the sky is the largest part of the picture. Mongolia and the Stans — the open interior, the steppe, the country that doesn’t end in any direction the eye can see.',
    test: (ctx) => regionalScore(ctx, REGIONS.longHorizon, { minCount: 3, weight: 1.15 }),
  },
  {
    id: 'romanesque', name: 'The Romanesque', family: 'regional',
    description: 'You walk where Rome walked. Britain to the Levant, the Maghreb to the Greek east — your atlas mirrors the reach of the long-roaded empire, the columned cities, the limes drawn against the wilder world beyond.',
    test: (ctx) => regionalScore(ctx, REGIONS.romanesque, { minCount: 10, weight: 0.80 }),
  },
  {
    id: 'hanseatic', name: 'The Hanseatic', family: 'regional',
    description: 'You travel the cold-water world — North Sea, Baltic, the gabled trading towns. Your atlas is herring and amber and brick, the long winter port, the patient northern light.',
    test: (ctx) => regionalScore(ctx, REGIONS.hanseatic, { minCount: 5, weight: 1.05 }),
  },
  {
    // id 'mongol' kept for state stability; display renamed in v5.7.
    // Original "The Mongol" attached the user to an ethnic identity in a
    // way "Romanesque" (a stylistic adjective) does not. Description
    // rewritten to centre the steppe geography and the courier network
    // rather than valorising the speed of conquest.
    id: 'mongol', name: 'The Steppe-Empire', family: 'regional',
    description: 'Your atlas spans the steppe and its long reach — Mongolia and the Stans, the Russian forest to the Persian uplands. A geography of grass, post roads, and the long horizon, where the inland country is joined by horse and weather.',
    test: (ctx) => regionalScore(ctx, REGIONS.mongol, { minCount: 5, weight: 1.10 }),
  },
  {
    // id 'crossroads' kept for state stability; display renamed in v5.7
    // because "The Crossroads" read as a place/axis, not a character.
    id: 'crossroads', name: 'The Plateau-Walker', family: 'regional',
    description: 'You travel the country between countries — the Caucasus, the Anatolian plateau, the Iranian uplands. Where the Silk Road folded, where languages stack three deep, where east and west keep turning into each other.',
    test: (ctx) => regionalScore(ctx, REGIONS.crossroads, { minCount: 3, weight: 1.20 }),
  },
  {
    // id 'conquistador' kept for state stability; display renamed in v5.7
    // for the same reason Pioneer was renamed to Anglosphere — the title
    // shouldn't tag the user with a conqueror identity. The geography
    // (Hispanic + Lusophone reach) is unchanged.
    id: 'conquistador', name: 'The Iberoamerican', family: 'regional',
    description: 'Your atlas spans the Hispanic-Lusophone world — Iberia to the Andes, the Caribbean to the Philippines. A geography linked by language, faith, and the long colonial echo: cathedrals on hilltops, mestizo cities, the Atlantic crossed both ways.',
    test: (ctx) => regionalScore(ctx, REGIONS.conquistador, { minCount: 8, weight: 0.85 }),
  },
  {
    id: 'anglosphere', name: 'The Anglosphere', family: 'regional',
    description: 'Your atlas spans the English-speaking world — Britain, the antipodes, North America, the subcontinent, Anglo-Africa. A geography linked by language, common law, and the long tide of migration.',
    // minCount 7→8 in v5.7. The anglosphere list is ~30 countries; 7/30
    // was 23%, just below the target band. 8/30 = 27%.
    test: (ctx) => regionalScore(ctx, REGIONS.anglosphere, { minCount: 8, weight: 0.90 }),
  },
  {
    // id 'songhai' kept for state stability; display renamed in v5.7
    // (parallel to Mongol → Steppe-Empire — empire-as-user-identity is
    // the failure mode being avoided).
    id: 'songhai', name: 'The Niger-Bend', family: 'regional',
    description: 'Your atlas spans the long bend of West Africa — Senegal to Cameroon, the Gulf of Guinea coast meeting the inland Sahel. The geography of the trans-Saharan trade kingdoms — Mali, Songhai, Ghana — that built medieval empires before Europe knew their names.',
    test: (ctx) => regionalScore(ctx, REGIONS.songhai, { minCount: 4, weight: 1.15 }),
  },
  {
    // id 'cordillera' kept for state stability; display renamed in v5.7
    // because "The Cordillera" read as a place to collect, the same
    // failure mode that retired "Coral-Path".
    id: 'cordillera', name: 'The Andes-Walker', family: 'regional',
    description: 'You travel the Andean spine — altitude, altiplano, the long mountain backbone of South America from the Caribbean to Patagonia. A geography read at four thousand metres.',
    test: (ctx) => regionalScore(ctx, REGIONS.cordillera, { minCount: 4, weight: 1.10 }),
  },
  {
    id: 'pampas-light', name: 'The Pampas-Light', family: 'regional',
    description: 'You belong to the temperate south of the New World — the grasslands, the Patagonian wind, the long nights at high southern latitudes. An atlas where summer comes in January.',
    test: (ctx) => regionalScore(ctx, REGIONS.pampasLight, { minCount: 3, weight: 1.15 }),
  },
  {
    id: 'river-drum', name: 'The River-Drum', family: 'regional',
    // v5.7: "riverboats" removed — assesses how the user travels rather
    // than the geography itself.
    description: 'You travel where the great basin drains a continent. The Amazon — Brazil, Peru, Colombia, the green that goes on past where roads stop. An atlas of cathedral canopy and slow brown water.',
    test: (ctx) => regionalScore(ctx, REGIONS.riverDrum, { minCount: 4, weight: 1.10 }),
  },
  {
    id: 'reef-walker', name: 'The Reef-Walker', family: 'regional',
    description: 'You travel the Antilles arc — Cuba to Trinidad, the chain the trade winds threaded. A geography of coral, palm, sugar, salt, and the long shadow of empire turned into Carnival and conch.',
    test: (ctx) => regionalScore(ctx, REGIONS.reefWalker, { minCount: 4, weight: 1.05 }),
  },
  {
    // id 'dust-road' kept for state stability; display renamed in v5.7
    // because "Dust-Road" read as a route/Set name (parallel to Silk Road,
    // which IS a Set).
    id: 'dust-road', name: 'The Sahel-Walker', family: 'regional',
    description: 'You travel the dry belt south of the Sahara, where the desert exhales into savanna. Caravan country, baobab country — an atlas of millet and dust and the long horizon.',
    test: (ctx) => regionalScore(ctx, REGIONS.dustRoad, { minCount: 3, weight: 1.20 }),
  },
  {
    id: 'rift-walker', name: 'The Rift-Walker', family: 'regional',
    description: 'You travel the East African Rift — Kenya, Tanzania, Uganda, Rwanda, Ethiopia. A geography of high plateau and ancient lake, where the continent is splitting open and the equator runs through the green at altitude.',
    test: (ctx) => regionalScore(ctx, REGIONS.riftWalker, { minCount: 3, weight: 1.15 }),
  },
  {
    id: 'horn-light', name: 'The Horn-Light', family: 'regional',
    description: 'You travel the Horn of Africa — Ethiopia, Eritrea, Somalia, Djibouti. An atlas of high plateau and ancient liturgy, the geography that watches the Red Sea narrow into a needle’s eye.',
    test: (ctx) => regionalScore(ctx, REGIONS.hornLight, { minCount: 2, weight: 1.20 }),
  },
  {
    id: 'cape-light', name: 'The Cape-Light', family: 'regional',
    description: 'You travel where the continent narrows toward the cold ocean — the Cape, the Kalahari, the highveld. An atlas of the long way south, where two oceans meet and the light goes thin.',
    test: (ctx) => regionalScore(ctx, REGIONS.capeLight, { minCount: 3, weight: 1.15 }),
  },
  {
    id: 'monsoon-walker', name: 'The Monsoon-Walker', family: 'regional',
    description: 'You travel where the trade winds blow east-west — the Indian Ocean rim from Mombasa to Madagascar, India to the Maldives. A geography of dhow harbours and bazaars, the route the monsoon sailed two thousand years before Europe found it.',
    // minCount 5→6 in v5.7. List is 21 countries; 5/21 = 24%, 6/21 = 29%.
    test: (ctx) => regionalScore(ctx, REGIONS.monsoonWalker, { minCount: 6, weight: 1.05 }),
  },
  {
    id: 'subcontinent-walker', name: 'The Subcontinent-Walker', family: 'regional',
    description: 'You travel South Asia — India and its neighbours, the Himalayas pinning the top, the islands below. An atlas of a billion lives, a thousand languages, one weather system.',
    test: (ctx) => regionalScore(ctx, REGIONS.subcontinentWalker, { minCount: 3, weight: 1.05 }),
  },
  {
    id: 'mekong-walker', name: 'The Mekong-Walker', family: 'regional',
    description: 'You travel the long river of Indochina — Vietnam to Myanmar, Thailand to Laos. An atlas of rice terraces, pagoda gold, the slow brown current cutting through five countries on its way to the sea.',
    test: (ctx) => regionalScore(ctx, REGIONS.mekongWalker, { minCount: 3, weight: 1.10 }),
  },
  {
    // id 'dragon-coast' kept for state stability; display renamed in v5.7
    // because "Dragon-Coast" read as a route/Set name. Joins the -Walker
    // family for consistency.
    id: 'dragon-coast', name: 'The Pacific-Walker', family: 'regional',
    description: 'You travel the great Asian rim from the Pacific shore — Japan to Indonesia, Korea to the Philippines. An atlas of the world’s most populated coastline, every emperor’s claim, every typhoon’s arrival.',
    test: (ctx) => regionalScore(ctx, REGIONS.dragonCoast, { minCount: 5, weight: 1.00 }),
  },
  {
    id: 'trade-winds', name: 'The Trade-Winds', family: 'regional',
    description: 'Your atlas spans three continents looking across the world’s largest ocean. Asia to the Americas via Oceania — the volcanoes, the date line, the ring of fire.',
    test: (ctx) => regionalScore(ctx, REGIONS.tradeWinds, {
      minCount: 6, weight: 0.95, requireSpread: requireSpreadPacific,
    }),
  },
  {
    id: 'atlantic-bridge', name: 'The Atlantic-Bridge', family: 'regional',
    // v5.7: "triangular trade" euphemism removed (it minimises the slave
    // trade by aestheticising it). Reframed as three coasts on one wind.
    description: 'Your atlas reads as a single map across the Atlantic — Europe, West Africa, the Americas. Three coasts on one wind, three histories the same ocean wrote together.',
    test: (ctx) => regionalScore(ctx, REGIONS.atlanticBridge, {
      minCount: 6, weight: 0.95, requireSpread: requireSpreadAtlantic,
    }),
  },
  {
    id: 'southern-cross', name: 'The Southern-Cross', family: 'regional',
    description: 'Your atlas sits under a different night sky — Australia, New Zealand, the coral microstates of the southern Pacific. A geography of the long-water world, where the islands are most of the country.',
    test: (ctx) => regionalScore(ctx, REGIONS.southernCross, { minCount: 3, weight: 1.10 }),
  },

  // ============= Family B — Pattern archetypes (6) =============

  {
    id: 'sphere-walker', name: 'The Sphere-Walker', family: 'pattern',
    description: 'You travel as if the planet were the unit of measurement — meaningful presence in all four hemispheres, plus genuine span across both axes. An atlas that closes the full sphere.',
    // v5.7 rework. The previous test required 3+ visits in each of N/S/E/W
    // plus count ≥ 18, which duplicated Hemispherist Line tier 4 (the same
    // problem that retired Five-Skies). The hemispheric quota is necessary
    // but not sufficient — a user with 18 visits clustered in Europe + 1
    // each in S/E/W could trigger it without an actually planet-scale atlas.
    //
    // New requirements:
    //   • count ≥ 18                       — discourages the small-atlas case
    //   • ≥ 3 distinct countries in each   — same as before
    //     of N, S, E, W
    //   • lat span ≥ 100°                  — north-most to south-most ≥ 100°
    //   • lng reach ≥ 180°                 — span across the planet, computed
    //                                        across the date line (360 minus
    //                                        the largest gap between sorted
    //                                        longitudes, including wrap)
    //
    // The longitude calculation handles the antimeridian correctly. A user
    // with NZ + USA + Europe gets ~245° reach; a user with all visits in
    // Europe gets ~30° and fails. Score 75 (ties Long-Stride at the 40-
    // country threshold; tier wins on family priority).
    test: (ctx) => {
      if (ctx.count < 18) return 0;

      let n = 0, s = 0, e = 0, w = 0;
      for (let i = 0; i < ctx.lats.length; i++) {
        if (ctx.lats[i] >= 0) n++; else s++;
        if (ctx.lngs[i] >= 0) e++; else w++;
      }
      if (n < 3 || s < 3 || e < 3 || w < 3) return 0;

      const latRange = Math.max(...ctx.lats) - Math.min(...ctx.lats);
      if (latRange < 100) return 0;

      // Longitude reach across the date line: sort the longitudes, find
      // the largest gap between consecutive points (including the wrap
      // gap from last back to first via 360°), and reach = 360 − largest.
      const sorted = [...ctx.lngs].sort((a, b) => a - b);
      let largestGap = 360 + sorted[0] - sorted[sorted.length - 1]; // wrap
      for (let i = 1; i < sorted.length; i++) {
        largestGap = Math.max(largestGap, sorted[i] - sorted[i - 1]);
      }
      const lngReach = 360 - largestGap;
      if (lngReach < 180) return 0;

      return 75;
    },
  },
  // Five-Skies removed in v5.5. Reason: it was a "check" rather than a
  // title — count of climate bands hit, with USA/CAN/RUS each contributing
  // multiple bands via the polar-territory override. Easy to trigger
  // through 3 specific countries rather than meaningful climate diversity,
  // and it duplicates the Climatologist Line (which already shows 1–5 band
  // tier progression). The Line keeps the concept; the title slot is gone.

  {
    id: 'mariner', name: 'The Mariner', family: 'pattern',
    description: 'Your atlas leans toward the sea — almost every country in it touches blue. Yours is a geography of coasts, harbours, and the salt edge of every continent.',
    // 60/72 — coast-focused traveler is recognized but doesn't crowd out
    // Globetrotter at 75 countries.
    test: (ctx) => {
      if (ctx.count < 15) return 0;
      const ratio = ctx.coastalCount / ctx.count;
      if (ratio >= 0.95) return 72;
      if (ratio >= 0.90) return 60;
      return 0;
    },
  },
  {
    id: 'inlander', name: 'The Inlander', family: 'pattern',
    description: 'You travel away from the ports. Half or more of your countries are landlocked — the Stans, the Alps, the African interior. Yours is the long-view atlas, no horizon of water.',
    test: (ctx) => {
      if (ctx.count < 12) return 0;
      const ratio = ctx.landlockedCount / ctx.count;
      if (ratio >= 0.60) return 72;
      if (ratio >= 0.50) return 60;
      return 0;
    },
  },
  // The Antipodean was removed in v5.6 — visiting an antipodal pair is a
  // one-shot fact (a "stamp"), not a kind of traveler. It belongs in a
  // future Badges layer, not as a primary identity. The hasAntipodalPair()
  // detection function stays in regions.js for that future use.

  {
    id: 'megapolitan', name: 'The Megapolitan', family: 'pattern',
    description: 'Your atlas centers on the world’s most populated countries — China, India, the United States, Indonesia, Brazil. Half of humanity lives in these places. Yours is the geography of the great populations.',
    test: (ctx) => {
      const hits = ctx.visited.filter(c => TOP_POPULOUS.has(c)).length;
      if (hits >= 6) return 80;
      if (hits >= 4) return 65;
      return 0;
    },
  },
  {
    id: 'equator-hand', name: 'The Equator-Hand', family: 'pattern',
    description: 'You travel in the equatorial belt — the band where seasons mean rain or no rain, where day equals night, where the rainforest replaces the calendar. An atlas of heat and green.',
    // Weight 0.85: the equatorialReach list is broad (~70 countries
    // including Mexico/India/Bangladesh as "reach"), so it can score high
    // for any tropical-leaning traveler. Discounted so it doesn't beat a
    // stronger regional title like Iberoamerican or Monsoon-Walker for
    // users whose tropical visits are incidental to a broader pattern.
    test: (ctx) => regionalScore(ctx, REGIONS.equatorialReach, { minCount: 5, weight: 0.85 }),
  },
  {
    id: 'aurora-bound', name: 'The Aurora-Bound', family: 'pattern',
    description: 'You travel where the sun goes sideways. Iceland, the Nordics, the Russian north, the Canadian Arctic — yours is the atlas of the long winter, the white nights, the green light overhead.',
    // v5.7: added Nordic spread requirement (≥ 2 of ISL/NOR/SWE/FIN). The
    // name is aurora-coded; without this, USA Alaska + Canadian Arctic +
    // Russian North + EST could fire it without any actual Nordic visit.
    test: (ctx) => {
      const nordicHits = NORDIC_CORE.filter(c => ctx.visitedSet.has(c)).length;
      if (nordicHits < 2) return 0;
      return regionalScore(ctx, REGIONS.polarReach, { minCount: 4, weight: 1.10 });
    },
  },

  // ============= Family C — Tier (4 — Cosmographer is short-circuited) =============

  // Tier titles — weight 1.0, scores aligned so each tier's score AT its
  // threshold matches Sphere-Walker (75) and beats it via tier-priority
  // tie-break. The user's title VISIBLY shifts at most milestones:
  //
  //   • count 40  → Long-Stride 75  (matches Sphere-Walker, tier wins ties)
  //   • count 75  → Globetrotter 87 (clearly wins)
  //   • count 150 → Completist 92   (clearly wins)
  //   • count 185 → Universalist 95+
  //   • count 195 → Cosmographer (short-circuit)
  //
  // Caveat: Megapolitan (pattern, score 80 with ≥6 TOP_POPULOUS hits) can
  // preempt Long-Stride at the 40-count mark for users whose 40 countries
  // happen to include 6+ of CHN/IND/USA/IDN/PAK/NGA/BRA/BGD/RUS/MEX. This
  // is intentional: such an atlas IS megapolitan-shaped, and the design
  // here is "best identity wins on score, ties go to tier". From count 75
  // onward, Globetrotter+ outscore Megapolitan unconditionally.
  {
    id: 'universalist', name: 'The Universalist', family: 'tier',
    description: 'You travel as if completion were the point — within ten countries of the full set. Yours is the atlas almost finished, the politics of the impossible passport, the last few being the hardest of all.',
    test: (ctx) =>
      tierScore(ctx.count, c => c >= 185 && c < 195 ? 95 + (c - 185) * 0.4 : 0, 1.00, 99),
  },
  {
    id: 'completist', name: 'The Completist', family: 'tier',
    description: 'You travel for the depth of breadth — a hundred and fifty countries and still going. Yours is the long, serious project: most of the world walked, most of the visas earned, most of the maps known by hand.',
    test: (ctx) =>
      tierScore(ctx.count, c => c >= 150 ? 92 + (c - 150) * 0.1 : 0, 1.00, 94),
  },
  {
    id: 'globetrotter', name: 'The Globetrotter', family: 'tier',
    description: 'Your atlas is wide as a matter of habit — seventy-five countries and rising. The broad-spread map: most regions visited, most continents touched, the world less unfamiliar than not.',
    test: (ctx) =>
      tierScore(ctx.count, c => c >= 75 ? 87 + (c - 75) * 0.05 : 0, 1.00, 91),
  },
  {
    // id 'long-march' kept for state stability; display renamed in v5.7
    // because "The Long March" is a specific 1934-35 event in Chinese
    // Communist history and reading it as a generic 40-country tier was
    // either appropriating that history or trivialising it.
    id: 'long-march', name: 'The Long-Stride', family: 'tier',
    description: 'Your atlas has crossed into geography — forty countries marked, the threshold where the map starts to feel like a real piece of the world.',
    test: (ctx) =>
      tierScore(ctx.count, c => c >= 40 ? 75 + (c - 40) * 0.2 : 0, 1.00, 86),
  },
];

// Cosmographer is special — it short-circuits the entire scoring loop when
// count >= 195 so it cannot lose to a 100% regional title on tie-break.
export const COSMOGRAPHER = {
  id: 'cosmographer', name: 'The Cosmographer', family: 'tier',
  description: 'You travel as if the world itself were the project — all 195 sovereign states of Earth set foot in. Perhaps a thousand people on the planet have done this. The atlas, complete.',
};

// === Context builder ===

// Builds the ctx object that every test() consumes. Run once per render in
// stats.html. Centralizing this means tests can be pure and cheap.
//
// v5.7: dedupes the visited list defensively. computeTitle is a pure
// function and the caller (stats.html) typically passes a deduped list,
// but if a duplicate ever slips through the inflated ctx.count would break
// density math — a user with 6 ESP entries plus 6 IT entries would hit
// olive-branch density 12/12 = 100% when really it's 2/2. Cheap to fix
// here once.
export function buildTitleState(visited) {
  const visitedSet = new Set(visited);
  const uniqueVisited = [...visitedSet];

  const lats = [], lngs = [];
  let landlockedCount = 0, coastalCount = 0;
  const continents = new Set();
  const hemispheres = new Set();
  const climates = new Set();

  for (const iso of uniqueVisited) {
    const c = COUNTRIES[iso];
    if (!c) continue;
    const [cont, , , , lat, lng] = c;
    lats.push(lat);
    lngs.push(lng);
    continents.add(cont);

    // Hemispheres — equator/meridian straddlers credit both.
    if (Math.abs(lat) <= 2)       { hemispheres.add('N'); hemispheres.add('S'); }
    else if (lat >= 0)            hemispheres.add('N');
    else                          hemispheres.add('S');
    if (Math.abs(lng) <= 2)       { hemispheres.add('E'); hemispheres.add('W'); }
    else if (lng >= 0)            hemispheres.add('E');
    else                          hemispheres.add('W');

    // Climates — centroid + polar-territory override.
    climates.add(climateZone(lat));
    if (POLAR_TERRITORY.has(iso)) climates.add('Polar');

    if (LANDLOCKED.has(iso)) landlockedCount++;
    else                     coastalCount++;
  }

  return {
    visited: uniqueVisited,
    visitedSet,
    count: uniqueVisited.length,
    lats, lngs,
    continents,
    hemispheres,
    climates,
    landlockedCount,
    coastalCount,
  };
}

// === Resolution ===

// Picks a primary title (and optional secondary tag) given the visited list.
// Pure function — same input always produces same output. Toggling a country
// off and on, reordering the list, or passing duplicates all yield the same
// result (dedupe + Set lookups make order/multiplicity irrelevant).
//
// Return shape:
//   { primary: { id, name, description, score?, empty?, text? },
//     secondary: { id, name, description, score } | null }
export function computeTitle(visited) {
  // Defensive: accept any iterable / null / undefined.
  const visitedArr = Array.isArray(visited) ? visited : (visited ? [...visited] : []);

  const ctx = buildTitleState(visitedArr);

  // Empty / Newcomer — short copy lines, no scoring.
  if (ctx.count === 0) {
    return {
      primary: { id: 'empty', empty: true, text: 'Your atlas is empty.' },
      secondary: null,
    };
  }
  if (ctx.count < 5) {
    return {
      primary: { id: 'newcomer', empty: true, text: 'Your atlas is just beginning.' },
      secondary: null,
    };
  }

  // Cosmographer short-circuit — can't lose ties.
  if (ctx.count >= 195) {
    return {
      primary: { ...COSMOGRAPHER, score: 100 },
      secondary: null,
    };
  }

  // Score every title; keep those clearing 30.
  const scored = TITLES
    .map(t => ({ title: t, score: t.test(ctx) }))
    .filter(s => s.score >= 30)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Tie-break: family priority then alphabetical id.
      // Order: regional > tier > pattern. Reasoning:
      //   • A regional concentration (Olive-Branch, Caravaneer, etc.) is
      //     the most identity-defining signal — keeps top priority.
      //   • A tier achievement (Globetrotter at 75, Completist at 150) is
      //     a real milestone that should claim its score over a pattern
      //     that happened to fire incidentally (Sphere-Walker).
      //   • Patterns last: they fire for any user whose atlas has the
      //     right shape, but they shouldn't override a count milestone.
      const famOrder = { regional: 0, tier: 1, pattern: 2 };
      const af = famOrder[a.title.family], bf = famOrder[b.title.family];
      if (af !== bf) return af - bf;
      return a.title.id.localeCompare(b.title.id);
    });

  if (scored.length === 0) {
    return { primary: honestFallback(ctx), secondary: null };
  }

  // Specificity beats generality — the specific suppresses the general
  // when the specific scores at least as high.
  //
  // v5.7 changed strict `>` to `>=` so that ties at the 100 cap go to the
  // specific. Concrete cases:
  //   • 8/8 Mongol Empire visits → Mongol (100), Long-Horizon (94 — fails
  //     density floor when the 8 are spread across the broader empire).
  //     94 ≥ 100 is false → Long-Horizon doesn't suppress, Mongol wins. ✓
  //   • 7/7 Long-Horizon visits → Long-Horizon (cap 100), Caravaneer
  //     (cap 100). With `>` the alphabetical tie-break gave Caravaneer;
  //     with `>=` the specific wins, which is what the nesting intends.
  //   • 8/10 Med + 2 broader EU → Olive-Branch (92) suppresses Romanesque
  //     (83). ✓
  //   • 6/11 Med + 5 broader EU → Romanesque (80) wins; Olive-Branch (65)
  //     fails density floor or doesn't reach Romanesque's score. ✓
  const suppressedGenerals = new Set();
  for (const s of scored) {
    const generals = NESTED[s.title.id] || [];
    for (const gen of generals) {
      const genEntry = scored.find(x => x.title.id === gen);
      if (genEntry && s.score >= genEntry.score) {
        suppressedGenerals.add(gen);
      }
    }
  }
  const filtered = scored.filter(s => !suppressedGenerals.has(s.title.id));

  if (filtered.length === 0) {
    // Pathological: every fired title got suppressed. Fall back to the
    // top scorer regardless of suppression so the user always has a name.
    return {
      primary: { ...scored[0].title, score: scored[0].score },
      secondary: null,
    };
  }

  const top = filtered[0];
  const primary = {
    id: top.title.id,
    name: top.title.name,
    description: top.title.description,
    family: top.title.family,
    score: top.score,
  };

  // Secondary tag: a runner-up within 8 points that isn't nested under
  // the primary and isn't itself a suppressed general. "Olive-Branch •
  // Caravaneer" interesting; "Olive-Branch • Romanesque" redundant.
  const secEntry = filtered.slice(1).find(s =>
    primary.score - s.score <= 8 && !isNested(primary.id, s.title.id)
  );
  const secondary = secEntry
    ? { id: secEntry.title.id, name: secEntry.title.name,
        description: secEntry.title.description, score: secEntry.score }
    : null;

  return { primary, secondary };
}

// Honest fallback when nothing scores ≥ 30. Replaces the v4-era "default to
// Wanderer" mislabel. Four flavors of fallback now, all honest, each
// distinguishing a different stage / shape:
//
//   • Sketcher    — small + focused (5–9 countries, single continent)
//   • Traveller   — small or mid + mixed (5–19, no clear pattern, < 4 conts)
//   • Wayfarer    — early breadth (10–19, 4+ continents, no concentration)
//   • Wanderer    — earned breadth (20+, 4+ continents, no concentration)
export function honestFallback(ctx) {
  if (ctx.count < 10 && ctx.continents.size === 1) {
    return {
      id: 'sketcher', name: 'The Sketcher',
      description: 'You travel deep before you travel wide — a small atlas, focused close. One continent so far, a region you’ve started to know well. The first chapter of something.',
      family: 'fallback',
    };
  }
  if (ctx.count < 20 && ctx.continents.size >= 4) {
    return {
      id: 'wayfarer', name: 'The Wayfarer',
      description: 'You travel broadly already — four continents in just over a dozen visits. The pattern hasn’t settled yet, but the reach is there. Your atlas is becoming the world.',
      family: 'fallback',
    };
  }
  if (ctx.count < 20) {
    return {
      id: 'traveller', name: 'The Traveller',
      description: 'You travel without a settled pattern yet — the middle distance, past the first trips and before the first lean. Whatever shape this becomes, it’s still becoming.',
      family: 'fallback',
    };
  }
  // 20+ but nothing scored ≥ 30 — genuinely scattered. Earned Wanderer.
  if (ctx.continents.size >= 4) {
    return {
      id: 'wanderer', name: 'The Wanderer',
      description: 'You travel without concentration — visits scattered across four continents, no single region dominant. Yours is the atlas of the curious, the broad and unhurried gaze.',
      family: 'fallback',
    };
  }
  // 20+ but fewer than 4 continents — still Traveller.
  return {
    id: 'traveller', name: 'The Traveller',
    description: 'You travel without a settled pattern yet — the middle distance, past the first trips and before the first lean. Whatever shape this becomes, it’s still becoming.',
    family: 'fallback',
  };
}
