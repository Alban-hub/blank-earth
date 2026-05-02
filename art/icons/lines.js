// Line-specific icons. The 7 lines mostly reuse existing icons:
//   cartographer  → compass     (icons/countries.js)
//   surveyor      → rope        (icons/land.js)
//   demographer   → crowd-5     (icons/population.js)
//   maritime      → wave-trio   (icons/coast.js)
//   climatologist → leaf-quad   (icons/climate.js)
//   continentalist→ world       (icons/countries.js)
//
// The only line that needs a new icon is The Hemispherist — the existing
// `hemi-N`/`hemi-S`/`hemi-E`/`hemi-W` are each a *single* hemisphere; for
// the line, we want one mark that represents "all four hemispheres" as a
// concept (a globe quartered into four shaded slices).
import { registerArt } from '../_registry.js';

// hemi-quad — globe with the equator + meridian dividing it into four
// quadrants, and a small filled dot in each quadrant indicating "all four
// hemispheres marked". The earlier opacity-stacked design read as nothing on
// dim backgrounds; this version uses solid strokes + dots and stays legible
// at small sizes with any tier ink.
registerArt('hemi-quad', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><path d="M32 10 L32 54"/><path d="M10 32 L54 32"/><circle cx="42" cy="22" r="2.4" fill="${ink}" stroke="none"/><circle cx="42" cy="42" r="2.4" fill="${ink}" stroke="none"/><circle cx="22" cy="42" r="2.4" fill="${ink}" stroke="none"/><circle cx="22" cy="22" r="2.4" fill="${ink}" stroke="none"/></svg>`
);
