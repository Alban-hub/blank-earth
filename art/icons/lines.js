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

// hemi-quad — globe with all four hemispheres distinguished. Vertical
// meridian + equator divide the disc into 4 quadrants, each shaded with a
// progressively lighter opacity to read as "four halves" rather than four
// separate marks.
registerArt('hemi-quad', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="32" cy="32" r="22"/>
    <path d="M32 10 L32 54" stroke-width="1.2"/>
    <path d="M10 32 L54 32" stroke-width="1.2"/>
    <path d="M32 32 L32 10 A22 22 0 0 1 54 32 Z" fill="${ink}" stroke="none" opacity="0.85"/>
    <path d="M32 32 L54 32 A22 22 0 0 1 32 54 Z" fill="${ink}" stroke="none" opacity="0.55"/>
    <path d="M32 32 L32 54 A22 22 0 0 1 10 32 Z" fill="${ink}" stroke="none" opacity="0.30"/>
    <path d="M32 32 L10 32 A22 22 0 0 1 32 10 Z" fill="${ink}" stroke="none" opacity="0.12"/>
  </svg>`
);
