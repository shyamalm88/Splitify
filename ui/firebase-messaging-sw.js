// This service worker file is needed for Firebase Cloud Messaging to work
// in the background when the app is not open in the browser.
// Place this at your project root.

// Import and configure Firebase
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js"
);

// Your Firebase configuration
// Replace with your actual Firebase config info except for messagingSenderId
firebase.initializeApp({
  apiKey: "AIzaSyC1xLhbGBeg7pCJNM-ON5aMCT_1RY5560I",
  authDomain: "splitify-cd256.firebaseapp.com",
  projectId: "splitify-cd256",
  storageBucket: "splitify-cd256.firebasestorage.app",
  messagingSenderId: "1056124364476", // The provided sender key
  appId: "1:1234567890:web:321abc456def7890",
});

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message",
    payload
  );

  // Customize notification here
  const notificationTitle = payload.notification.title || "Notification";
  const notificationOptions = {
    body: payload.notification.body || "You have a new message.",
    icon: "/favicon.ico",
    badge: "/badge.png",
    data: payload.data,
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification clicked", event);

  event.notification.close();

  // You can handle different actions here based on event.notification.data
  // This will open the app or a specific URL when the notification is clicked
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, focus on that window
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
