self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.error('Lỗi parse push data:', e);
    }
  }

  const title = data.notification?.title || 'IUH Food Court';
  const options = {
    body: data.notification?.body || 'Có thông báo mới cho đơn hàng của bạn.',
    icon: data.notification?.icon || '/logo-iuh.png',
    badge: data.notification?.badge || '/logo-iuh.png',
    vibrate: data.notification?.vibrate || [200, 100, 200, 100, 200], // Rung 2 nhịp nhấn mạnh
    data: data.notification?.data || { url: '/' },
    requireInteraction: true // Giữ thông báo trên màn hình cho đến khi user bấm vào
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, just focus it.
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
