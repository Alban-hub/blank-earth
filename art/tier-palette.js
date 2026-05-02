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
// Iteration 3: Tier II silver was reading as faded compared to Tier I
// bronze (the opposite of how progression should feel). Darkened the steel
// from #5E6E7A → #3A4856 so each tier visibly deepens. Bronze stays warm
// and inviting at entry, steel anchors the middle as substantial, gold
// brightens at Tier III, indigo seals at Tier IV, and Master adds the gold
// rim. The rule: no later tier should look LESS earned than an earlier one.
export const TIER_INKS = {
  0: '#9893a0',     // locked — neutral grey
  1: '#B5662B',     // bronze (warm copper-orange)
  2: '#3A4856',     // steel — DARKER than the v2 silver, reads as substantial
  3: '#D6A032',     // gold (saturated amber)
  4: '#2D3275',     // indigo (deep purple-blue)
  max: '#1A1F45',   // master — very deep navy, almost ink-black
};

// Card background tints — soft hue washes layered on the paper colour.
// Tier II tint also bumped to match the darker ink.
export const TIER_TINTS = {
  0: 'transparent',
  1: 'rgba(181,102,43,0.20)',
  2: 'rgba(58,72,86,0.20)',      // bumped from light silver to deeper steel
  3: 'rgba(214,160,50,0.22)',
  4: 'rgba(45,50,117,0.20)',
  max: 'rgba(214,160,50,0.18)',  // gold wash — distinguishes "Master" from Tier IV
};

// Pill background. Saturation bumped across tiers so the stamp reads punchy
// regardless of which hue.
export const TIER_PILLS = {
  0: 'rgba(0,0,0,0.06)',
  1: 'rgba(181,102,43,0.50)',
  2: 'rgba(58,72,86,0.55)',      // darker steel — reads richer at higher alpha
  3: 'rgba(214,160,50,0.50)',
  4: 'rgba(45,50,117,0.45)',
  max: '#1A1F45',                // solid dark navy — reads as a wax seal
};

// Border colour for the card. Master gets a SOLID gold edge; tiers 1-4 get
// their own hue at heavier alpha than before so the card feels framed.
export const TIER_BORDERS = {
  0: 'transparent',
  1: 'rgba(181,102,43,0.60)',
  2: 'rgba(58,72,86,0.65)',      // darker steel border — was light grey
  3: 'rgba(214,160,50,0.60)',
  4: 'rgba(45,50,117,0.55)',
  max: '#D6A032',                // solid gold — laurel-wreath effect
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
