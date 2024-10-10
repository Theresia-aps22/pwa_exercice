const CACHE_NAME = 'product-catalog-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    // '/style.css',
    '/app.js',
    '/manifest.json',
    '/images/icon.jpg', 
    '/images/icon.jpg'
];

// Installation du Service Worker et mise en cache des ressources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Ouverture du cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activation du Service Worker et nettoyage des anciens caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Suppression de l\'ancien cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interception des requêtes et utilisation du cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si la réponse est trouvée dans le cache, on la retourne
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
