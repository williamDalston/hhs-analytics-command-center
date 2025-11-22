// Service Worker for HHS Analytics Command Center
const CACHE_NAME = 'hhs-analytics-v2';
const STATIC_CACHE = 'hhs-analytics-static-v2';

// Install event - skip waiting immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.warn('Service Worker install failed:', error);
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise try network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response.ok) return response;

            // Clone the response for caching
            const responseClone = response.clone();

            // Cache successful responses
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone));

            return response;
          })
          .catch(() => {
            // Return offline fallback for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/hhs-analytics-command-center/');
            }
          });
      })
  );
});

