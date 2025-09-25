const CACHE_VERSION = "reb-cache-v1";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE).map((key) => caches.delete(key)))
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (["style", "script", "font", "image"].includes(request.destination)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    const copy = response.clone();
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.put(request, copy);
    return response;
  } catch (error) {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    const precache = await caches.open(STATIC_CACHE);
    const fallback = await precache.match("/");

    if (fallback) {
      return fallback;
    }

    return Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);

  if (cached) {
    updateCache(STATIC_CACHE, request);
    return cached;
  }

  const response = await fetch(request);
  const copy = response.clone();
  const cache = await caches.open(STATIC_CACHE);
  await cache.put(request, copy);
  return response;
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const networkPromise = fetch(request)
    .then(async (response) => {
      const copy = response.clone();
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, copy);
      return response;
    })
    .catch(() => undefined);

  return cached || (await networkPromise) || Response.error();
}

function updateCache(cacheName, request) {
  fetch(request)
    .then(async (response) => {
      const copy = response.clone();
      const cache = await caches.open(cacheName);
      await cache.put(request, copy);
    })
    .catch(() => undefined);
}
