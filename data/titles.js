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

  // The 0.45 density floor — the single most load-bearing number. Below
  // this, a region is incidental, not identity-defining.
  if (density < 0.45) return 0;

  // Density curve: 0.45→55, 0.60→75, 0.80→92, 1.00→100.
  let score;
  if (density < 0.60)      score = 55 + (density - 0.45) * 133;
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
  // ============= Family A — Regional archetypes (21) =============

  {
    id: 'olive-branch', name: 'The Olive-Branch', family: 'regional',
    description: 'For the traveller drawn to the inland sea — olives, ferries, ports. The long warm coast where three continents look at each other across the water.',
    test: (ctx) => regionalScore(ctx, REGIONS.oliveBranch, { minCount: 6, weight: 0.95 }),
  },
  {
    id: 'caravaneer', name: 'The Caravaneer', family: 'regional',
    description: 'Drylands. The Maghreb, the Sahel, the Arabian wells, the Central Asian basins — the long road of dust, salt, and stars on the horizon.',
    test: (ctx) => regionalScore(ctx, REGIONS.caravaneer, { minCount: 5, weight: 1.20 }),
  },
  {
    id: 'long-horizon', name: 'The Long-Horizon', family: 'regional',
    description: 'The steppe. Open interior, big sky. Mongolia and the Stans, the basins where empires moved on horseback and the wind never stops.',
    test: (ctx) => regionalScore(ctx, REGIONS.longHorizon, { minCount: 3, weight: 1.15 }),
  },
  {
    id: 'old-empire', name: 'The Old-Empire', family: 'regional',
    description: 'Europe, Western Asia, North Africa — the long-inhabited heartland where most cities are older than most countries. The classical reach.',
    test: (ctx) => regionalScore(ctx, REGIONS.oldEmpire, { minCount: 8, weight: 0.85 }),
  },
  {
    id: 'crossroads', name: 'The Crossroads', family: 'regional',
    description: 'The Caucasus and the Iranian plateau. The country between countries — Armenian, Azerbaijani, Georgian, Persian — where east meets west and east again.',
    test: (ctx) => regionalScore(ctx, REGIONS.crossroads, { minCount: 3, weight: 1.20 }),
  },
  {
    id: 'frontier', name: 'The Frontier', family: 'regional',
    description: 'The Americas. From the boreal forest to the southern tip — the long continent that took two centuries to map and still has corners untold.',
    test: (ctx) => regionalScore(ctx, REGIONS.frontier, { minCount: 6, weight: 0.85 }),
  },
  {
    id: 'cordillera', name: 'The Cordillera', family: 'regional',
    description: 'The Andean spine. Altitude, altiplano, llamas at four thousand metres. The mountain backbone of South America from the Caribbean to Patagonia.',
    test: (ctx) => regionalScore(ctx, REGIONS.cordillera, { minCount: 4, weight: 1.10 }),
  },
  {
    id: 'pampas-light', name: 'The Pampas-Light', family: 'regional',
    description: 'The Southern Cone. Argentine grasslands, Chilean coast, the Uruguayan flat — the temperate south of the New World, where the wind comes off the pole.',
    test: (ctx) => regionalScore(ctx, REGIONS.pampasLight, { minCount: 3, weight: 1.15 }),
  },
  {
    id: 'river-drum', name: 'The River-Drum', family: 'regional',
    description: 'The Amazon. The basin that drains a continent. Brazil, Peru, Colombia — the deep green, still half-mapped from above and unknown from within.',
    test: (ctx) => regionalScore(ctx, REGIONS.riverDrum, { minCount: 4, weight: 1.10 }),
  },
  {
    id: 'coral-path', name: 'The Coral-Path', family: 'regional',
    description: 'The Caribbean. Reef and palm and inland sea, the islands the trade winds threaded — Cuba to Trinidad, sugar and salt and the long shadow of empire.',
    test: (ctx) => regionalScore(ctx, REGIONS.coralPath, { minCount: 4, weight: 1.05 }),
  },
  {
    id: 'dust-road', name: 'The Dust-Road', family: 'regional',
    description: 'The Sahel. The dry belt south of the Sahara, where the desert exhales into savanna. Mali, Niger, Chad — caravan country, baobab country, the long horizon.',
    test: (ctx) => regionalScore(ctx, REGIONS.dustRoad, { minCount: 3, weight: 1.20 }),
  },
  {
    id: 'coffee-belt', name: 'The Coffee-Belt', family: 'regional',
    description: 'The East African highlands. Kenya, Tanzania, Uganda, Rwanda, Ethiopia — the cradle of modernity’s first cup, the rift valley, the green at altitude.',
    test: (ctx) => regionalScore(ctx, REGIONS.coffeeBelt, { minCount: 3, weight: 1.15 }),
  },
  {
    id: 'horn-light', name: 'The Horn-Light', family: 'regional',
    description: 'The Horn of Africa. Ethiopia, Eritrea, Somalia, Djibouti — high plateau, ancient liturgy, the geography that watches the Red Sea.',
    test: (ctx) => regionalScore(ctx, REGIONS.hornLight, { minCount: 2, weight: 1.20 }),
  },
  {
    id: 'cape-light', name: 'The Cape-Light', family: 'regional',
    description: 'Southern Africa. The Cape, the Kalahari, the highveld. South Africa and its neighbours, where the continent narrows and the cold ocean turns.',
    test: (ctx) => regionalScore(ctx, REGIONS.capeLight, { minCount: 3, weight: 1.15 }),
  },
  {
    id: 'saffron-road', name: 'The Saffron-Road', family: 'regional',
    description: 'The Indian Ocean rim. India and East Africa, Madagascar and Sri Lanka — the route the monsoon winds sailed two thousand years before Europe found it.',
    test: (ctx) => regionalScore(ctx, REGIONS.saffronRoad, { minCount: 5, weight: 1.05 }),
  },
  {
    id: 'subcontinent-walker', name: 'The Subcontinent-Walker', family: 'regional',
    description: 'South Asia. India, Pakistan, Bangladesh, the Himalayas at the top, the islands below — a billion lives, a thousand languages, one weather system.',
    test: (ctx) => regionalScore(ctx, REGIONS.subcontinentWalker, { minCount: 3, weight: 1.05 }),
  },
  {
    id: 'mekong-walker', name: 'The Mekong-Walker', family: 'regional',
    description: 'Indochina. Vietnam, Laos, Cambodia, Thailand, Myanmar — the long river, the rice terraces, the gold of pagoda roofs, the mountain sickness.',
    test: (ctx) => regionalScore(ctx, REGIONS.mekongWalker, { minCount: 3, weight: 1.10 }),
  },
  {
    id: 'dragon-coast', name: 'The Dragon-Coast', family: 'regional',
    description: 'East and Southeast Asia from the Pacific shore. Japan, Korea, China, Vietnam, the Philippines, Indonesia — the great Asian rim, every emperor’s claim.',
    test: (ctx) => regionalScore(ctx, REGIONS.dragonCoast, { minCount: 5, weight: 1.00 }),
  },
  {
    id: 'trade-winds', name: 'The Trade-Winds', family: 'regional',
    description: 'The Pacific Rim. Three continents looking at the world’s largest ocean — the volcanoes, the typhoons, the long flights, the date line.',
    test: (ctx) => regionalScore(ctx, REGIONS.tradeWinds, {
      minCount: 6, weight: 0.95, requireSpread: requireSpreadPacific,
    }),
  },
  {
    id: 'atlantic-bridge', name: 'The Atlantic-Bridge', family: 'regional',
    description: 'Both shores of the Atlantic. The triangular trade’s geography — Europe, West Africa, the Americas — read from the water as a single map.',
    test: (ctx) => regionalScore(ctx, REGIONS.atlanticBridge, {
      minCount: 6, weight: 0.95, requireSpread: requireSpreadAtlantic,
    }),
  },
  {
    id: 'southern-cross', name: 'The Southern-Cross', family: 'regional',
    description: 'Oceania. Australia, New Zealand, the Pacific microstates — the southern night sky, the coral atolls, the longest distances in the world.',
    test: (ctx) => regionalScore(ctx, REGIONS.southernCross, { minCount: 3, weight: 1.10 }),
  },

  // ============= Family B — Pattern archetypes (8) =============

  {
    id: 'sphere-walker', name: 'The Sphere-Walker', family: 'pattern',
    description: 'Visits in all four hemispheres of Earth — north and south, east and west. The full sphere. The atlas closed at last.',
    test: (ctx) => {
      if (ctx.count < 12) return 0;
      return ctx.hemispheres.size === 4 ? 78 : 0;
    },
  },
  {
    id: 'five-skies', name: 'The Five-Skies', family: 'pattern',
    description: 'Visits in all five climate bands — tropical, subtropical, temperate, subarctic, polar. From the equator to the long winter, every kind of weather.',
    test: (ctx) => {
      if (ctx.count < 15) return 0;
      if (ctx.climates.size === 5) return 82;
      if (ctx.climates.size === 4) return 60;
      return 0;
    },
  },
  {
    id: 'mariner', name: 'The Mariner', family: 'pattern',
    description: 'Coast-leaning. Most of your countries touch the sea — the salt, the ferries, the ports. The atlas as read from the harbour.',
    test: (ctx) => {
      if (ctx.count < 12) return 0;
      const ratio = ctx.coastalCount / ctx.count;
      if (ratio >= 0.85) return 80;
      if (ratio >= 0.75) return 65;
      return 0;
    },
  },
  {
    id: 'inlander', name: 'The Inlander', family: 'pattern',
    description: 'The interior. Landlocked-leaning, drawn away from the ports. The Stans, the Alps, central Africa — the geography of the long view, no horizon of water.',
    test: (ctx) => {
      if (ctx.count < 12) return 0;
      const ratio = ctx.landlockedCount / ctx.count;
      if (ratio >= 0.45) return 78;
      if (ratio >= 0.35) return 62;
      return 0;
    },
  },
  {
    id: 'antipodean', name: 'The Antipodean', family: 'pattern',
    description: 'Two countries on opposite sides of the planet. A pair of points through the centre. Geographic poetry. The atlas at full reach.',
    test: (ctx) => {
      if (ctx.count < 20) return 0;
      return hasAntipodalPair(ctx.visited, COUNTRIES) ? 75 : 0;
    },
  },
  {
    id: 'megapolitan', name: 'The Megapolitan', family: 'pattern',
    description: 'Drawn to the great populations. China, India, the United States — the countries where most of humanity actually lives. The crowded geography.',
    test: (ctx) => {
      const hits = ctx.visited.filter(c => TOP_POPULOUS.has(c)).length;
      if (hits >= 6) return 85;
      if (hits >= 4) return 70;
      return 0;
    },
  },
  {
    id: 'equator-hand', name: 'The Equator-Hand', family: 'pattern',
    description: 'The equatorial belt. Within fifteen degrees of the equator — the rainforest band where the seasons mean rain or no rain, where day equals night.',
    test: (ctx) => regionalScore(ctx, REGIONS.equatorialReach, { minCount: 5, weight: 1.00 }),
  },
  {
    id: 'aurora-bound', name: 'The Aurora-Bound', family: 'pattern',
    description: 'The high latitudes. Iceland, the Nordics, Russia’s north, the Canadian Arctic — aurora country, the long winter, the midnight sun.',
    test: (ctx) => regionalScore(ctx, REGIONS.polarReach, { minCount: 4, weight: 1.10 }),
  },

  // ============= Family C — Tier (4 — Cosmographer is short-circuited) =============

  {
    id: 'universalist', name: 'The Universalist', family: 'tier',
    description: 'Within ten countries of the full set. The atlas almost finished — the last few are the hardest, the politics of the impossible passport.',
    test: (ctx) =>
      tierScore(ctx.count, c => c >= 185 && c < 195 ? 92 + (c - 185) : 0, 0.95),
  },
  {
    id: 'completist', name: 'The Completist', family: 'tier',
    description: 'A hundred and fifty countries and counting. The serious work — most of the world walked, most of the visas earned, most of the maps known by hand.',
    test: (ctx) =>
      tierScore(ctx.count, c => c >= 150 ? 75 + (c - 150) * 0.4 : 0, 0.90, 88),
  },
  {
    id: 'globetrotter', name: 'The Globetrotter', family: 'tier',
    description: 'Seventy-five countries on the wall. A long-distance traveller — quantity acknowledged, the atlas fairly broad, the airline statuses unbothered.',
    test: (ctx) =>
      tierScore(ctx.count, c => c >= 75 ? 55 + (c - 75) * 0.2 : 0, 0.85, 70),
  },
  {
    id: 'long-march', name: 'The Long-March', family: 'tier',
    description: 'Forty countries — the threshold where the atlas starts to feel global. Past tourism, into geography. The long walk has properly begun.',
    test: (ctx) =>
      tierScore(ctx.count, c => c >= 40 ? 45 + (c - 40) * 0.3 : 0, 0.75, 60),
  },
];

// Cosmographer is special — it short-circuits the entire scoring loop when
// count >= 195 so it cannot lose to a 100% regional title on tie-break.
export const COSMOGRAPHER = {
  id: 'cosmographer', name: 'The Cosmographer', family: 'tier',
  description: 'All 195 sovereign states of Earth. There are perhaps a thousand people on the planet who have done this. The atlas complete.',
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

  // Specificity beats generality: when a nested *specific* title scores
  // meaningfully (≥ 60 — corresponds to roughly the 55%-density mark), its
  // *general* parent is suppressed from the primary slot. Without this, a
  // user with 6/11 Med visits + 5 other Old-World stops would score 68 on
  // Olive-Branch but 87 on Old-Empire and be misnamed Old-Empire — the
  // exact "broad title swallows specific lean" failure mode the audit
  // flagged. Threshold of 60 is intentional: at OB score 32 (barely above
  // the floor), the user really is mostly Old-Empire; we only suppress
  // when the specific lean is clearly present.
  const SPECIFIC_OVERRIDE_THRESHOLD = 60;
  const suppressedGenerals = new Set();
  for (const s of scored) {
    if (s.score < SPECIFIC_OVERRIDE_THRESHOLD) continue;
    const generals = NESTED[s.title.id] || [];
    for (const gen of generals) suppressedGenerals.add(gen);
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
      description: 'A small atlas, focused close. Five to nine countries, all in one continent — a region you’ve started to know well, the first chapter of something.',
      family: 'fallback',
    };
  }
  if (ctx.count < 20) {
    return {
      id: 'traveller', name: 'The Traveller',
      description: 'A modest atlas, no settled pattern yet. The middle distance — past the first trips, before the first lean. Whatever shape this becomes, it’s still becoming.',
      family: 'fallback',
    };
  }
  // 20+ but nothing scored ≥ 30 — genuinely scattered. Earned Wanderer.
  if (ctx.continents.size >= 4) {
    return {
      id: 'wanderer', name: 'The Wanderer',
      description: 'Breadth without concentration — visits scattered across the world, no single region dominant. The atlas of the curious, four continents at least.',
      family: 'fallback',
    };
  }
  // 20+ but fewer than 4 continents — still Traveller.
  return {
    id: 'traveller', name: 'The Traveller',
    description: 'A modest atlas, no settled pattern yet. The middle distance — past the first trips, before the first lean. Whatever shape this becomes, it’s still becoming.',
    family: 'fallback',
  };
}
