// Country-milestone icons — used by the 7 country-count badges (5/10/25/50/75/100/195).
// Tonally: tools of cartography (compass, sextant), milestones (wreath, sun),
// completion (world), starts and quarters (footprint-pair, quarter-arc).
import { registerArt } from '../_registry.js';

registerArt('compass', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="16" stroke-dasharray="2 3"/><path d="M32 14 L36 32 L32 50 L28 32 Z" fill="${ink}" stroke="none"/><circle cx="32" cy="32" r="2" fill="${ink}" stroke="none"/></svg>`
);

registerArt('sextant', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 50 L54 50 A22 22 0 0 0 10 50 Z"/><path d="M22 50 L40 22"/><circle cx="22" cy="50" r="2.5" fill="${ink}" stroke="none"/><path d="M14 50 A18 18 0 0 1 50 50" stroke-dasharray="2 2"/></svg>`
);

registerArt('wreath', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 14 C12 22 12 42 22 50"/><path d="M42 14 C52 22 52 42 42 50"/><path d="M18 22 L24 26 M16 32 L23 32 M18 42 L24 38"/><path d="M46 22 L40 26 M48 32 L41 32 M46 42 L40 38"/><text x="32" y="38" text-anchor="middle" font-size="14" font-family="serif" fill="${ink}" stroke="none" font-weight="600">★</text></svg>`
);

// Sun: filled disc with 8 dashed-out rays. Generated procedurally so the rays
// are perfectly evenly spaced — easier to tweak than 8 hand-placed paths.
registerArt('sun', (ink) => {
  const rays = Array.from({ length: 8 }).map((_, i) => {
    const a = i * Math.PI / 4;
    const x1 = 32 + Math.cos(a) * 16, y1 = 32 + Math.sin(a) * 16;
    const x2 = 32 + Math.cos(a) * 22, y2 = 32 + Math.sin(a) * 22;
    return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}"/>`;
  }).join('');
  return `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="11"/>${rays}</svg>`;
});

registerArt('world', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><ellipse cx="32" cy="32" rx="22" ry="9"/><ellipse cx="32" cy="32" rx="9" ry="22"/><path d="M14 24 L50 24 M14 40 L50 40"/></svg>`
);

registerArt('footprint-pair', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 38 C22 30 28 24 30 30 C32 36 28 44 24 44 C22 44 22 42 22 38 Z" fill="${ink}" stroke="${ink}"/><circle cx="20" cy="22" r="1.5" fill="${ink}" stroke="none"/><circle cx="24" cy="20" r="1.5" fill="${ink}" stroke="none"/><circle cx="28" cy="22" r="1.5" fill="${ink}" stroke="none"/><path d="M40 50 C40 42 46 36 48 42 C50 48 46 56 42 56 C40 56 40 54 40 50 Z" fill="${ink}" stroke="${ink}"/><circle cx="38" cy="34" r="1.5" fill="${ink}" stroke="none"/><circle cx="42" cy="32" r="1.5" fill="${ink}" stroke="none"/><circle cx="46" cy="34" r="1.5" fill="${ink}" stroke="none"/></svg>`
);

registerArt('quarter-arc', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><path d="M32 32 L32 10 A22 22 0 0 0 10 32 L32 32 Z" fill="${ink}" stroke="${ink}"/><path d="M32 32 L54 32 A22 22 0 0 1 32 54 L32 32 Z" fill="${ink}" stroke="${ink}"/></svg>`
);
