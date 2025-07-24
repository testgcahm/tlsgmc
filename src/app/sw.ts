import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, ExpirationPlugin, NetworkOnly, Serwist } from "serwist";
import { getDefaultCache } from 'serwistcache'

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

const newCache = getDefaultCache();

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ url }) => url.pathname.endsWith('/logo.png') || url.pathname.endsWith('/logo-144.png'),
      handler: new CacheFirst(
        {
          cacheName: 'logo-cache',
          plugins: [
            new ExpirationPlugin({
              maxEntries: 10,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            }),
          ],
        }
      ),
    },
    {
      matcher: ({ url }) => url.pathname === "/api",
      handler: new NetworkOnly(),
    },
    ...newCache,
  ],
});

serwist.addEventListeners();