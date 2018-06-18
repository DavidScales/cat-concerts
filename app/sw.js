/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0-alpha.6/workbox-sw.js');

(() => {

  if (!workbox) {
    console.log(`Boo! Workbox didn't load 😬`);
    return;
  }

  console.log(`Yay! Workbox is loaded 🎉`);

  // preache file manifest will beinjected by workbox-build in a gulp task
  workbox.precaching.precacheAndRoute([]);

  // Use cache-first strategy for profile images, with fallback image
  const FALLBACK_IMAGE_URL = '/images/profiles/user-anonymous.jpg';
  const profileImagesHandler = workbox.strategies.cacheFirst({
    cacheName: 'profile-images-cache',
    networkTimetoutSeconds: 3,
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
      })
    ]
  });
  workbox.routing.registerRoute(
    new RegExp('/images/profiles'),
    ({event}) => {
      return profileImagesHandler.handle({event})
        .catch(() => {
          return caches.match(FALLBACK_IMAGE_URL);
        });
    }
  );

  workbox.routing.registerRoute(
    new RegExp('https://www.gstatic.com/firebasejs'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'firebase-libraries',
    })
  );

})();
