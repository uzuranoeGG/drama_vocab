const CACHE = 'drama-vocab-free-v1';

const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', e => {

  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(ASSETS);
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', e => {

  e.waitUntil(
    caches.keys().then(keys => {

      return Promise.all(
        keys
          .filter(k => k !== CACHE)
          .map(k => caches.delete(k))
      );

    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', e => {

  e.respondWith(

    caches.match(e.request).then(res => {

      return (
        res ||
        fetch(e.request).catch(() => caches.match('./index.html'))
      );

    })

  );
});