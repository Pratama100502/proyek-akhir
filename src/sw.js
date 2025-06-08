// src/sw.js

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import CONFIG from './scripts/config';

const BASE_URL = CONFIG.BASE_URL;

//  Precache App Shell
precacheAndRoute(self.__WB_MANIFEST);

//  Cache HTML shell (navigasi halaman)
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'html-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
    ],
  })
);

// Google Fonts
registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// FontAwesome
registerRoute(
  ({ url }) => url.origin.includes('fontawesome') || url.origin === 'https://cdnjs.cloudflare.com',
  new CacheFirst({
    cacheName: 'fontawesome',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// Avatar API
registerRoute(
  ({ url }) => url.origin === 'https://ui-avatars.com',
  new CacheFirst({
    cacheName: 'avatars-api',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// API data (Non-image)
registerRoute(
  ({ request, url }) =>
    new URL(BASE_URL).origin === url.origin && request.destination !== 'image',
  new NetworkFirst({
    cacheName: 'dicoding-story-api',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// API story detail (offline support)
registerRoute(
  ({ url }) => url.href.startsWith(`${BASE_URL}/stories/story-`),
  new NetworkFirst({
    cacheName: 'story-detail-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 hari
      }),
    ],
  })
);

// API image
registerRoute(
  ({ request, url }) =>
    new URL(BASE_URL).origin === url.origin && request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'dicoding-story-api-images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// MapTiler
registerRoute(
  ({ url }) => url.origin.includes('maptiler'),
  new CacheFirst({
    cacheName: 'maptiler-api',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

// Push Notification Handler
self.addEventListener('push', (event) => {
  event.waitUntil((async () => {
    let title = 'Story Notification';
    let options = {
      body: 'Push message no payload',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
    };

    if (event.data) {
      try {
        const dataText = await event.data.text(); // harus pakai await
        const payload = JSON.parse(dataText);

        title = payload.title || title;
        options = {
          ...options,
          ...(payload.options || {}),
        };
      } catch (e) {
        console.error('Failed to parse push payload:', e);
      }
    }

    await self.registration.showNotification(title, options);
  })());
});

