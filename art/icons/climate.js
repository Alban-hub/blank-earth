// Climate-band icons — used by the 5 climate-zone badges and by the climate
// strip in the stats sheet. One icon per zone, plus tropical-sun (a simpler
// filled-sun variant used in the climate strip itself).
import { registerArt } from '../_registry.js';

registerArt('palm-circle', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22" stroke-dasharray="2 3"/><path d="M32 50 C30 42 30 34 32 24"/><path d="M32 24 C24 22 18 24 14 28"/><path d="M32 24 C40 22 46 24 50 28"/><path d="M32 24 C30 18 32 12 36 10"/><circle cx="30" cy="26" r="1.5" fill="${ink}" stroke="none"/><circle cx="34" cy="26" r="1.5" fill="${ink}" stroke="none"/></svg>`
);

// Tropical sun — clean filled sun with 8 short rays. Used in the climate strip
// (above the badge wall) as the universal symbol for tropical heat. Heavier
// stroke than other icons (2.2 vs 1.6) so it reads at the smaller climate-strip size.
registerArt('tropical-sun', (ink) => {
  const rays = Array.from({ length: 8 }).map((_, i) => {
    const a = i * Math.PI / 4;
    const x1 = 32 + Math.cos(a) * 15, y1 = 32 + Math.sin(a) * 15;
    const x2 = 32 + Math.cos(a) * 23, y2 = 32 + Math.sin(a) * 23;
    return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}"/>`;
  }).join('');
  return `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"><circle cx="32" cy="32" r="9" fill="${ink}" stroke="none"/>${rays}</svg>`;
});

registerArt('cactus-sun', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="44" cy="20" r="6"/><path d="M40 14 L36 10 M48 14 L52 10 M50 20 L56 20 M46 27 L48 32" stroke-width="1.2"/><path d="M28 50 L28 26 C28 22 32 22 32 26 L32 50 Z"/><path d="M20 36 C20 32 24 32 24 36 L24 44 L28 44"/><path d="M40 32 C40 28 36 28 36 32 L36 38 L32 38"/><path d="M22 50 L38 50" stroke-dasharray="2 2"/></svg>`
);

registerArt('leaf-quad', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22" stroke-dasharray="2 3"/><path d="M32 32 L32 14 M32 14 C30 16 30 18 32 20"/><path d="M32 32 L48 32 C46 34 44 34 42 32"/><path d="M32 32 C36 36 38 42 36 50 C32 46 30 38 32 32" fill="${ink}" stroke="none"/><path d="M32 32 L16 30 C18 30 20 28 22 28 L18 26"/><circle cx="32" cy="32" r="2" fill="${ink}" stroke="none"/></svg>`
);

registerArt('pine-row', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 50 L20 30 L24 50 Z"/><path d="M28 50 L34 18 L40 50 Z"/><path d="M44 50 L48 36 L52 50 Z"/><path d="M10 50 L54 50"/><text x="34" y="14" text-anchor="middle" font-size="8" font-family="serif" font-weight="600" fill="${ink}" stroke="none">★</text></svg>`
);

registerArt('iceberg', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 36 L22 14 L30 24 L38 12 L48 22 L52 36 Z" fill="${ink}" stroke="${ink}" opacity="0.85"/><path d="M10 36 L54 36" stroke-dasharray="2 2"/><path d="M18 40 L24 50 L30 42 L36 52 L44 40" opacity="0.55"/><path d="M14 16 L18 18 M16 14 L18 18" stroke-width="1.2"/></svg>`
);
