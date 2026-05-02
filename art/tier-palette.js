// Tier inks — the four colours an icon "gilds" through as the user advances
// a Line. Index 0 is "not yet earned"; 1-4 are bronze → silver → gold → indigo.
//
// Iteration 2: the v1 inks were too muted to read distinctly at icon size.
// Bumped saturation and contrast so each tier feels visibly different at a
// glance. Bronze is warm-orange-brown (clearly distinct from gold).
// Silver is cool blue-grey (clearly distinct from neutrals). Gold is bright
// amber-yellow (clearly distinct from bronze). Indigo is deep purple-blue.
export const TIER_INKS = {
  0: '#9893a0',   // locked — same neutral grey as locked badges
  1: '#B5662B',   // bronze   (warm orange-brown)
  2: '#5E6E7A',   // silver   (cool blue-grey, deeper than before)
  3: '#D6A032',   // gold     (saturated amber-yellow)
  4: '#2D3275',   // indigo   (deep purple-blue)
};

// Card background tints — soft hue washes layered on the paper colour.
// Bumped from ~12% to ~22% so earned cards read clearly different from
// locked ones at a glance.
export const TIER_TINTS = {
  0: 'transparent',
  1: 'rgba(181,102,43,0.20)',
  2: 'rgba(94,110,122,0.22)',
  3: 'rgba(214,160,50,0.22)',
  4: 'rgba(45,50,117,0.20)',
};

// Pill background — heavier saturation than the card tint so the "TIER N"
// stamp reads like a coloured wax seal on a paler card.
export const TIER_PILLS = {
  0: 'rgba(0,0,0,0.06)',
  1: 'rgba(181,102,43,0.45)',
  2: 'rgba(94,110,122,0.40)',
  3: 'rgba(214,160,50,0.45)',
  4: 'rgba(45,50,117,0.40)',
};

// Border colour for the card — same hue as the ink at low alpha. Ties the
// card edge to its tier without shouting.
export const TIER_BORDERS = {
  0: 'transparent',
  1: 'rgba(181,102,43,0.55)',
  2: 'rgba(94,110,122,0.50)',
  3: 'rgba(214,160,50,0.55)',
  4: 'rgba(45,50,117,0.50)',
};

// Roman numerals for the tier label. Kept as a tiny lookup so render code
// doesn't have to do conversion math, and so the typography reads as a stamp.
export const TIER_NUMERAL = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };
