// DEPRECATED — this file has moved to /art/tier-palette.js.
// It's a visual-styling concern (hex colours, alpha values, roman numerals),
// not user data, so it belongs alongside the SVG renderers in /art/.
//
// This shim re-exports from the new location so anything still importing
// the old path keeps working. After the next deploy settles, delete this
// file manually:
//
//     rm data/tier-palette.js
//
// — and your `data/` directory will be back to "purely user-collectable
// truth-table data" (countries, badges, lines, topology, elevations).
export * from '../art/tier-palette.js';
