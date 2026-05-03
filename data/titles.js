// titles.js — v5.1
//
// The Atlas Title classifier. 38 titles in 5 families, graded scoring.
// See docs/titles-redesign-v5.md for the design doc.
//
// Three-layer principle (the rule that picks names):
//   • Sets   are *places*    — "The Maghreb",     answers "completed?"
//   • Lines  are *axes*      — "The Demographer", answers "how far?"
//   • Titles are *characters*— "The Caravaneer",  answers "what kind of traveller?"
//
// Each title returns a 0–100 score from its `test(ctx)`. computeTitle picks
// the highest scorer above 30; below that, an honest fallback applies. The
// 0.45 density floor + per-region weights guarantee that popular regions
// (Mediterranean, Old World) cannot mislabel users with light incidental
// visits — the audit's core failure mode is closed.

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

// === Scoring ===

// Regional / latitude-band score. Density-floored, weight-bumped, capped 100.
// This is the scoring function for almost every Family A and Family B title.
//
//   density  = inRegion / total visits   (how concentrated)
//   coverage = inRegion / regionList     (how much of the region is visited)
//
// Density is the dominant signal. The weight bump (1.20 for rare regions
// like Long-Horizon, 0.85 for broad ones like Old-Empire) is what enforces
// the "specificity beats popularity" principle.
function regionalScore(ctx, regionList, opts = {}) {
  const { minCount = 4, weight = 1.0, requireSpread } = opts;
  const visitedSet = ctx.visitedSet;

  const inRegion = regionList.filter(c => visitedSet.has(c));
  const inRegionCount = inRegion.length;
  if (inRegionCount < minCount) return 0;

  const density  = inRegionCount / ctx.count;
  const coverage = inRegionCount / regionList.length;

  // The 0.50 density floor (raised from 0.45). At 0.45–0.50 a region is
  // incidental, not identity-defining: a user with 5 of 11 visits in one
  // place is more "broadly travelling, including some X" than "X-leaning".
  // Especially important for broad sub-regions like Cordillera that would
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

// Tier score builder. Used by Long-March / Globetrotter / Completist /
// Universalist. Cosmographer is handled by short-circuit in computeTitle.
function tierScore(count, formula, weight, capRaw = 100) {
  const raw = Math.min(capRaw, formula(count));
  return Math.min(100, Math.round(raw * weight));
}

// === The 38 titles ===
//
// Field shape:
//   id          stable identifier (kebab-case)
//   name        display name (proper noun, character-named)
//   family      'regional' | 'pattern' | 'tier'  (used for tie-break)
//   description 50-word blurb shown in the masthead and tap-reveal
//   test(ctx)   returns a score 0–100; 0 means "doesn't apply"

export const TITLES = [
  // ============= Family A — Regional archetypes (24) =============
  //
  // Voice rule for descriptions: each blurb names a *kind of traveler*, not
  // a place or an achievement. No "you've reached", no "you've completed".
  // The title is a portrait, not a tier or a checklist.

  {
    id: 'olive-branch', name: 'The Olive-Branch', family: 'regional',
    description: 'You travel where the inland sea is the central character. Yours is an atlas of olives, ferries, port towns, midday shade — the long warm coast that has hosted three thousand years of arrival and departure.',
    test: (ctx) => regionalScore(ctx, REGIONS.oliveBranch, { minCount: 6, weight: 0.95 }),
  },
  {
    id: 'caravaneer', name: 'The Caravaneer', family: 'regional',
    description: 'You belong to the dry latitudes — Maghreb to the Stans, the Sahel to the Arabian wells. Your atlas is the geography of the long road, the well-watched well, salt and dust and stars overhead.',
    test: (ctx) => regionalScore(ctx, REGIONS.caravaneer, { minCount: 5, weight: 1.20 }),
  },
  {
    id: 'long-horizon', name: 'The Long-Horizon', family: 'regional',
    description: 'You travel where the sky is the largest part of the picture. Mongolia and the Stans — the open interior, the steppe, the country that doesn’t end in any direction the eye can see.',
    test: (ctx) => regionalScore(ctx, REGIONS.longHorizon, { minCount: 3, weight: 1.15 }),
  },
  {
    id: 'romanesque', name: 'The Romanesque', family: 'regional',
    description: 'You walk where Rome walked. Britain to the Levant, the Maghreb to the Greek east — your atlas mirrors the reach of the long-roaded empire, the columned cities, the limes drawn against the wilder world beyond.',
    // Replaces the v1 vague "Old-Empire". minCount 10 + weight 0.80: still a
    // broad regional title, but tied to a specific civilisational identity.
    // A user concentrated in Roman-Empire footprint earns this; casual
    // European tourists with 8-9 popular destinations still fall to Traveller.
    test: (ctx) => regionalScore(ctx, REGIONS.romanesque, { minCount: 10, weight: 0.80 }),
  },
  {
    id: 'hanseatic', name: 'The Hanseatic', family: 'regional',
    description: 'You travel the cold-water world — North Sea, Baltic, the gabled trading towns. Your atlas is herring and amber and brick, the long winter port, the patient northern light.',
    test: (ctx) => regionalScore(ctx, REGIONS.hanseatic, { minCount: 5, weight: 1.05 }),
  },
  {
    id: 'mongol', name: 'The Mongol', family: 'regional',
    description: 'Your atlas mirrors the swiftest empire ever built — Karakorum to Damascus, Beijing to Kyiv. The post horse, the steppe, the courier system that moved across half the known world in days.',
    test: (ctx) => regionalScore(ctx, REGIONS.mongol, { minCount: 5, weight: 1.10 }),
  },
  {
    id: 'crossroads', name: 'The Crossroads', family: 'regional',
    description: 'You travel the country between countries — the Caucasus, the Anatolian plateau, the Iranian uplands. Where the Silk Road folded, where languages stack three deep, where east and west keep turning into each other.',
    test: (ctx) => regionalScore(ctx, REGIONS.crossroads, { minCount: 3, weight: 1.20 }),
  },
  {
    id: 'conquistador', name: 'The Conquistador', family: 'regional',
    description: 'You travel where the galleons reached — Iberia to the Andes, the Caribbean to the Philippines. A Hispanic-Lusophone atlas of cathedrals on hilltops, mestizo cities, the long colonial echo.',
    // Replaces v1 "Frontier". minCount 8 + weight 0.85: broad but tied to
    // a real historical identity. Drops users with USA/CAN-only travel —
    // they fire Pioneer instead.
    test: (ctx) => regionalScore(ctx, REGIONS.conquistador, { minCount: 8, weight: 0.85 }),
  },
  {
    id: 'pioneer', name: 'The Pioneer', family: 'regional',
    description: 'Yours is the pink-on-the-map atlas — England, the settler colonies, the subcontinent, Anglo-Africa. The common law, the cricket pitch, English fields exported to four climates and a thousand soils.',
    test: (ctx) => regionalScore(ctx, REGIONS.pioneer, { minCount: 7, weight: 0.90 }),
  },
  {
    id: 'cordillera', name: 'The Cordillera', family: 'regional',
    description: 'You travel where the mountains run the show. The Andean spine — altitude, altiplano, the bus that takes a day to cross what looks short on the map. Yours is an atlas read at four thousand metres.',
    test: (ctx) => regionalScore(ctx, REGIONS.cordillera, { minCount: 4, weight: 1.10 }),
  },
  {
    id: 'pampas-light', name: 'The Pampas-Light', family: 'regional',
    description: 'You belong to the temperate south of the New World — the grasslands, the Patagonian wind, the long nights at high latitude on the wrong side of the equator. An atlas where summer comes in January.',
    test: (ctx) => regionalScore(ctx, REGIONS.pampasLight, { minCount: 3, weight: 1.15 }),
  },
  {
    id: 'river-drum', name: 'The River-Drum', family: 'regional',
    description: 'You travel where the great basin drains a continent. The Amazon — Brazil, Peru, Colombia, the green that goes on past where roads stop. An atlas of riverboats and cathedral canopy.',
    test: (ctx) => regionalScore(ctx, REGIONS.riverDrum, { minCount: 4, weight: 1.10 }),
  },
  {
    id: 'coral-path', name: 'The Coral-Path', family: 'regional',
    description: 'You travel the islands of the inland sea. Cuba to Trinidad, the chain the trade winds threaded — sugar, salt, reef, the long shadow of empire turned into Carnival and conch.',
    test: (ctx) => regionalScore(ctx, REGIONS.coralPath, { minCount: 4, weight: 1.05 }),
  },
  {
    id: 'dust-road', name: 'The Dust-Road', family: 'regional',
    description: 'You travel the dry belt south of the Sahara, where the desert exhales into savanna. Caravan country, baobab country — an atlas of millet and dust and the long horizon.',
    test: (ctx) => regionalScore(ctx, REGIONS.dustRoad, { minCount: 3, weight: 1.20 }),
  },
  {
    id: 'coffee-belt', name: 'The Coffee-Belt', family: 'regional',
    description: 'You travel the East African highlands — the rift valley, the green at altitude, the cradle of modernity’s first cup. Kenya, Ethiopia, the small countries that share the equator and the lakes.',
    test: (ctx) => regionalScore(ctx, REGIONS.coffeeBelt, { minCount: 3, weight: 1.15 }),
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
    id: 'saffron-road', name: 'The Saffron-Road', family: 'regional',
    description: 'You travel the Indian Ocean rim — the route the monsoon sailed two thousand years before Europe found it. India to East Africa, Madagascar to the Maldives. An atlas of bazaars, dhows, spice on the wind.',
    test: (ctx) => regionalScore(ctx, REGIONS.saffronRoad, { minCount: 5, weight: 1.05 }),
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
    id: 'dragon-coast', name: 'The Dragon-Coast', family: 'regional',
    description: 'You travel the great Asian rim from the Pacific shore — Japan to Indonesia, Korea to the Philippines. An atlas of the world’s most populated coastline, every emperor’s claim, every typhoon’s arrival.',
    test: (ctx) => regionalScore(ctx, REGIONS.dragonCoast, { minCount: 5, weight: 1.00 }),
  },
  {
    id: 'trade-winds', name: 'The Trade-Winds', family: 'regional',
    description: 'You travel where three continents look across the world’s largest ocean. Asia to the Americas via Oceania — the volcanoes, the date line, the long flights, the ring of fire.',
    test: (ctx) => regionalScore(ctx, REGIONS.tradeWinds, {
      minCount: 6, weight: 0.95, requireSpread: requireSpreadPacific,
    }),
  },
  {
    id: 'atlantic-bridge', name: 'The Atlantic-Bridge', family: 'regional',
    description: 'Your atlas reads as a single map across the Atlantic — Europe, West Africa, the Americas. The triangular trade’s geography seen from the water, the same wind moving three coasts.',
    test: (ctx) => regionalScore(ctx, REGIONS.atlanticBridge, {
      minCount: 6, weight: 0.95, requireSpread: requireSpreadAtlantic,
    }),
  },
  {
    id: 'southern-cross', name: 'The Southern-Cross', family: 'regional',
    description: 'You travel the southern Pacific — Australia, New Zealand, the coral microstates. An atlas under a different night sky, where the longest distances in the world are routine and the islands are most of the country.',
    test: (ctx) => regionalScore(ctx, REGIONS.southernCross, { minCount: 3, weight: 1.10 }),
  },

  // ============= Family B — Pattern archetypes (8) =============

  {
    id: 'sphere-walker', name: 'The Sphere-Walker', family: 'pattern',
    description: 'You travel as if the planet were the unit of measurement — meaningful presence in all four hemispheres, north and south of the equator, east and west of the meridian. An atlas that closes the full sphere.',
    // Strict per-hemisphere requirement: at least 3 distinct countries in
    // EACH of N, S, E, W. The previous version (just "any 4 hemispheres
    // touched") fired for focused African or Pacific atlases that grazed
    // multiple hemispheres via single equator/meridian-straddling countries.
    // Plus count ≥ 18 (was 12) so this remains a "really earned" pattern.
    test: (ctx) => {
      if (ctx.count < 18) return 0;
      let n = 0, s = 0, e = 0, w = 0;
      for (const iso of ctx.visited) {
        const c = COUNTRIES[iso]; if (!c) continue;
        const lat = c[4], lng = c[5];
        if (lat >= 0) n++; else s++;
        if (lng >= 0) e++; else w++;
      }
      if (n < 3 || s < 3 || e < 3 || w < 3) return 0;
      return 78;
    },
  },
  {
    id: 'five-skies', name: 'The Five-Skies', family: 'pattern',
    description: 'You travel through every kind of weather — tropical, subtropical, temperate, subarctic, polar. Yours is an atlas where the seasons of one country are foreign to the seasons of another.',
    // Only fires for genuine 5-climate atlases. The previous "4 climates ≥
    // 60" fallback was firing as primary for broad European travelers who
    // happened to span subarctic Latvia and tropical Yemen — an over-easy
    // achievement-style match. Five-Skies is now a high bar: requires
    // hitting Polar, which means visiting Iceland, Nordics, Russia north,
    // or Canada/USA Alaska.
    test: (ctx) => {
      if (ctx.count < 15) return 0;
      return ctx.climates.size === 5 ? 82 : 0;
    },
  },
  {
    id: 'mariner', name: 'The Mariner', family: 'pattern',
    description: 'You travel where the sea is the constant — almost every country in your atlas touches blue. Yours is the harbour view, the ferry timetable, the salt-air arrival.',
    // The world is 78% coastal, so a 75% threshold means "below the global
    // average" — which fires Mariner for any user with broad popular travel.
    // 90% means *deliberately* sea-focused (sailors, beach travelers, island
    // hoppers). minCount 15 (was 12) keeps low-count users from triggering.
    // Score range 65/80 (was 70/85) so Mariner doesn't beat Five-Skies (82)
    // or strong regional titles for users whose 90%+ coastal is an artifact
    // of broad popular travel rather than deliberate coast-focus.
    test: (ctx) => {
      if (ctx.count < 15) return 0;
      const ratio = ctx.coastalCount / ctx.count;
      if (ratio >= 0.95) return 80;
      if (ratio >= 0.90) return 65;
      return 0;
    },
  },
  {
    id: 'inlander', name: 'The Inlander', family: 'pattern',
    description: 'You travel away from the ports. Half or more of your countries are landlocked — the Stans, the Alps, the African interior. Yours is the long-view atlas, no horizon of water.',
    // The world is only 22% landlocked. 50% landlocked is genuinely
    // inland-focused; below that is just normal travel that includes a
    // few inland countries. (Was 35%, which fires for too many casual
    // mixed-itinerary users.)
    test: (ctx) => {
      if (ctx.count < 12) return 0;
      const ratio = ctx.landlockedCount / ctx.count;
      if (ratio >= 0.60) return 82;
      if (ratio >= 0.50) return 68;
      return 0;
    },
  },
  {
    id: 'antipodean', name: 'The Antipodean', family: 'pattern',
    description: 'You’ve stood on opposite sides of the planet — two countries that line up through the centre of the earth. A geographic rhyme: the atlas at its full possible reach.',
    test: (ctx) => {
      if (ctx.count < 20) return 0;
      return hasAntipodalPair(ctx.visited, COUNTRIES) ? 75 : 0;
    },
  },
  {
    id: 'megapolitan', name: 'The Megapolitan', family: 'pattern',
    description: 'You travel where most of humanity actually lives — China, India, the United States, Indonesia, the great populated countries. Yours is the crowded atlas, the megacity skyline, the queue at the gate.',
    test: (ctx) => {
      const hits = ctx.visited.filter(c => TOP_POPULOUS.has(c)).length;
      if (hits >= 6) return 85;
      if (hits >= 4) return 70;
      return 0;
    },
  },
  {
    id: 'equator-hand', name: 'The Equator-Hand', family: 'pattern',
    description: 'You travel in the equatorial belt — the band where seasons mean rain or no rain, where day equals night, where the rainforest replaces the calendar. An atlas of heat and green.',
    // Weight 0.85 (was 1.00): the equatorialReach list is broad (~70 countries
    // including Mexico/India/Bangladesh as "reach"), so it can score high for
    // any tropical-leaning traveler. Discounted so it doesn't beat a stronger
    // regional title like Frontier or Saffron-Road for users whose tropical
    // visits are incidental to a broader pattern.
    test: (ctx) => regionalScore(ctx, REGIONS.equatorialReach, { minCount: 5, weight: 0.85 }),
  },
  {
    id: 'aurora-bound', name: 'The Aurora-Bound', family: 'pattern',
    description: 'You travel where the sun goes sideways. Iceland, the Nordics, the Russian north, the Canadian Arctic — yours is the atlas of the long winter, the white nights, the green light overhead.',
    test: (ctx) => regionalScore(ctx, REGIONS.polarReach, { minCount: 4, weight: 1.10 }),
  },

  // ============= Family C — Tier (4 — Cosmographer is short-circuited) =============

  {
    id: 'universalist', name: 'The Universalist', family: 'tier',
    description: 'You travel as if completion were the point — within ten countries of the full set. Yours is the atlas almost finished, the politics of the impossible passport, the last few being the hardest of all.',
    test: (ctx) =>
      tierScore(ctx.count, c => c >= 185 && c < 195 ? 92 + (c - 185) : 0, 0.95),
  },
  {
    id: 'completist', name: 'The Completist', family: 'tier',
    description: 'You travel for the depth of breadth — a hundred and fifty countries and still going. Yours is the long, serious project: most of the world walked, most of the visas earned, most of the maps known by hand.',
    test: (ctx) =>
      tierScore(ctx.count, c => c >= 150 ? 75 + (c - 150) * 0.4 : 0, 0.90, 88),
  },
  {
    id: 'globetrotter', name: 'The Globetrotter', family: 'tier',
    description: 'You travel widely as a matter of habit — seventy-five countries and rising. Yours is the broad, unhurried atlas: airline statuses unbothered, time zones in the bones, no surprise left at any departure board.',
    test: (ctx) =>
      tierScore(ctx.count, c => c >= 75 ? 55 + (c - 75) * 0.2 : 0, 0.85, 70),
  },
  {
    id: 'long-march', name: 'The Long-March', family: 'tier',
    description: 'You travel past tourism, into geography — forty countries, the threshold where the atlas starts to feel like a real piece of the world. The long walk has properly begun.',
    test: (ctx) =>
      tierScore(ctx.count, c => c >= 40 ? 45 + (c - 40) * 0.3 : 0, 0.75, 60),
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
export function buildTitleState(visited) {
  const visitedSet = new Set(visited);
  const lats = [], lngs = [];
  let landlockedCount = 0, coastalCount = 0;
  const continents = new Set();
  const hemispheres = new Set();
  const climates = new Set();

  for (const iso of visited) {
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
    visited,
    visitedSet,
    count: visited.length,
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
// Return shape:
//   { primary: { id, name, description, score?, empty?, text? },
//     secondary: { id, name, description, score } | null }
export function computeTitle(visited) {
  const ctx = buildTitleState(visited);

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
      const famOrder = { regional: 0, pattern: 1, tier: 2 };
      const af = famOrder[a.title.family], bf = famOrder[b.title.family];
      if (af !== bf) return af - bf;
      return a.title.id.localeCompare(b.title.id);
    });

  if (scored.length === 0) {
    return { primary: honestFallback(ctx), secondary: null };
  }

  // Specificity beats generality — but only when the specific *outscores*
  // the general. Strict rule: suppress general iff specific > general.
  //
  // The earlier "within-12-points" version had a bug: a user with 8/8 in
  // Mongol Empire reach scored 100 on Mongol but 94 on Long-Horizon (its
  // nested specific). Long-Horizon at 94 was suppressing Mongol at 100 —
  // meaning the more-general identity, which actually fit better, was
  // being hidden. Strict rule: only suppress when the specific genuinely
  // wins by score. The score already captures density-vs-coverage
  // tradeoffs; we should trust it.
  //
  // Concrete examples after this fix:
  //   • 8/8 Mongol Empire visits → Mongol (100) wins, Long-Horizon (94) doesn't suppress.
  //   • 8/10 Med + 2 broader EU → Olive-Branch (92) suppresses Romanesque (83). ✓
  //   • 6/11 Med + 5 broader EU → Romanesque (80) wins; Olive-Branch (65) doesn't reach it.
  //     (User has a Med lean within a broader Roman-footprint atlas — Romanesque is honest.)
  const suppressedGenerals = new Set();
  for (const s of scored) {
    const generals = NESTED[s.title.id] || [];
    for (const gen of generals) {
      const genEntry = scored.find(x => x.title.id === gen);
      if (genEntry && s.score > genEntry.score) {
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
  // Caravaneer" interesting; "Olive-Branch • Old-Empire" redundant.
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
// Wanderer" mislabel. Wanderer is now an *earned* title that requires real
// breadth (20+ countries, 4+ continents).
export function honestFallback(ctx) {
  if (ctx.count < 10 && ctx.continents.size === 1) {
    return {
      id: 'sketcher', name: 'The Sketcher',
      description: 'You travel deep before you travel wide — a small atlas, focused close. One continent so far, a region you’ve started to know well. The first chapter of something.',
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
