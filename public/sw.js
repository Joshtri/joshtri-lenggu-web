/**
 * Service Worker for Push Notifications
 * Handles push events and notification display
 */

// Service Worker activate event
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activated");
  event.waitUntil(clients.claim());
});

// Handle push events
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push event received", event);

  if (!event.data) {
    console.log("[Service Worker] No data in push event");
    return;
  }

  try {
    const data = event.data.json();
    const { title, message, actionUrl, icon = "/next.svg", badge = "/next.svg" } = data;

    const notificationOptions = {
      body: message || "New notification",
      icon: icon,
      badge: badge,
      tag: data.id || "notification",
      data: {
        url: actionUrl || "/",
      },
      requireInteraction: false,
      actions: [
        {
          action: "open",
          title: "View",
        },
        {
          action: "close",
          title: "Dismiss",
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(title || "New Notification", notificationOptions)
    );
  } catch (error) {
    console.error("[Service Worker] Error handling push event:", error);

    // Fallback: show simple notification
    event.waitUntil(
      self.registration.showNotification("New Notification", {
        body: event.data.text(),
        icon: "/next.svg",
      })
    );
  }
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notification clicked", event);

  event.notification.close();

  const urlToOpen = event.notification.data.url || "/";

  if (event.action === "close") {
    return;
  }

  // Open or focus window
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if window is already open
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }

        // If not open, open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle notification close
self.addEventListener("notificationclose", (event) => {
  console.log("[Service Worker] Notification closed", event);
});

// Handle messages from client
self.addEventListener("message", (event) => {
  console.log("[Service Worker] Message received:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
