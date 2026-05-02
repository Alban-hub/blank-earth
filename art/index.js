// Art manifest — single import point. stats.html does:
//   import { renderArt } from './art/index.js';
// and that pulls in the registry + every icon module via the side-effect
// imports below.
//
// Convention in this folder:
//   _registry.js / _helpers.js  → underscore prefix = module-internal,
//                                  not imported from outside /art/
//   index.js                    → public entry point — what stats.html imports
//   icons/                      → one file per icon group; each calls
//                                  registerArt('<name>', ink => '<svg>...</svg>')
//   tier-palette.js             → tier inks/tints/borders/pill colours
//                                  (visual styling for the v2 lines)
//
// To add a new icon:
//   1. Drop the icon's renderer into art/icons/<group>.js (or create a new
//      group file and add it to the import list here).
//   2. The icon is now usable via renderArt('<name>', ink) anywhere.
//
// To swap an existing icon:
//   1. Open art/icons/<group>.js, edit the SVG inside its registerArt(...).
//   2. Save. No other file touched.
//
// The leading underscore on _registry / _helpers means "module-internal" — not
// imported by anyone except other files in /art/.

import './icons/countries.js';
import './icons/land.js';
import './icons/continents.js';
import './icons/hemispheres.js';
import './icons/climate.js';
import './icons/population.js';
import './icons/coast.js';
import './icons/geo.js';
import './icons/lines.js';      // Step 3 — The v2 lines (hemi-quad, archipelago)
import './icons/sets.js';       // Step 4 — The 12 launch sets (hero artworks)

export { renderArt, registerArt, listArt } from './_registry.js';
