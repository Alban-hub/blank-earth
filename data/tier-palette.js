// Tier inks — the four colours an icon "gilds" through as the user advances
// a Line. Index 0 is "not yet earned"; 1-4 are bronze → silver → gold → indigo.
//
// Picked to read clearly against the warm paper background while still
// feeling like a progression — bronze is warmest, indigo deepest. Used by
// data/lines.js (badge ink) and the line-card "TIER" pill (background).
export const TIER_INKS = {
  0: '#9893a0',   // not yet earned — matches the locked-badge grey already in use
  1: '#A06B3F',   // bronze   (Tier I)
  2: '#7E8A93',   // silver   (Tier II)
  3: '#B58B33',   // gold     (Tier III)
  4: '#3C3F75',   // indigo   (Tier IV — the "master" tier)
};

// Translucent tints used as the small "TIER N" pill background on line cards.
// Same hue as the ink at low alpha so the pill reads like a stamp on paper.
export const TIER_TINTS = {
  0: 'transparent',
  1: 'rgba(160,107,63,0.12)',
  2: 'rgba(126,138,147,0.14)',
  3: 'rgba(181,139,51,0.14)',
  4: 'rgba(60,63,117,0.12)',
};

// Roman numerals for the tier label. Kept as a tiny lookup so render code
// doesn't have to do conversion math, and so the typography reads as a stamp.
export const TIER_NUMERAL = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' };
