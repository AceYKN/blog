import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'

export const PRECACHE_TARGET_BYTES = 3 * 1024 * 1024
export const PRECACHE_HARD_LIMIT_BYTES = 5 * 1024 * 1024
export const WORKBOX_MAX_FILE_BYTES = 3 * 1024 * 1024
export const PWA_CACHE_PREFIX = 'aceykn-blog'
export const PWA_CACHE_NAME_PREFIX = `${PWA_CACHE_PREFIX}-`
export const LEGACY_PWA_CACHE_NAME_PREFIX = 'aceykn-'
export const PWA_PRECACHE_NAME_PREFIX = `${PWA_CACHE_NAME_PREFIX}precache-v2-`
export const LEGACY_WORKBOX_PRECACHE_NAME_PREFIX = 'workbox-precache-v2-'

export const PWA_CACHE_NAMES = {
  pages: `${PWA_CACHE_PREFIX}-pages-v1`,
  payload: `${PWA_CACHE_PREFIX}-payload-v1`,
  searchMeta: `${PWA_CACHE_PREFIX}-search-meta-v1`,
  searchIndex: `${PWA_CACHE_PREFIX}-search-index-v1`,
  images: `${PWA_CACHE_PREFIX}-images-v1`,
  assets: `${PWA_CACHE_PREFIX}-assets-v1`
}

export const CURRENT_RUNTIME_CACHE_NAMES = Object.freeze(Object.values(PWA_CACHE_NAMES))

export function getCacheCleanupSource({ removeAll = false, unregister = false } = {}) {
  const installHandler = unregister ? "self.addEventListener('install', () => self.skipWaiting())\n" : ''
  const unregisterHandler = unregister ? '.then(() => self.registration.unregister())' : ''
  return `${installHandler}/* AceYKN PWA cache cleanup. */
const CURRENT_RUNTIME_CACHES = new Set(${JSON.stringify(CURRENT_RUNTIME_CACHE_NAMES)})
const APP_CACHE_PREFIX = ${JSON.stringify(PWA_CACHE_NAME_PREFIX)}
const LEGACY_APP_CACHE_PREFIX = ${JSON.stringify(LEGACY_PWA_CACHE_NAME_PREFIX)}
const CURRENT_PRECACHE_PREFIX = ${JSON.stringify(PWA_PRECACHE_NAME_PREFIX)}
const LEGACY_PRECACHE_PREFIX = ${JSON.stringify(LEGACY_WORKBOX_PRECACHE_NAME_PREFIX)}

function isOwnedCache(cacheName) {
  return cacheName.startsWith(APP_CACHE_PREFIX) ||
    cacheName.startsWith(LEGACY_APP_CACHE_PREFIX) ||
    cacheName.startsWith(LEGACY_PRECACHE_PREFIX + self.registration.scope)
}

async function cleanupPwaCaches(removeAll = false) {
  const keys = await caches.keys()
  const keysToDelete = keys.filter((cacheName) => {
    if (!isOwnedCache(cacheName)) return false
    if (removeAll) return true
    return !CURRENT_RUNTIME_CACHES.has(cacheName) && !cacheName.startsWith(CURRENT_PRECACHE_PREFIX)
  })
  await Promise.all(keysToDelete.map((cacheName) => caches.delete(cacheName)))
}

self.addEventListener('activate', (event) => {
  event.waitUntil(
    cleanupPwaCaches(${removeAll})${unregisterHandler}
  )
})
`
}

export function normalizeBaseURL(value = '/') {
  const trimmed = String(value || '/').trim()
  if (!trimmed || trimmed === '/') return '/'
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`
}

export function withBaseURL(baseURL, path) {
  const base = normalizeBaseURL(baseURL)
  return `${base}${String(path).replace(/^\/+/, '')}`
}

export function getPwaPaths(baseURL) {
  const normalizedBaseURL = normalizeBaseURL(baseURL)
  return {
    baseURL: normalizedBaseURL,
    manifestURL: withBaseURL(normalizedBaseURL, 'manifest.webmanifest'),
    serviceWorkerURL: withBaseURL(normalizedBaseURL, 'sw.js'),
    offlineURL: withBaseURL(normalizedBaseURL, 'offline.html')
  }
}

export async function getCriticalAssetPaths(distDirectory) {
  const html = await readFile(join(distDirectory, 'index.html'), 'utf8')
  const references = [...html.matchAll(/(?:src|href)=["']([^"']*?_nuxt\/[^"']+\.js(?:[?#][^"']*)?)["']/g)]
    .map((match) => match[1].split(/[?#]/, 1)[0])
    .map((reference) => reference.slice(reference.indexOf('_nuxt/')))
  return [...new Set(references)]
}

export async function getCriticalAssetSizes(distDirectory, criticalAssetPaths = []) {
  return Promise.all(
    criticalAssetPaths.map(async (path) => ({
      path,
      size: (await stat(join(distDirectory, path))).size
    }))
  )
}

export function assertCriticalAssetSizes(criticalAssetSizes = []) {
  const oversized = criticalAssetSizes.filter(({ size }) => size > WORKBOX_MAX_FILE_BYTES)
  if (oversized.length) {
    const details = oversized.map(({ path, size }) => `${path} (${size} bytes)`).join(', ')
    throw new Error(`Critical JS exceeds the ${WORKBOX_MAX_FILE_BYTES} byte per-file precache limit: ${details}`)
  }
}

export function getPrecacheOptions(distDirectory, criticalAssetPaths = []) {
  const globPatterns = [...new Set(['_nuxt/**/*.css', 'offline.html', ...criticalAssetPaths])]
  return {
    globDirectory: distDirectory,
    globPatterns,
    globIgnores: ['sw.js', 'manifest.webmanifest', 'pwa-cache-cleanup.js'],
    maximumFileSizeToCacheInBytes: WORKBOX_MAX_FILE_BYTES
  }
}

export function getWorkboxConfig({ distDirectory, baseURL, criticalAssetPaths = [] }) {
  const paths = getPwaPaths(baseURL)

  return {
    ...getPrecacheOptions(distDirectory, criticalAssetPaths),
    swDest: join(distDirectory, 'sw.js'),
    cacheId: PWA_CACHE_PREFIX,
    importScripts: ['pwa-cache-cleanup.js'],
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: false,
    navigationPreload: true,
    runtimeCaching: [
      {
        urlPattern: ({ request, sameOrigin }) =>
          sameOrigin && request.method === 'GET' && (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')),
        handler: 'NetworkFirst',
        options: {
          cacheName: PWA_CACHE_NAMES.pages,
          networkTimeoutSeconds: 3,
          cacheableResponse: { statuses: [200] },
          expiration: {
            maxEntries: 120,
            maxAgeSeconds: 30 * 24 * 60 * 60,
            purgeOnQuotaError: true
          },
          precacheFallback: { fallbackURL: paths.offlineURL }
        }
      },
      {
        urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.endsWith('/_payload.json'),
        handler: 'NetworkFirst',
        options: {
          cacheName: PWA_CACHE_NAMES.payload,
          cacheableResponse: { statuses: [200] },
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60,
            purgeOnQuotaError: true
          }
        }
      },
      {
        urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.endsWith('/search-catalog.json'),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: PWA_CACHE_NAMES.searchMeta,
          cacheableResponse: { statuses: [200] },
          expiration: {
            maxEntries: 4,
            maxAgeSeconds: 7 * 24 * 60 * 60,
            purgeOnQuotaError: true
          }
        }
      },
      {
        urlPattern: ({ url, sameOrigin }) => sameOrigin && /\/search-index-(?:notes|essays|tech|projects)\.json$/.test(url.pathname),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: PWA_CACHE_NAMES.searchIndex,
          cacheableResponse: { statuses: [200] },
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 7 * 24 * 60 * 60,
            purgeOnQuotaError: true
          }
        }
      },
      {
        urlPattern: ({ request, sameOrigin }) => sameOrigin && request.destination === 'image',
        handler: 'CacheFirst',
        options: {
          cacheName: PWA_CACHE_NAMES.images,
          cacheableResponse: { statuses: [200] },
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60,
            purgeOnQuotaError: true
          }
        }
      },
      {
        urlPattern: ({ request, url, sameOrigin }) =>
          sameOrigin &&
          url.pathname.includes('/_nuxt/') &&
          (['script', 'style', 'font'].includes(request.destination) || /.(?:js|css|woff2?|wasm)$/.test(url.pathname)),
        handler: 'CacheFirst',
        options: {
          cacheName: PWA_CACHE_NAMES.assets,
          cacheableResponse: { statuses: [200] },
          expiration: {
            maxEntries: 180,
            maxAgeSeconds: 30 * 24 * 60 * 60,
            purgeOnQuotaError: true
          }
        }
      }
    ]
  }
}
