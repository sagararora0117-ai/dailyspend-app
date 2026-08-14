const CACHE_NAME = 'dailyspend-v2';

// Resolve the deployment base path from the service worker's own scope so the
// PWA works when hosted under a subpath (e.g. /dailyspend-app/).
const BASE = (() => {
  const scope = self.registration.scope || './';
  return scope.endsWith('/') ? scope : `${scope}/`;
})();

const ASSETS_TO_CACHE = [
  BASE,
  `${BASE}index.html`,
  `${BASE}manifest.json`,
];

// Install event - cache the basic application shell.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // If some assets fail to cache, continue installation.
        return Promise.resolve();
      });
    })
  );

  // Activate the new service worker immediately.
  self.skipWaiting();
});

// Activate event - remove old caches and take control of open clients.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip cross-origin requests.
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  // Always check the network first for HTML/navigation requests.
  // This allows newly deployed versions of DailySpend to be detected
  // promptly while still providing an offline fallback.
  if (
    request.mode === 'navigate' ||
    request.destination === 'document'
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }

          return response;
        })
        .catch(() => {
          return (
            caches.match(request) ||
            caches.match(`${BASE}index.html`) ||
            new Response('Offline')
          );
        })
    );

    return;
  }

  // For API calls, try network first.
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }

          return response;
        })
        .catch(() => {
          return caches.match(request) || new Response('Offline');
        })
    );

    return;
  }

  // For static assets, use cache first.
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request)
        .then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response;
          }

          const responseClone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });

          return response;
        })
        .catch(() => {
          return (
            caches.match(`${BASE}index.html`) ||
            new Response('Offline')
          );
        });
    })
  );
});