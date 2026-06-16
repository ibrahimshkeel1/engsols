self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? { title: "EngSols", body: "You have a new notification", url: "/" };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/manifest.json",
      data: { url: data.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
