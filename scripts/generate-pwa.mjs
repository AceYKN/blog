import { readFile, rm, stat, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { generateSW, getManifest } from 'workbox-build'
import {
  PRECACHE_HARD_LIMIT_BYTES,
  PRECACHE_TARGET_BYTES,
  getCriticalAssets,
  getPwaPaths,
  getPrecacheOptions,
  getWorkboxConfig,
  normalizeBaseURL
} from './pwa-config.mjs'

const root = process.cwd()
const distDirectory = resolve(root, process.env.PWA_DIST_DIR || 'dist')
const baseURL = normalizeBaseURL(process.env.NUXT_APP_BASE_URL || '/')
const pwaEnabled = process.env.NUXT_PUBLIC_PWA_ENABLED !== 'false'
const paths = getPwaPaths(baseURL)

const requiredAssets = ['offline.html', 'pwa/icon-192.png', 'pwa/icon-512.png', 'pwa/icon-maskable-512.png', 'pwa/apple-touch-icon.png']

async function assertFile(relativePath) {
  const filePath = join(distDirectory, relativePath)
  try {
    const details = await stat(filePath)
    if (!details.isFile() || details.size === 0) throw new Error(`${relativePath} is empty`)
  } catch (error) {
    throw new Error(`PWA asset is missing: ${relativePath}`, { cause: error })
  }
}

async function applyOfflineBaseURL() {
  const offlinePath = join(distDirectory, 'offline.html')
  const offline = await readFile(offlinePath, 'utf8')
  const baseURLPattern = /location\.href = '(?:__PWA_BASE_URL__|\/[^']*)'/
  if (!baseURLPattern.test(offline)) throw new Error('offline.html is missing its PWA base URL placeholder')
  await writeFile(offlinePath, offline.replace(baseURLPattern, `location.href = '${paths.baseURL}'`), 'utf8')
}

const distDetails = await stat(distDirectory).catch(() => null)
if (!distDetails?.isDirectory()) throw new Error('dist/ must exist before generating PWA assets')

async function removeGeneratedPwaFiles() {
  await Promise.all([rm(join(distDirectory, 'manifest.webmanifest'), { force: true }), rm(join(distDirectory, 'sw.js'), { force: true })])
}

async function writeCleanupServiceWorker() {
  const cleanupWorker = `/* AceYKN PWA cleanup worker. */
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('aceykn-')).map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
  )
})
`
  await writeFile(join(distDirectory, 'sw.js'), cleanupWorker, 'utf8')
  console.log(`PWA disabled; emitted cleanup worker for ${paths.serviceWorkerURL}`)
}

if (!pwaEnabled) {
  await removeGeneratedPwaFiles()
  if (process.env.NUXT_PUBLIC_PWA_CLEANUP === 'true') await writeCleanupServiceWorker()
  else console.log('PWA disabled; no new service worker will be generated.')
  process.exit(0)
}

for (const asset of requiredAssets) await assertFile(asset)
await applyOfflineBaseURL()

const manifest = {
  id: paths.baseURL,
  name: 'AceYKN Notes',
  short_name: 'AceYKN',
  description: '學習筆記、文章與工作紀錄。',
  lang: 'zh-Hant',
  start_url: paths.baseURL,
  scope: paths.baseURL,
  display: 'standalone',
  background_color: '#f5f1e6',
  theme_color: '#f5f1e6',
  prefer_related_applications: false,
  icons: [
    { src: 'pwa/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: 'pwa/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: 'pwa/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ]
}

await writeFile(join(distDirectory, 'manifest.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

const criticalAssets = await getCriticalAssets(distDirectory)
const workboxConfig = getWorkboxConfig({ distDirectory, baseURL, criticalAssets })
const precacheResult = await getManifest(getPrecacheOptions(distDirectory, criticalAssets))
const precacheEntries = precacheResult.manifestEntries || []
const precacheBytes = precacheResult.size || 0

if (!precacheEntries.some((entry) => entry.url.endsWith('offline.html'))) {
  throw new Error('offline.html must be included in the precache manifest')
}
if (precacheEntries.some((entry) => /search-index-(?:notes|essays|tech|projects)\.json/.test(entry.url))) {
  throw new Error('Search indexes must never be included in the initial precache')
}

const buildResult = await generateSW(workboxConfig)
const sizeMiB = (precacheBytes / 1024 / 1024).toFixed(2)
console.log(`PWA precache: ${precacheEntries.length} entries ${sizeMiB} MiB`)
if (precacheBytes > PRECACHE_TARGET_BYTES) {
  console.warn(`PWA precache target exceeded: ${sizeMiB} MiB (target ${PRECACHE_TARGET_BYTES / 1024 / 1024} MiB)`)
}
if (precacheBytes > PRECACHE_HARD_LIMIT_BYTES) {
  throw new Error(`PWA precache exceeds the ${PRECACHE_HARD_LIMIT_BYTES / 1024 / 1024} MiB hard limit`)
}
if (buildResult.warnings?.length) {
  throw new Error(`Workbox warnings:\n${buildResult.warnings.join('\n')}`)
}

const serviceWorker = await readFile(join(distDirectory, 'sw.js'), 'utf8')
if (!serviceWorker.trim()) throw new Error('Workbox did not emit a service worker')
console.log(`PWA generated: ${paths.manifestURL}, ${paths.serviceWorkerURL}`)
