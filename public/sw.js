/* =========================================================================
 * Service Worker — 讓核心行程資料可離線使用
 * =========================================================================
 * 策略：
 * - 導覽請求（HTML）：network-first，失敗時回快取，再失敗回離線頁。
 * - 靜態資源（JS/CSS/圖）：stale-while-revalidate。
 * - 只快取同源請求。Google Maps 連結是外開的，不經過這裡。
 *
 * BASE 由 sw.js 自己的位置推算，所以放在 GitHub Pages 的 /<repo>/ 底下
 * 或放在網域根目錄都能正常運作，不需要改這個檔案。
 * ========================================================================= */

const VERSION = 'v2';
const SHELL_CACHE = `trip2026-shell-${VERSION}`;
const RUNTIME_CACHE = `trip2026-runtime-${VERSION}`;

// '/repo/sw.js' -> '/repo/'　　'/sw.js' -> '/'
const BASE = self.location.pathname.replace(/sw\.js$/, '');

const OFFLINE_URL = `${BASE}offline/`;

const SHELL_URLS = [
  '',
  'itinerary/',
  'map/',
  'bookings/',
  'tasks/',
  'offline/',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
].map((p) => BASE + p);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) =>
        // 個別加入，任何一個失敗都不會讓整個安裝失敗
        Promise.all(
          SHELL_URLS.map((url) => cache.add(url).catch(() => undefined))
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 導覽請求
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || (await caches.match(OFFLINE_URL)) || Response.error();
        })
    );
    return;
  }

  // 靜態資源
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
