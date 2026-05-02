// Hero artworks for the 12 launch Sets. Same drawing tone as the other
// icons: 64×64 viewBox, single ink, ~1.6px stroke, evocative-not-literal.
// One file per concept would be overkill; the 12 sit together since they
// share a tone and any styling change happens once.
//
// To add a new set's artwork: append a registerArt() block below. The art
// key must match the `art` field in data/sets.js.
import { registerArt } from '../_registry.js';

// ── Trade & exchange ──────────────────────────────────────────────────

// caravan — camel silhouette in profile under a long horizon line.
registerArt('caravan', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 48 L58 48" opacity="0.7"/><path d="M16 48 C16 42 18 38 22 38 C24 38 24 36 26 34 C28 32 30 32 32 34 L34 32 C36 32 38 32 38 36 L40 36 C44 36 46 40 46 44 L46 48" fill="${ink}" stroke="${ink}"/><path d="M22 36 L24 32 M40 34 L42 30" stroke-width="1.2"/><circle cx="50" cy="14" r="2.5" fill="${ink}" stroke="none"/><path d="M14 22 L18 20 M48 24 L52 22" opacity="0.5" stroke-width="1.2"/></svg>`
);

// spice-sprig — a stylised peppercorn-and-leaf cluster.
registerArt('spice-sprig', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M32 12 L32 50"/><path d="M32 22 C26 20 22 24 22 28 C22 26 26 26 32 28 Z" fill="${ink}" stroke="${ink}"/><path d="M32 28 C38 26 42 30 42 34 C42 32 38 32 32 34 Z" fill="${ink}" stroke="${ink}"/><path d="M32 36 C26 34 22 38 22 42 C22 40 26 40 32 42 Z" fill="${ink}" stroke="${ink}"/><circle cx="28" cy="50" r="2" fill="${ink}" stroke="none"/><circle cx="34" cy="52" r="2" fill="${ink}" stroke="none"/><circle cx="32" cy="46" r="1.6" fill="${ink}" stroke="none"/></svg>`
);

// ── Civilisations & empires ──────────────────────────────────────────

// aurora-peaks — three jagged peaks under a soft aurora arc.
registerArt('aurora-peaks', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20 C18 12 30 10 40 14 C50 18 56 16 58 12" opacity="0.8"/><path d="M10 24 C18 18 28 16 40 18 C50 20 54 18 58 16" opacity="0.45"/><path d="M6 48 L18 28 L26 40 L36 24 L46 38 L58 48 Z" fill="${ink}" stroke="${ink}"/><path d="M18 28 L22 32 M36 24 L40 30" stroke-width="1.2" opacity="0.7"/></svg>`
);

// ziggurat — stepped pyramid silhouette with a small flame on top.
registerArt('ziggurat', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 50 L58 50"/><path d="M14 50 L14 42 L50 42 L50 50 Z" fill="${ink}" stroke="${ink}" opacity="0.85"/><path d="M20 42 L20 34 L44 34 L44 42 Z" fill="${ink}" stroke="${ink}" opacity="0.95"/><path d="M26 34 L26 26 L38 26 L38 34 Z" fill="${ink}" stroke="${ink}"/><path d="M32 26 L32 18" stroke-width="1.2"/><path d="M30 18 C30 14 34 14 34 18 C34 16 32 14 32 12" stroke-width="1.2"/></svg>`
);

// ── Microstates & curiosities ────────────────────────────────────────

// microcrowns — five tiny crown silhouettes clustered together.
registerArt('microcrowns', (ink) => {
  // Place 5 small crowns: one centred slightly raised, two flanking, two below.
  const crown = (cx, cy, scale=1) => {
    const w = 8 * scale, h = 6 * scale;
    return `<path d="M${cx - w/2} ${cy + h/2} L${cx - w/2} ${cy - h/2 + 1} L${cx - w/4} ${cy} L${cx} ${cy - h/2} L${cx + w/4} ${cy} L${cx + w/2} ${cy - h/2 + 1} L${cx + w/2} ${cy + h/2} Z" fill="${ink}" stroke="${ink}" stroke-width="1"/>`;
  };
  return `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.4" stroke-linejoin="round">${crown(32, 22, 1.1)}${crown(20, 30, 0.9)}${crown(44, 30, 0.9)}${crown(26, 42, 0.85)}${crown(38, 42, 0.85)}<path d="M10 50 L54 50" opacity="0.5"/></svg>`;
});

// arch-crescent — Moorish horseshoe arch with a crescent moon above.
registerArt('arch-crescent', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 50 L16 28 C16 20 24 14 32 14 C40 14 48 20 48 28 L48 50" fill="none"/><path d="M22 50 L22 32 C22 26 26 22 32 22 C38 22 42 26 42 32 L42 50 Z" fill="${ink}" stroke="${ink}" opacity="0.85"/><path d="M44 8 C40 8 38 12 38 16 C38 20 40 24 44 24 C42 22 41 19 41 16 C41 13 42 10 44 8 Z" fill="${ink}" stroke="${ink}"/><path d="M10 50 L54 50"/></svg>`
);

// yurt-steppe — yurt silhouette on a horizon, with a faint distant mountain.
registerArt('yurt-steppe', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 50 L58 50"/><path d="M40 50 C42 38 50 32 56 38" opacity="0.4"/><path d="M18 50 L18 36 C18 32 24 28 32 28 C40 28 46 32 46 36 L46 50 Z" fill="${ink}" stroke="${ink}" opacity="0.9"/><path d="M18 36 L46 36" stroke="#FCFCFA" stroke-width="1" opacity="0.4"/><path d="M22 28 L32 22 L42 28" stroke-width="1.2"/><circle cx="32" cy="20" r="2" fill="${ink}" stroke="none"/></svg>`
);

// volcano-smoke — volcano cone with a curling plume of smoke.
registerArt('volcano-smoke', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 50 L58 50"/><path d="M14 50 L26 22 L38 22 L50 50 Z" fill="${ink}" stroke="${ink}" opacity="0.9"/><path d="M26 22 L30 28 L34 22 L38 22" stroke="#FCFCFA" stroke-width="1.2"/><path d="M30 18 C28 14 34 12 32 8 C30 4 36 2 36 -2" opacity="0.6" stroke-width="1.4"/><circle cx="34" cy="6" r="1.5" fill="${ink}" stroke="none" opacity="0.7"/><circle cx="30" cy="14" r="1.5" fill="${ink}" stroke="none" opacity="0.5"/></svg>`
);

// island-arc — five small islands curving along a sea line.
registerArt('island-arc', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 48 C18 36 26 32 32 32 C38 32 46 36 58 48" opacity="0.55" stroke-dasharray="2 2"/><path d="M10 36 C12 32 16 32 18 36 Z" fill="${ink}" stroke="${ink}"/><path d="M20 30 C22 26 26 26 28 30 Z" fill="${ink}" stroke="${ink}"/><path d="M30 28 C32 24 36 24 38 28 Z" fill="${ink}" stroke="${ink}"/><path d="M40 30 C42 26 46 26 48 30 Z" fill="${ink}" stroke="${ink}"/><path d="M50 36 C52 32 56 32 58 36 Z" fill="${ink}" stroke="${ink}"/><path d="M6 52 C16 50 24 54 32 52 C40 50 48 54 58 52" opacity="0.4"/></svg>`
);

// prayer-flags — five small flags strung across, with a peak below.
registerArt('prayer-flags', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 18 C24 14 40 14 56 18"/><path d="M14 17 L14 25 L18 21 Z" fill="${ink}" stroke="${ink}"/><path d="M22 16 L22 24 L26 20 Z" fill="${ink}" stroke="${ink}" opacity="0.85"/><path d="M30 16 L30 24 L34 20 Z" fill="${ink}" stroke="${ink}"/><path d="M38 16 L38 24 L42 20 Z" fill="${ink}" stroke="${ink}" opacity="0.85"/><path d="M46 17 L46 25 L50 21 Z" fill="${ink}" stroke="${ink}"/><path d="M8 50 L24 36 L34 46 L42 32 L58 50 Z" fill="${ink}" stroke="${ink}" opacity="0.95"/></svg>`
);

// span-bridge — two land masses joined by an arched bridge over water.
registerArt('span-bridge', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 50 L18 50 L22 44 L24 44" fill="${ink}" stroke="${ink}" opacity="0.85"/><path d="M40 44 L42 44 L46 50 L60 50" fill="${ink}" stroke="${ink}" opacity="0.85"/><path d="M22 44 C26 30 38 30 42 44"/><path d="M22 44 L42 44"/><path d="M26 38 L26 44 M30 35 L30 44 M34 35 L34 44 M38 38 L38 44" stroke-width="1.2" opacity="0.7"/><path d="M4 56 L60 56" opacity="0.4"/></svg>`
);

// olive-wave — olive branch arched above a single wave.
registerArt('olive-wave', (ink) =>
  `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22 C18 18 32 18 56 24" opacity="0.95"/><ellipse cx="14" cy="20" rx="3" ry="1.6" fill="${ink}" stroke="${ink}" transform="rotate(-25 14 20)"/><ellipse cx="22" cy="18" rx="3" ry="1.6" fill="${ink}" stroke="${ink}" transform="rotate(-15 22 18)"/><ellipse cx="32" cy="17" rx="3.4" ry="1.7" fill="${ink}" stroke="${ink}"/><ellipse cx="42" cy="19" rx="3" ry="1.6" fill="${ink}" stroke="${ink}" transform="rotate(15 42 19)"/><ellipse cx="50" cy="22" rx="3" ry="1.6" fill="${ink}" stroke="${ink}" transform="rotate(25 50 22)"/><circle cx="38" cy="14" r="1.4" fill="${ink}" stroke="none"/><circle cx="46" cy="16" r="1.4" fill="${ink}" stroke="none"/><path d="M6 42 C16 36 26 48 32 42 C38 36 48 48 58 42"/><path d="M6 50 C16 46 26 54 32 50 C38 46 48 54 58 50" opacity="0.5"/></svg>`
);
