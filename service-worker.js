const CACHE = 'hometurn-v2';
const ASSETS = ['./','./index.html','./styles.css','./app.js','./manifest.webmanifest'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(clients.claim()));
self.addEventListener('fetch', event => event.respondWith(caches.match(event.request).then(found => found || fetch(event.request))));
