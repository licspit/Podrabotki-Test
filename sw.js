// sw.js  — network-first для index.html, мягкий кеш для остального
const CACHE = 'paycalc-v3-' + (self.registration ? self.registration.scope : Date.now());

// помогай сразу активироваться
self.addEventListener('install', e => {
  self.skipWaiting();
  // необязательно заранее кешировать — пусть подхватывается по ходу
  e.waitUntil(caches.open(CACHE));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(n => n !== CACHE).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

// утилита: сетка с подстраховкой кэшем
async function networkFirst(req) {
  try {
    const net = await fetch(req, { cache: 'no-store' });
    const cache = await caches.open(CACHE);
    cache.put(req, net.clone());
    return net;
  } catch (_) {
    const cached = await caches.match(req);
    if (cached) return cached;
    throw _;
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE);
  const cached = await caches.match(req);
  const fetchPromise = fetch(req).then(res => {
    cache.put(req, res.clone());
    return res;
  }).catch(() => cached);
  return cached || fetchPromise;
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Область действия только для твоего сайта
  // (не перехватываем чужие запросы, аналитики и т.п.)
  const sameOrigin = url.origin === location.origin;

  if (!sameOrigin) return; // пропускаем сторонние

  // index.html и корень — всегда пробуем сеть сначала
  if (url.pathname === '/' || url.pathname.endsWith('/index.html')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Остальное — S-W-R
  event.respondWith(staleWhileRevalidate(event.request));
});

// Позволяем странице ускорять обновление SW
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
