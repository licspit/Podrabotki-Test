/* sw.js – PayCalc v4 (offline + автообновление) */
const VERSION = 'v4-autoavg-1';
const STATIC_CACHE = `paycalc-static-${VERSION}`;
const RUNTIME_CACHE = `paycalc-runtime-${VERSION}`;

const PRECACHE_URLS = [
  './',
  './index.html',
  './favicon.ico',
];

function isHTML(request) {
  const url = new URL(request.url);
  return request.mode === 'navigate' ||
         (request.headers.get('accept') || '').includes('text/html') ||
         url.pathname.endsWith('/') ||
         url.pathname.endsWith('.html');
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => k.startsWith('paycalc-') && ![STATIC_CACHE, RUNTIME_CACHE].includes(k))
          .map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (isHTML(request)) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request, { cache: 'no-store' });
        const cache = await caches.open(STATIC_CACHE);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match('./index.html') || await caches.match(request);
        return cached || new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);
    const network = fetch(request).then((resp) => {
      if (resp && resp.status === 200 && resp.type === 'basic') cache.put(request, resp.clone());
      return resp;
    }).catch(() => null);
    return cached || network || new Response('', { status: 504 });
  })());
});

self.addEventListener('message', (event) => {
  if ((event.data||{}).action === 'skipWaiting' && self.skipWaiting) self.skipWaiting();
});
