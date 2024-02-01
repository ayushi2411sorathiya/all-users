console.log("Service is worked");

const CACHE_NAME = "codePwa";
const urlCache = [
    "/static/js/bundle.js",
    "/",
    "/static/media/logo.6ce24c58023cc2f8fd88fe9d219db6c6.svg",
    "/favicon.ico",
    "/sw.js",
    "/manifest.json",
    "/logo192.png",
    "/users"
]

this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("open cache");
                return cache.addAll(urlCache)
            })
    )
})

this.addEventListener("fetch", (event) => {
    if (!navigator.onLine) {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        return response
                    }
                    let furl = event.request.clone()
                    fetch(furl)
                })
        )
    }
})

self.addEventListener("activate", (event) => {
    const cacheWhiteList = [];
    cacheWhiteList.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheName) => Promise.all(
            cacheName.map((cacheName) => {
                if (!cacheWhiteList.includes(cacheName))
                    return caches.delete(cacheName)
            })
        ))
    )
})


