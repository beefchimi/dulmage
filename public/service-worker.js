// Reference:
// https://vite-pwa-org.netlify.app/guide/unregister-service-worker.html#unregister-service-worker

// The old `dulmage.me` site used a file called `service-worker.js`,
// where as our new setup uses a `sw.js` file. Therefor, we can
// replace that old file with this code, which specifically uninstalls
// the previous registration (of the same name).

self.addEventListener('install', (_event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (_event) => {
  self.registration
    .unregister()
    .then(() => self.clients.matchAll())
    .then((clients) => {
      clients.forEach((client) => {
        if (client instanceof WindowClient) {
          client.navigate(client.url);
        }
      });

      return Promise.resolve();
    })
    .then(() => {
      self.caches.keys().then((cacheNames) => {
        Promise.all(
          cacheNames.map((cacheName) => {
            return self.caches.delete(cacheName);
          }),
        );
      });
    });
});
