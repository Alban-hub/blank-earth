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
// hemispheres marked".
registerArt('hemi-quad', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><path d="M32 10 L32 54"/><path d="M10 32 L54 32"/><circle cx="42" cy="22" r="2.4" fill="${ink}" stroke="none"/><circle cx="42" cy="42" r="2.4" fill="${ink}" stroke="none"/><circle cx="22" cy="42" r="2.4" fill="${ink}" stroke="none"/><circle cx="22" cy="22" r="2.4" fill="${ink}" stroke="none"/></svg>`
);

// archipelago — three small islands of varying sizes with subtle wave lines
// below. Used by the Islander line (replaces the Maritime line which felt
// arbitrary). Reads as "scattered land in water" at any size.
registerArt('archipelago', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 32 C12 26 18 26 22 32 Z" fill="${ink}" stroke="${ink}"/><path d="M26 30 C30 22 38 22 42 30 Z" fill="${ink}" stroke="${ink}"/><path d="M44 34 C46 28 52 28 54 34 Z" fill="${ink}" stroke="${ink}"/><path d="M8 42 C16 40 24 44 32 42 C40 40 48 44 56 42" opacity="0.55"/><path d="M8 50 C16 48 24 52 32 50 C40 48 48 52 56 50" opacity="0.35"/></svg>`
);
