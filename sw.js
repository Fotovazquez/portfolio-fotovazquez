const CACHE_NAME = 'fotovazquez-v2'; 
const urlsToCache = [
  '/',
  'index.html',
  'site.webmanifest', 
  'img/icon-192.png',
  'img/icon-512.png'
];

// 1. INSTALACIÓN: Guarda los archivos esenciales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta correctamente');
        return cache.addAll(urlsToCache);
      })
  );
  // Fuerza a que el nuevo SW tome el control de inmediato
  self.skipWaiting();
});

// 2. ACTIVACIÓN: Limpia cachés antiguas (Vital para evitar el error de "versión anterior")
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. ESTRATEGIA: Red primero, si falla, caché
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});