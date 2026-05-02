// Coastline icons — used by the 3 coastal-country badges (5/15/30 coastal).
// Tonally: a single wave for the first tier, layered waves for more,
// and a stylised coastline map for the final.
import { registerArt } from '../_registry.js';

registerArt('wave-single', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 36 C20 28 28 44 32 36 C36 28 44 44 56 36"/><circle cx="50" cy="20" r="4" fill="${ink}" stroke="none"/><path d="M8 48 L56 48" stroke-dasharray="2 3" opacity="0.5"/></svg>`
);

registerArt('wave-trio', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 26 C20 18 28 34 32 26 C36 18 44 34 56 26"/><path d="M8 36 C18 30 26 42 32 36 C38 30 46 42 56 36"/><path d="M8 46 C16 42 24 50 32 46 C40 42 48 50 56 46"/><path d="M30 22 L34 22 L32 16 Z" fill="${ink}" stroke="${ink}"/><path d="M32 22 L32 26"/></svg>`
);

registerArt('coast-map', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="14" width="44" height="36" rx="2" stroke-dasharray="2 3"/><path d="M14 32 L18 28 L22 34 L26 30 L30 36 L34 30 L38 34 L42 28 L46 36 L50 30"/><circle cx="20" cy="40" r="1.5" fill="${ink}" stroke="none"/><circle cx="32" cy="42" r="1.5" fill="${ink}" stroke="none"/><circle cx="44" cy="40" r="1.5" fill="${ink}" stroke="none"/></svg>`
);
