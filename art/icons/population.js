// Population icons — used by the 4 cumulative-population badges (100M, 500M, 1B, 2B).
// Tonally: more crowd density as the population increases, ending in a globe-scale
// view at 2B (a meaningful fraction of all humans alive).
import { registerArt } from '../_registry.js';

registerArt('crowd-3', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 50 A22 22 0 0 1 54 50" stroke-dasharray="2 3"/><circle cx="20" cy="28" r="5"/><path d="M14 44 C14 38 26 38 26 44 L26 50 L14 50 Z"/><circle cx="32" cy="22" r="6"/><path d="M24 42 C24 34 40 34 40 42 L40 50 L24 50 Z"/><circle cx="44" cy="28" r="5"/><path d="M38 44 C38 38 50 38 50 44 L50 50 L38 50 Z"/></svg>`
);

registerArt('crowd-5', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="14" cy="30" r="4"/><path d="M9 44 C9 39 19 39 19 44 L19 50 L9 50 Z"/><circle cx="24" cy="26" r="4.5"/><path d="M19 42 C19 37 29 37 29 42 L29 50 L19 50 Z"/><circle cx="34" cy="22" r="5"/><path d="M28 40 C28 34 40 34 40 40 L40 50 L28 50 Z"/><circle cx="44" cy="26" r="4.5"/><path d="M39 42 C39 37 49 37 49 42 L49 50 L39 50 Z"/><circle cx="54" cy="30" r="4"/><path d="M49 44 C49 39 59 39 59 44 L59 50 L49 50 Z"/></svg>`
);

registerArt('globe-pulse', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="10"/><circle cx="32" cy="32" r="3" fill="${ink}" stroke="none"/><circle cx="32" cy="32" r="16" stroke-dasharray="2 3" opacity="0.7"/><circle cx="32" cy="32" r="22" stroke-dasharray="2 4" opacity="0.4"/></svg>`
);

registerArt('globe-crowd', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="38" r="18"/><ellipse cx="32" cy="38" rx="18" ry="6"/><path d="M32 38 L32 56" opacity="0.4"/><circle cx="22" cy="18" r="2" fill="${ink}" stroke="none"/><circle cx="32" cy="14" r="2" fill="${ink}" stroke="none"/><circle cx="42" cy="18" r="2" fill="${ink}" stroke="none"/><path d="M22 20 L22 22 M32 16 L32 20 M42 20 L42 22"/></svg>`
);
