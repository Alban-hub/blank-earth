// Tiny registry that lets each icon file declare its own renderer.
//
// Why a registry instead of a switch?
//   * Adding/changing an icon = editing one focused file, not a 60-case switch.
//   * A future designer can swap an SVG without touching app code.
//   * The v2 redesign needs many more art assets (lines × tier inks, set hero
//     pieces, trophy frames, hidden silhouettes); a registry scales.
//
// Pattern:
//   icon files call registerArt('compass', ink => `<svg ...>...</svg>`)
//   stats.html calls renderArt('compass', '#1c1838')
//
// The renderer takes the ink colour as its single argument. Future tier work
// can pass a richer object (e.g. {ink, tier, palette}) — bump the renderer
// signature when you do, all icons share it.

const _registry = Object.create(null);

export function registerArt(name, renderer) {
  if (typeof renderer !== 'function') {
    console.warn('[art] registerArt: not a function for', name);
    return;
  }
  if (_registry[name]) {
    // Re-registration is suspicious — typically a copy/paste typo. Warn loudly
    // but allow the override so live-editing still works.
    console.warn('[art] registerArt: overriding existing', name);
  }
  _registry[name] = renderer;
}

export function renderArt(name, ink) {
  const fn = _registry[name];
  if (!fn) {
    console.warn('[art] renderArt: missing renderer for', name);
    return '';
  }
  return fn(ink);
}

// Test/debug helper — handy from the browser console.
export function listArt() {
  return Object.keys(_registry).sort();
}
