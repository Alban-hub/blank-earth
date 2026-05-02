// Geographic-region icons — used by the 5 "geo" badges (equator, arctic,
// himalaya, andes, sahara). These are the icons most likely to migrate into
// v2 Sets (e.g. Polar Crown, Saharan Maghreb), so when that migration happens
// each can move into its set's hero artwork file individually.
import { registerArt } from '../_registry.js';

registerArt('equator-line', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><path d="M10 32 L54 32" stroke-width="2"/><path d="M52 30 L54 32 L52 34 Z" fill="${ink}" stroke="${ink}"/><path d="M12 30 L10 32 L12 34 Z" fill="${ink}" stroke="${ink}"/><ellipse cx="32" cy="32" rx="22" ry="8" stroke-dasharray="2 3" opacity="0.5"/></svg>`
);

registerArt('aurora', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 50 L54 50"/><path d="M16 50 C16 36 18 30 16 18" opacity="0.85"/><path d="M28 50 C28 32 32 24 28 14" opacity="0.85"/><path d="M42 50 C42 38 44 32 42 22" opacity="0.85"/><text x="50" y="20" text-anchor="middle" font-size="10" font-family="serif" font-weight="600" fill="${ink}" stroke="none">★</text></svg>`
);

registerArt('peaks-three', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 50 L22 22 L36 50 Z"/><path d="M28 50 L40 14 L52 50 Z"/><path d="M44 50 L52 30 L60 50 Z"/><path d="M40 14 L44 14 L44 20"/><path d="M40 14 L40 20"/><path d="M8 50 L60 50"/></svg>`
);

registerArt('ridge-line', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 50 L14 38 L20 44 L26 32 L32 40 L38 28 L46 36 L52 30 L58 42"/><path d="M22 22 L28 18 L34 22 M28 18 L28 14"/></svg>`
);

registerArt('dunes-sun', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="44" cy="22" r="9"/><path d="M8 50 C18 36 28 36 36 44 C42 50 50 50 56 46"/><path d="M8 42 C16 32 24 32 32 38 C38 42 46 42 56 38" opacity="0.7"/><path d="M8 34 C14 28 20 28 28 32" opacity="0.5"/><path d="M8 50 L58 50"/></svg>`
);
