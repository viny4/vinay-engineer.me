const CACHE_NAME = "vinjr-portfolio-v3";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/assets/css/main.css",
  "/assets/js/main.js",
  "/assets/vendor/bootstrap/css/bootstrap.min.css",
  "/assets/vendor/bootstrap-icons/bootstrap-icons.css",
  "/assets/audio/bg-music.mp3",
  "/assets/img/favicon.png",
];

// Install Event - Pre-cache everything
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("SW: Pre-caching assets (v3)");
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
  self.skipWaiting();
});

// Activate Event - Clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("SW: Clearing old cache:", cache);
            return caches.delete(cache);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch Event - Network First for HTML/JS/CSS, Cache First for others
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // Strategy: Network First for core logic/styles during development/updates
  if (url.origin === self.location.origin && (url.pathname === "/" || url.pathname.endsWith(".html") || url.pathname.endsWith(".js") || url.pathname.endsWith(".css"))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Strategy: Cache First for assets
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      })
    );
  }
});
