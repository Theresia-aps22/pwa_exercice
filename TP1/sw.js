const CACHE_NAME = 'CT-v3';

// Installation du Service Worker
self.addEventListener('install', async (event) => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
        '/convertir.js',
        '/convertir.css'
    ]);
});

// Gestion des requêtes
self.addEventListener('fetch', async (event) => {
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
            return cachedResponse;
        } else {
            try {
                const fetchResponse = await fetch(event.request);
                cache.put(event.request, fetchResponse.clone());
                return fetchResponse;
            } catch (e) {
                // La connexion réseau a échoué
                console.error('Fetch failed:', e);
                throw e;
            }
        }
    })());
});
