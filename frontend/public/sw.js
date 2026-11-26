const CACHE = "pass-man-v2";
const CORE_ASSETS = ["/", "/index.html", "/manifest.json", "/favicon.svg"];

const cacheAppShell = async () => {
    const cache = await caches.open(CACHE);
    const response = await fetch("/", { cache: "no-store" });
    const html = await response.clone().text();
    const assetPaths = Array.from(
        html.matchAll(/(?:src|href)="([^"#]+)"/g),
        (match) => match[1],
    ).filter((path) => path.startsWith("/"));

    await cache.put("/", response.clone());
    await cache.put("/index.html", response);
    await cache.addAll([...new Set([...CORE_ASSETS.slice(2), ...assetPaths])]);
};

self.addEventListener("install", (e) => {
    e.waitUntil(cacheAppShell());
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
            ),
    );
    self.clients.claim();
});

self.addEventListener("fetch", (e) => {
    if (e.request.method !== "GET" || new URL(e.request.url).pathname.startsWith("/api/")) return;

    if (e.request.mode === "navigate") {
        e.respondWith(
            fetch(e.request)
                .then(async (response) => {
                    const cache = await caches.open(CACHE);
                    await cache.put("/", response.clone());
                    return response;
                })
                .catch(() => caches.match("/")),
        );
        return;
    }

    e.respondWith(
        caches.match(e.request).then(async (cached) => {
            if (cached) return cached;

            const response = await fetch(e.request);

            if (response.ok && new URL(e.request.url).origin === self.location.origin) {
                const cache = await caches.open(CACHE);
                await cache.put(e.request, response.clone());
            }

            return response;
        }),
    );
});
