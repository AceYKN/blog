import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const PRECACHE_TARGET_BYTES = 3 * 1024 * 1024
export const PRECACHE_HARD_LIMIT_BYTES = 5 * 1024 * 1024
export const WORKBOX_MAX_FILE_BYTES = 3 * 1024 * 1024

export const PWA_CACHE_NAMES = {
  pages: 'aceykn-pages-v1',
  payload: 'aceykn-payload-v1',
  searchMeta: 'aceykn-search-meta-v1',
  searchIndex: 'aceykn-search-index-v1',
  images: 'aceykn-images-v1',
  assets: 'aceykn-assets-v1'
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

export async function getCriticalAssets(distDirectory) {
  const html = await readFile(join(distDirectory, 'index.html'), 'utf8')
  const references = [...html.matchAll(/(?:src|href)=["']([^"']*?_nuxt\/[^"']+\.js)["']/g)].map((match) => {
    const reference = match[1]
    return reference.slice(reference.indexOf('_nuxt/'))
  })
  return Promise.all(
    [...new Set(references)].map(async (url) => ({
      url,
      revision: createHash('sha256')
        .update(await readFile(join(distDirectory, url)))
        .digest('hex')
    }))
  )
}

export function getPrecacheOptions(distDirectory, criticalAssets = []) {
  return {
    globDirectory: distDirectory,
    globPatterns: ['_nuxt/**/*.css', '_nuxt/**/*.woff2', 'offline.html', 'pwa/**/*.{png,svg,ico}', 'favicon.*'],
    globIgnores: ['sw.js', 'manifest.webmanifest'],
    additionalManifestEntries: criticalAssets,
    maximumFileSizeToCacheInBytes: WORKBOX_MAX_FILE_BYTES
  }
}

export function getWorkboxConfig({ distDirectory, baseURL, criticalAssets = [] }) {
  const paths = getPwaPaths(baseURL)

  return {
    ...getPrecacheOptions(distDirectory, criticalAssets),
    swDest: join(distDirectory, 'sw.js'),
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: false,
    navigationPreload: true,
    runtimeCaching: [
      {
        urlPattern: ({ request, sameOrigin }) => sameOrigin && request.mode === 'navigate',
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
          sameOrigin && url.pathname.includes('/_nuxt/') && ['script', 'style', 'font'].includes(request.destination),
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
