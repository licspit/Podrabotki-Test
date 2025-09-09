/* PWA Service Worker — офлайн для GitHub Pages под-пути. */
const SW_VERSION = "v2.0.0";
const RUNTIME_CACHE = `rt-${SW_VERSION}`;
const HTML_FALLBACK_URL = "./index.html";

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(RUNTIME_CACHE);
    await cache.add(new Request(HTML_FALLBACK_URL, { cache: "reload" }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k === RUNTIME_CACHE ? null : caches.delete(k))));
    await self.clients.claim();
  })());
});

function isHtmlNavigation(event) {
  const req = event.request;
  return req.mode === "navigate" ||
         (req.method === "GET" && (req.headers.get("accept") || "").includes("text/html"));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isHtmlNavigation(event)) {
    event.respondWith((async () => {
      try { return await fetch(request); }
      catch {
        const cache = await caches.open(RUNTIME_CACHE);
        const cached = await cache.match(HTML_FALLBACK_URL);
        return cached || new Response("Оффлайн", { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
      }
    })());
    return;
  }

  if (request.method === "GET") {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(request);
      const network = fetch(request).then((resp) => {
        if (resp && resp.ok && resp.type === "basic") cache.put(request, resp.clone()).catch(() => {});
        return resp;
      }).catch(() => null);
      return cached || (await network) || new Response("", { status: 504 });
    })());
  }
});
