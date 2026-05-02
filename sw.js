// =============================================================================
//  A blank earth — service worker
// =============================================================================
//  Strategy:
//    - Precache the app shell (HTML, CSS-inline-in-HTML, manifest, three.js
//      vendor bundle, data files, plug-in manifest) so the app boots offline.
//    - Cache-first for static assets; stale-while-revalidate for data files
//      so swapping data/world.topojson takes effect on next reload without a
//      hard refresh.
//    - Bump CACHE_VERSION when shipping a release to invalidate old caches.
// =============================================================================

const CACHE_VERSION = 'blank-earth-v1';
const PRECACHE = [
  './',
  './index.html',
  './stats.html',
  './manifest.webmanifest',
  './vendor/three-r128.min.js',
  './data/world.topojson',
  './data/elevations.json',
  './plugins/manifest.json',
  './icons/globe.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE).catch(err => {
        // Don't fail install if some optional asset is missing (e.g. plug-ins manifest).
        console.warn('[sw] precache partial:', err);
      }))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Only handle same-origin requests; let cross-origin pass through to the network.
  if (url.origin !== self.location.origin) return;

  // Stale-while-revalidate for data + plug-ins manifest.
  const isDataLike = url.pathname.includes('/data/') ||
                     url.pathname.endsWith('plugins/manifest.json');

  if (isDataLike) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(cache =>
        cache.match(req).then(cached => {
          const fresh = fetch(req).then(res => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          }).catch(() => cached);
          return cached || fresh;
        })
      )
    );
    return;
  }

  // Cache-first for everything else (the app shell).
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      // Opportunistically cache successful same-origin responses for next load.
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
