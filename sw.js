// =============================================================================
//  A blank earth — service worker
// =============================================================================
//  Strategy:
//    - Network-FIRST for HTML (index.html, stats.html, "/") so deploys take
//      effect immediately and a broken cached page can never get stuck.
//      Falls back to cache only when offline.
//    - Cache-first for static assets (vendor JS, icons, manifest).
//    - Stale-while-revalidate for data files + plug-in manifest.
//    - Bump CACHE_VERSION when shipping a release to invalidate old caches.
// =============================================================================

const CACHE_VERSION = 'blank-earth-v7';   // bumped for title descriptions, Voyager line, darker steel tier 2, dropped Coastlines card
const PRECACHE = [
  './',
  './index.html',
  './stats.html',
  './manifest.webmanifest',
  './vendor/three-r128.min.js?v=2',
  './data/worldtopo.json',
  './data/elevations.json',
  './plugins/manifest.json',
  './icons/globe.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(PRECACHE).catch(err => {
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
  if (url.origin !== self.location.origin) return;

  // Identify HTML navigations / page loads — these MUST be network-first so
  // a fresh deploy isn't masked by an old cached page.
  const isHTML = req.mode === 'navigate' ||
                 (req.headers.get('accept') || '').includes('text/html') ||
                 url.pathname === '/' ||
                 url.pathname.endsWith('.html');

  if (isHTML) {
    event.respondWith(
      fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(req).then(c => c || caches.match('./index.html')))
    );
    return;
  }

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

  // Cache-first for vendor JS, icons, etc. (immutable-ish assets).
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
