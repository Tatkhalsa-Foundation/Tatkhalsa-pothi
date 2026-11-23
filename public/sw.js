// Legacy Service Worker cleanup for pothi.tatkhalsa.in
// Clears outdated monolithic caches (tatkhalsa-pwa-*, tatkhalsa-gurbani-db-*)
// and unregisters itself so returning visitors immediately load the fresh build.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      } catch {
        // ignore cache deletion errors
      }

      try {
        await self.registration.unregister();
      } catch {
        // ignore unregister errors
      }

      try {
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const client of clients) {
          if ('navigate' in client && typeof client.navigate === 'function') {
            client.navigate(client.url).catch(() => {});
          }
        }
      } catch {
        // ignore client refresh errors
      }
    })(),
  );
});
