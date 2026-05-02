// Land-coverage icons — used by the 5 land-percentage badges (1/5/10/25/50%).
// Tonally: progress markers (star, flag), milestones (mountains), tools of
// surveying (rope), arrival (anchor).
import { registerArt } from '../_registry.js';

registerArt('star', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"><path d="M32 10 L38 26 L55 26 L41 36 L46 53 L32 43 L18 53 L23 36 L9 26 L26 26 Z"/></svg>`
);

registerArt('mountains', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 50 L22 22 L34 40 L44 28 L58 50 Z"/><path d="M22 22 L26 30 M44 28 L48 36"/><circle cx="48" cy="14" r="3" fill="${ink}" stroke="none"/></svg>`
);

registerArt('flag', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 8 L20 56"/><path d="M20 12 C30 6 38 18 50 12 L50 28 C38 34 30 22 20 28 Z" fill="${ink}" stroke="${ink}"/><circle cx="20" cy="56" r="2" fill="${ink}" stroke="none"/></svg>`
);

registerArt('rope', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="14"/><circle cx="32" cy="32" r="14" stroke-dasharray="3 3" transform="rotate(15 32 32)"/><path d="M22 22 L42 42 M42 22 L22 42" stroke-width="1.2"/></svg>`
);

registerArt('anchor', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="14" r="3"/><path d="M32 17 L32 50"/><path d="M22 26 L42 26"/><path d="M14 42 C18 52 32 56 32 50 C32 56 46 52 50 42"/></svg>`
);
