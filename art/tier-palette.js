// Tier inks — the colours an icon "gilds" through as the user advances a Line.
//
// Index 0  — locked (not yet earned)
// Index 1-4 — bronze, silver, gold, indigo (regular tier progression)
// Index 'max' — applied whenever the user has reached the *final* tier of a
//               line, regardless of whether that line has 3 or 4 tiers. Lines
//               with 3 tiers don't have a Tier IV, so without this their
//               maxed-out card would just look like "Tier III" and feel
//               unfinished. The 'max' style is a unified "Master" treatment:
//               deep navy ink + gold border + dark stamp pill — visually
//               richer than any regular tier.
// Iteration 4: a single coherent progression instead of metals jumping
// warm-to-cool-to-warm. The bronze→steel→gold→indigo metals story was
// breaking the visual hierarchy because steel was cool while bronze and
// gold were warm — the eye read steel as "less than" bronze even at
// matched darkness.
//
// New scheme: a continuous warm-deepening curve that climaxes in gold and
// transcends to indigo at the apex. Each tier is visibly richer than the
// one before, in saturation AND in depth.
//
//   Tier 0 (locked)   — soft neutral grey
//   Tier I            — pale warm copper, welcoming entry
//   Tier II           — deep bronze, substantially earned
//   Tier III          — saturated amber gold, brilliant milestone
//   Tier IV           — deep indigo, regal cap
//   Master            — near-black navy with a solid gold rim
//
// Read top-to-bottom: the warmth deepens through Tiers I-III, then the
// hue shifts to a cool deep indigo for IV, and Master "seals" the line
// with the gold trim. No tier looks faded next to its predecessor.
export const TIER_INKS = {
  0: '#9893a0',     // locked — neutral grey
  1: '#C68554',     // light bronze (warm, welcoming)
  2: '#88491F',     // deep bronze (visibly darker, richer than Tier I)
  3: '#C9941F',     // gold (bright milestone)
  4: '#2D3275',     // indigo (deep, regal)
  max: '#1A1F45',   // master — almost ink-black navy, paired with a gold border
};

// Card background tints — soft hue washes that mirror the ink. Tiers I-III
// use warm earth tones in increasing depth; Tier IV switches to indigo;
// Master uses the gold wash to distinguish itself from indigo.
export const TIER_TINTS = {
  0: 'transparent',
  1: 'rgba(198,133,84,0.18)',    // pale bronze wash
  2: 'rgba(136,73,31,0.20)',     // deep bronze wash
  3: 'rgba(201,148,31,0.22)',    // gold wash
  4: 'rgba(45,50,117,0.20)',     // indigo wash
  max: 'rgba(214,160,50,0.20)',  // brighter gold wash — pairs with the gold rim
};

// Pill background — saturated hue at ~0.50 alpha so the "Tier N · Name"
// stamp reads as a strong wax seal regardless of which tier.
export const TIER_PILLS = {
  0: 'rgba(0,0,0,0.06)',
  1: 'rgba(198,133,84,0.55)',
  2: 'rgba(136,73,31,0.60)',     // deeper bronze pill
  3: 'rgba(201,148,31,0.55)',
  4: 'rgba(45,50,117,0.50)',
  max: '#1A1F45',                // solid dark navy — reads as the final seal
};

// Border colour. Master gets a solid gold edge (laurel rim); regular tiers
// get their own hue at high alpha so the card feels framed.
export const TIER_BORDERS = {
  0: 'transparent',
  1: 'rgba(198,133,84,0.65)',
  2: 'rgba(136,73,31,0.70)',
  3: 'rgba(201,148,31,0.65)',
  4: 'rgba(45,50,117,0.55)',
  max: '#D6A032',                // solid gold rim
};

// Roman numerals for the tier label. Kept as a tiny lookup so render code
// doesn't have to do conversion math, and so the typography reads as a stamp.
export const TIER_NUMERAL = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };

// Convenience helper — given the line + the user's current tier, return the
// palette key to use. This is the single source of truth for "is this card
// maxed out?". Render code shouldn't compute it itself.
export function paletteKeyFor(line, tier) {
  if (tier === 0) return 0;
  if (tier === line.tiers.length) return 'max';
  return tier;
}
