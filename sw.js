// sw.js — сеть в приоритете для index.html, жёсткое обновление кэша
const CACHE = 'podrabotki-v9-2025-09-05';

const PRECACHE = ['/', './', './index.html'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Для переходов (navigate) — сначала сеть, при оффлайне — кэшированный index.html
self.addEventListener('fetch', (e) => {
  const req = e.request;

  // Главная навигация -> index.html
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Остальное: cache-first с подстановкой из сети при отсутствии в кэше
  e.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
