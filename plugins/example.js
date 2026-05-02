// =============================================================================
//  Example plug-in — logs every globe event to the console.
// =============================================================================
//  Drop this filename into plugins/manifest.json under "plugins" to enable it:
//
//    { "plugins": ["example.js"] }
//
//  Then reload the page and open DevTools.
//
//  This file is intentionally simple so you can use it as a template. The full
//  plug-in API lives in /plugins/README.md.
// =============================================================================

NiceEarth.registerPlugin({
  name: 'example',

  init(api) {
    // `api` is the read-only surface the engine hands to every plug-in.
    // See /plugins/README.md for the full list.
    console.log('[example plug-in] initialised. Visited so far:', [...api.getVisited()]);

    api.on('globe.ready', () => {
      console.log('[example plug-in] globe.ready');
    });

    api.on('country.visit', ({ feature, isFirstVisit }) => {
      console.log('[example plug-in] visit:', feature.name, '(first?', isFirstVisit, ')');
    });

    api.on('country.unvisit', ({ feature }) => {
      console.log('[example plug-in] unvisit:', feature.name);
    });

    api.on('country.hover', ({ feature }) => {
      // Fires only on hover-state transitions (entered or left a country),
      // not on every mousemove — see the engine's _runHover for details.
      if (feature) console.log('[example plug-in] hovering', feature.name);
    });

    api.on('country.click', ({ feature }) => {
      // Fires on tap/click *before* visit/unvisit. Useful if you want to do
      // something else with the click (open a side panel, play a sound, ...).
      console.log('[example plug-in] clicked:', feature.name);
    });

    api.on('storage.error', ({ kind }) => {
      console.warn('[example plug-in] storage error:', kind);
    });
  },
});
