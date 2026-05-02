# Plug-ins

The globe exposes a tiny, stable API that lets you bolt features on without touching `index.html`. A plug-in is a single JavaScript file that calls `NiceEarth.registerPlugin({...})`.

## Activating a plug-in

1. Drop your `.js` file into this folder.
2. Add its filename to `plugins/manifest.json`:

   ```json
   { "plugins": ["example.js", "my-plugin.js"] }
   ```

3. Reload the page. Plug-ins are loaded in the order listed.

If `manifest.json` is missing, no plug-ins are loaded — the engine just runs as-is.

## Writing a plug-in

The shortest valid plug-in:

```js
NiceEarth.registerPlugin({
  name: 'my-plugin',
  init(api) {
    api.on('country.visit', ({ feature }) => {
      console.log('visited', feature.name);
    });
  },
});
```

`init(api)` is called once, after the globe is ready. The `api` object is frozen — what you see is what you get.

## Events

The engine emits these via `api.on(name, fn)`:

| Event | Payload | When |
|---|---|---|
| `globe.ready` | `{ api }` | Once, after first render |
| `country.visit` | `{ feature, isFirstVisit }` | A country is marked visited |
| `country.unvisit` | `{ feature }` | A country is un-marked |
| `country.hover` | `{ feature \| null }` | Hover state changed (mouse only); fires on transitions, not every move |
| `country.click` | `{ feature }` | Tap or click on a country, before visit/unvisit |
| `storage.error` | `{ kind, error }` | localStorage write failed (`kind` is `quota` or `unknown`) |

`feature` is the country object: `{ id, name, type, arcs }`. `id` is the ISO-A3 code (e.g. `JPN`).

## API surface

`api` is what `init(api)` receives. It's frozen — no monkey-patching.

```ts
{
  // Three.js + style config
  THREE,                      // the Three.js namespace, version r128
  STYLE,                      // the live STYLE config object (read but don't mutate at runtime)

  // Event subscription
  on(name, fn) -> unsubscribe(),
  off(name, fn),

  // Read-only state
  getVisited()        -> Set<string>     // copy; mutating it does nothing
  isVisited(id)       -> boolean
  getFeatureById(id)  -> feature | null
  getFeatureByName(n) -> feature | null  // case-insensitive
  getCountryCenter(id) -> [lon, lat] | null

  // Geometry helpers
  lonLatToVec3(lon, lat, r) -> THREE.Vector3
  radiusAt(lon, lat, baseR) -> number    // includes terrain displacement
  getRadius()  -> number                  // R = 100, the globe's base radius
  getSurface() -> number                  // SURFACE = 0.06, the country-tile lift

  // Scene access
  pluginGroup,                // a THREE.Group attached to globe; add your meshes here
  requestRender(),            // kicks the idle-skip loop so plug-in animations show

  // UI helpers
  showToast(message, ms?),    // non-blocking message at the bottom of the screen
}
```

## Patterns

### Registering before the engine is ready

You can call `NiceEarth.registerPlugin({...})` at any time. If the engine isn't ready yet, your plug-in is queued and run when it is. The plug-in loader does this for you.

### Adding 3D models per country

```js
NiceEarth.registerPlugin({
  name: 'monuments',
  init(api) {
    const loader = new api.THREE.GLTFLoader(); // requires a GLTFLoader script tag
    api.on('country.visit', async ({ feature }) => {
      const file = MONUMENTS[feature.id]; if (!file) return;
      const gltf = await loader.loadAsync(`./monuments/${file}`);
      const c = api.getCountryCenter(feature.id); if (!c) return;
      const pos = api.lonLatToVec3(c[0], c[1], api.getRadius() + api.getSurface() + 4);
      gltf.scene.position.copy(pos);
      gltf.scene.lookAt(0, 0, 0);
      gltf.scene.rotateX(-Math.PI / 2);
      api.pluginGroup.add(gltf.scene);
    });
  },
});
```

> Note: r128 doesn't ship `GLTFLoader` in the core bundle. If you want one, add a separate `<script>` for it (or include it in your plug-in file) before this plug-in loads.

### Adding a side panel on click

```js
NiceEarth.registerPlugin({
  name: 'stories',
  init(api) {
    const panel = document.createElement('aside');
    panel.id = 'stories-panel';
    panel.hidden = true;
    document.body.appendChild(panel);
    api.on('country.click', async ({ feature }) => {
      try {
        const md = await fetch(`./stories/${feature.id}.md`).then(r => r.ok ? r.text() : null);
        if (!md) { panel.hidden = true; return; }
        panel.innerHTML = `<h2>${feature.name}</h2><pre>${md}</pre>`;
        panel.hidden = false;
      } catch { /* no story for this country */ }
    });
  },
});
```

## Conventions

- **Don't mutate `STYLE`** at runtime. It's the engine's source of truth for visuals; downstream code reads it during geometry rebuilds. If you need to theme, ship your own theme plug-in that swaps materials directly via `api.THREE.Mesh.material = ...`.
- **Add scene objects to `api.pluginGroup`**, not to `scene` or `globe`. That keeps plug-ins isolated from the engine.
- **Clean up on unvisit.** If you added a 3D model on `country.visit`, remove it on `country.unvisit`.
- **Errors in your `init()` are caught** by the engine and logged — they won't crash the globe — but please don't lean on that.
