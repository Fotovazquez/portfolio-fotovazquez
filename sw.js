const CACHE_NAME = 'fotovazquez-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/site.webmanifest.json',
  '/img/icon-192.png',
  '/img/icon-512.png'
];

// Instalación del SW y guardado de archivos críticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Estrategia de carga: primero red, si falla, usa la caché
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

