const CACHE_NAME = 'task-list-cache-v1.4.1';
const urlsToCache = [
  '/',
  'tasks.html',
  'favicon.ico',
  'public/stylesheets/style.css',
  'public/javascripts/main.js',
  'public/javascripts/for-sw.js',
  'https://fonts.googleapis.com/css?family=Open+Sans',
  'https://use.fontawesome.com/releases/v5.7.2/css/all.css',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
  'https://code.jquery.com/jquery-3.3.1.slim.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js'
];

self.addEventListener('install', (event) => {
  // Perform install steps
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['task-list-cache-v1.4.1'];

  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          return caches.delete(cacheName);
        }
      })
    ))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request).then((res) => {
        // Check if we received a valid response
        if (!res || res.status !== 200 || res.type !== 'basic') {
          return res;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        const responseToCache = res.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
