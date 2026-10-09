/* Service worker: offline app shell.
 * The two placeholder constants below are filled in at build time by the plugin in vite.config.ts. */
const VERSION = "f799aeeff56a";
const PRECACHE = ["./","./assets/index-D2evGxhZ.js","./assets/index-DO0PbZBt.css","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png","./icons/maskable-512.png","./index.html","./manifest.webmanifest"];
const CACHE = `vasms-${VERSION}`;
const SHELL = Array.isArray(PRECACHE) ? PRECACHE : ['./', './index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith('vasms-') && key !== CACHE) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

// Lets the page offer "update available" and apply it on user action.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  // Only handle same-origin GETs. AI provider calls (cross-origin, POST) always go straight to the network.
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    // Network-first so deploys show up, falling back to the cached shell offline.
    event.respondWith(
      fetch(req).catch(async () => (await caches.match('./index.html')) || (await caches.match('./')) || Response.error()),
    );
    return;
  }

  // Cache-first for static assets (Vite hashes filenames, so cached entries never go stale).
  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        }),
    ),
  );
});
