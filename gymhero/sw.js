const CACHE = 'gymhero-v26';
const FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './zxing.min.js'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (new URL(e.request.url).origin !== location.origin) return; // API externes (Open Food Facts) : réseau direct
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});

/* ===== Notification de fin de repos ===== */
self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === 'REST_DONE') {
    e.waitUntil(self.registration.showNotification('Repos terminé ! 💪', {
      body: d.body || 'Tu peux reprendre l\u2019exercice !',
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: 'gymhero-rest',
      renotify: true,
      requireInteraction: false,
      vibrate: [200, 100, 200, 100, 400],
      data: { url: './' }
    }));
  }
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) return c.focus(); }
    if (self.clients.openWindow) return self.clients.openWindow('./');
  }));
});
