const CACHE_NAME = 'pabellon-literario-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/offline.html',
    '/manifest.json',
    '/404.html',
    '/500.html',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return fetch(event.request)
                .then(response => {
                    if (event.request.url.includes('/api/')) { 
                        cache.put(event.request, response.clone());
                    }
                    return response;
                })
                .catch(() => caches.match(event.request).then(cachedResponse => {
                    return cachedResponse || caches.match('/offline.html');
                }));
        })
    );
});


self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (!response || response.status !== 200) {
                    return caches.match('/500.html');
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request)
                    .then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        if (event.request.mode === 'navigate') {
                            return caches.match('/404.html');
                        }
                        return caches.match('/offline.html');
                    });
            })
    );
});
