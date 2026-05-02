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
export const TIER_INKS = {
  0: '#9893a0',     // locked — same neutral grey as locked badges
  1: '#B5662B',     // bronze
  2: '#5E6E7A',     // silver
  3: '#D6A032',     // gold
  4: '#2D3275',     // indigo
  max: '#1A1F45',   // master — very deep navy, almost ink-black
};

// Card background tints — soft hue washes layered on the paper colour.
export const TIER_TINTS = {
  0: 'transparent',
  1: 'rgba(181,102,43,0.20)',
  2: 'rgba(94,110,122,0.22)',
  3: 'rgba(214,160,50,0.22)',
  4: 'rgba(45,50,117,0.20)',
  max: 'rgba(214,160,50,0.18)',  // gold wash — distinguishes "Master" from Tier IV
};

// Pill background. Master gets a dark stamp on a gold-washed card; the
// regular tiers use their own hue at heavier saturation.
export const TIER_PILLS = {
  0: 'rgba(0,0,0,0.06)',
  1: 'rgba(181,102,43,0.45)',
  2: 'rgba(94,110,122,0.40)',
  3: 'rgba(214,160,50,0.45)',
  4: 'rgba(45,50,117,0.40)',
  max: '#1A1F45',                // solid dark navy — reads as a wax seal
};

// Border colour for the card. Master gets a SOLID gold edge; tiers 1-4 get
// their own hue at low alpha.
export const TIER_BORDERS = {
  0: 'transparent',
  1: 'rgba(181,102,43,0.55)',
  2: 'rgba(94,110,122,0.50)',
  3: 'rgba(214,160,50,0.55)',
  4: 'rgba(45,50,117,0.50)',
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
