const CACHE_NAME = 'po-generator-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/logo.png'
];

// On install, pre-cache the app shell.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// On activate, clean up old caches and claim clients.
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// On fetch, use a network-first strategy.
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        // Try the network first.
        const networkResponse = await fetch(event.request);
        
        // If the request is successful, clone it and cache it.
        if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        // If the network fails, try to serve from cache.
        console.log('Network request failed, trying cache.', error);
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            return cachedResponse;
        }
        // If not in cache, return a fallback response.
        return new Response("You are offline and this resource is not available in the cache.", {
            status: 404,
            statusText: "Offline and Not Found",
            headers: { 'Content-Type': 'text/plain' },
        });
      }
    })()
  );
});