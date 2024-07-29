const CACHE_NAME = 'car-rental-cache-v1';
const URLS_TO_CACHE = [
    '/',
    '/style.css',
    '/app.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Installation du Service Worker
self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(URLS_TO_CACHE);
            })
            .catch((err) => {
                console.error('Cache failed to open:', err);
            })
    );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Gestion des requêtes
self.addEventListener('fetch', (event) => {
    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(event.request);
            
            if (cachedResponse) {
                return cachedResponse;
            } else {
                try {
                    const fetchResponse = await fetch(event.request);
                    if (fetchResponse && fetchResponse.status === 200 && fetchResponse.type === 'basic') {
                        const responseToCache = fetchResponse.clone();
                        cache.put(event.request, responseToCache);
                    }
                    return fetchResponse;
                } catch (e) {
                    console.error('Fetch failed:', e);
                    return new Response('Service temporairement indisponible', {
                        status: 503,
                        statusText: 'Service temporairement indisponible'
                    });
                }
            }
        })()
    );
});
