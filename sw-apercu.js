/* Service worker minimal — uniquement pour tester la notification de fin de repos */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === 'REST_DONE') {
    e.waitUntil(self.registration.showNotification('Repos terminé ! 💪', {
      body: d.body || 'Tu peux reprendre l\u2019exercice !',
      icon: './icon-192.png', badge: './icon-192.png',
      tag: 'gymhero-rest', renotify: true,
      vibrate: [200, 100, 200, 100, 400], data: { url: './' }
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
