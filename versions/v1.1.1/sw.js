/* ==========================================================================
   Brain Fog Recovery App (Pop - VG v1.1.1) — Service Worker (Offline First)
   ========================================================================== */

const CACHE_NAME = 'pop-app-v1.1.1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './reset.html',
  './about.html',
  './manifest.json',
  './css/design-tokens.css',
  './css/app.css',
  './css/home.css',
  './css/about.css',
  './js/app.js',
  './js/state-machine.js',
  './js/truth-vault.js',
  './js/ambient-particles.js',
  './js/audio-synth.js',
  './js/breathing-engine.js',
  './js/fog-canvas.js',
  './js/focus-bridge.js',
  './js/storage.js',
  './assets/icons/icon.svg',
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((cachedResp) => {
      if (cachedResp) {
        return cachedResp;
      }
      return fetch(evt.request).then((netResp) => {
        return netResp;
      }).catch(() => {
        if (evt.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
