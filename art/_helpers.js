// Shared sub-renderers used by multiple icons. Kept out of icons/ because
// they're not standalone art — they're building blocks the continent and
// hemisphere icons compose from.

// Continent silhouette inside a dashed-circle world frame.
// Used by all six cont-XX icons; each passes its own SVG path.
export function contBadge(ink, d) {
  return `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.4" stroke-linejoin="round"><circle cx="32" cy="32" r="24" stroke-dasharray="2 3"/><path d="${d}" fill="${ink}" stroke="${ink}" stroke-width="1.2" opacity="0.9"/></svg>`;
}

// Half-globe with one hemisphere filled in. `where` is one of:
//   'top'    → northern hemisphere filled
//   'bottom' → southern
//   'left'   → western
//   'right'  → eastern
export function hemiBadge(ink, where) {
  const half = {
    top:    `<path d="M10 32 A22 22 0 0 1 54 32 Z" fill="${ink}" stroke="${ink}"/>`,
    bottom: `<path d="M10 32 A22 22 0 0 0 54 32 Z" fill="${ink}" stroke="${ink}"/>`,
    left:   `<path d="M32 10 A22 22 0 0 0 32 54 Z" fill="${ink}" stroke="${ink}"/>`,
    right:  `<path d="M32 10 A22 22 0 0 1 32 54 Z" fill="${ink}" stroke="${ink}"/>`,
  }[where];
  return `<svg viewBox="0 0 64 64" fill="none" stroke="${ink}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"><circle cx="32" cy="32" r="22"/>${half}<ellipse cx="32" cy="32" rx="22" ry="8" fill="none"/></svg>`;
}
