const CACHE_NAME = "forrago-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./img/img_01.png",
  "./img/img_02.png",
  "./img/img_03.jpg",
  "./img/img_04.jpg",
  "./img/img_05.jpg",
  "./img/img_06.jpg",
  "./img/img_07.jpg",
  "./img/img_08.jpg",
  "./img/img_09.jpg",
  "./img/img_10.jpg",
  "./img/img_11.jpg",
  "./img/img_12.png",
  "./img/icons/icon-192.png",
  "./img/icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          if (!response || response.status !== 200 || response.type === "opaque") {
            return response;
          }

          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy);
          });

          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
