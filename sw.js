const CACHE_NAME = 'site-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/css/root.css',
  '/css/layout.css',
  '/css/menu.css',
  '/css/style.css',
  '/css/downloads.css',
  '/js/menu.js',
  '/js/clima.js',
  '/js/downloads.js',
  '/js/script2.js',
  '/js/particles_config.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Instalando cache de ativos...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});