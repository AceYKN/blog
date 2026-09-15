import { readFile, stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { getManifest } from 'workbox-build'
import {
  assertCriticalAssetSizes,
  getCriticalAssetPaths,
  getCriticalAssetSizes,
  getPwaPaths,
  getPrecacheOptions,
  normalizeBaseURL,
  PWA_CACHE_NAMES,
  PRECACHE_HARD_LIMIT_BYTES
} from './pwa-config.mjs'

const root = process.cwd()
const distDirectory = resolve(root, process.env.PWA_DIST_DIR || 'dist')
const baseURL = normalizeBaseURL(process.env.NUXT_APP_BASE_URL || '/')
const paths = getPwaPaths(baseURL)

async function readDetails(relativePath) {
  try {
    const details = await stat(join(distDirectory, relativePath))
    if (!details.isFile() || details.size === 0) throw new Error('empty')
    return details
  } catch (error) {
    throw new Error(`Missing PWA output: ${relativePath}`, { cause: error })
  }
}

async function optionalDetails(relativePath) {
  try {
    const details = await stat(join(distDirectory, relativePath))
    return details.isFile() ? details : null
  } catch {
    return null
  }
}

function hasHref(html, href) {
  return html.includes(`href="${href}"`) || html.includes(`href='${href}'`)
}

function assertManifestIcon(icon, expected) {
  for (const key of ['src', 'sizes', 'type', 'purpose']) {
    if (icon?.[key] !== expected[key]) {
      throw new Error(`Manifest icon ${key} must be ${JSON.stringify(expected[key])}, got ${JSON.stringify(icon?.[key])}`)
    }
  }
}

async function checkDisabledBuild() {
  const indexFile = await readDetails('index.html')
  const indexHTML = await readFile(join(distDirectory, 'index.html'), 'utf8')
  if (await optionalDetails('manifest.webmanifest')) throw new Error('PWA disabled build must not emit manifest.webmanifest')
  if (await optionalDetails('pwa-cache-cleanup.js')) throw new Error('PWA disabled build must not emit the runtime cleanup helper')
  if (hasHref(indexHTML, paths.manifestURL) || /rel=["']manifest["']/i.test(indexHTML)) {
    throw new Error('PWA disabled build must not reference a manifest')
  }
  if (indexHTML.includes('pwa-install-action')) throw new Error('PWA disabled build must not render Install UI')

  const serviceWorkerFile = await optionalDetails('sw.js')
  const cleanupEnabled = process.env.NUXT_PUBLIC_PWA_CLEANUP === 'true'
  if (!cleanupEnabled && serviceWorkerFile) throw new Error('PWA disabled build must not emit sw.js')
  if (cleanupEnabled) {
    if (!serviceWorkerFile) throw new Error('PWA cleanup build must emit sw.js')
    const cleanupWorker = await readFile(join(distDirectory, 'sw.js'), 'utf8')
    for (const marker of ['skipWaiting', 'caches.keys', 'caches.delete', 'registration.unregister', 'aceykn-blog']) {
      if (!cleanupWorker.includes(marker)) throw new Error(`Cleanup worker is missing ${marker}`)
    }
  }
  console.log(`PWA disabled check passed: ${indexFile.size} byte index · cleanup=${cleanupEnabled}`)
}

if (process.env.NUXT_PUBLIC_PWA_ENABLED === 'false') {
  await checkDisabledBuild()
  process.exit(0)
}

const manifestFile = await readDetails('manifest.webmanifest')
const serviceWorkerFile = await readDetails('sw.js')
const offlineFile = await readDetails('offline.html')
const indexFile = await readDetails('index.html')
const faviconFile = await readDetails('favicon.png')
await readDetails('favicon.svg')
await readDetails('favicon.ico')
const manifest = JSON.parse(await readFile(join(distDirectory, 'manifest.webmanifest'), 'utf8'))
const serviceWorker = await readFile(join(distDirectory, 'sw.js'), 'utf8')
const offline = await readFile(join(distDirectory, 'offline.html'), 'utf8')
const indexHTML = await readFile(join(distDirectory, 'index.html'), 'utf8')

const expectedIcons = [
  ['pwa/icon-192.png', 192, 60 * 1024],
  ['pwa/icon-512.png', 512, 120 * 1024],
  ['pwa/icon-maskable-512.png', 512, 120 * 1024],
  ['pwa/apple-touch-icon.png', 180, 80 * 1024]
]
for (const [relativePath, expectedSize, maxBytes] of expectedIcons) {
  const details = await readDetails(relativePath)
  if (details.size > maxBytes) console.warn(`${relativePath} exceeds its ${maxBytes} byte optimization target`)
  const png = await readFile(join(distDirectory, relativePath))
  if (png.readUInt32BE(0) !== 0x89504e47 || png.readUInt32BE(4) !== 0x0d0a1a0a) throw new Error(`${relativePath} is not a PNG`)
  const width = png.readUInt32BE(16)
  const height = png.readUInt32BE(20)
  if (width !== expectedSize || height !== expectedSize)
    throw new Error(`${relativePath} must be ${expectedSize}x${expectedSize}, got ${width}x${height}`)
}

const requiredManifest = {
  id: paths.baseURL,
  start_url: paths.baseURL,
  scope: paths.baseURL,
  display: 'standalone',
  background_color: '#f5f1e6',
  theme_color: '#f5f1e6'
}
for (const [key, expected] of Object.entries(requiredManifest)) {
  if (manifest[key] !== expected)
    throw new Error(`Manifest ${key} must be ${JSON.stringify(expected)}, got ${JSON.stringify(manifest[key])}`)
}
const expectedManifestIcons = [
  { src: 'pwa/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
  { src: 'pwa/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
  { src: 'pwa/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
]
if (!Array.isArray(manifest.icons) || manifest.icons.length !== expectedManifestIcons.length) {
  throw new Error('Manifest must expose exactly the three expected PWA icons')
}
manifest.icons.forEach((icon, index) => assertManifestIcon(icon, expectedManifestIcons[index]))

if (faviconFile.size >= 100 * 1024) throw new Error('favicon.png exceeds the 100 KiB budget')
if (manifestFile.size >= 5 * 1024) throw new Error('manifest.webmanifest exceeds the 5 KiB budget')
if (indexFile.size === 0 || offlineFile.size === 0 || serviceWorkerFile.size === 0)
  throw new Error('index.html, offline.html, and sw.js must be non-empty')
if (!hasHref(indexHTML, paths.manifestURL)) throw new Error(`index.html must reference ${paths.manifestURL}`)
if (!hasHref(indexHTML, `${paths.baseURL}pwa/apple-touch-icon.png`)) {
  throw new Error(`index.html must reference ${paths.baseURL}pwa/apple-touch-icon.png`)
}
for (const faviconPath of ['favicon.svg', 'favicon.png', 'favicon.ico']) {
  if (!hasHref(indexHTML, `${paths.baseURL}${faviconPath}`)) throw new Error(`index.html must reference ${paths.baseURL}${faviconPath}`)
}
if (!/name=["']viewport["'][^>]+viewport-fit=cover/i.test(indexHTML)) {
  throw new Error('index.html viewport must include viewport-fit=cover')
}
const assetReferences = [...indexHTML.matchAll(/(?:src|href)=["']([^"']*_nuxt\/[^"']+)["']/g)].map((match) => match[1])
const expectedAssetPrefix = `${paths.baseURL}_nuxt/`
if (!assetReferences.length || assetReferences.some((reference) => !reference.startsWith(expectedAssetPrefix))) {
  throw new Error(`index.html contains a Nuxt asset outside ${expectedAssetPrefix}`)
}
if (/<script\s+src=/i.test(offline) || /https?:\/\//i.test(offline)) {
  throw new Error('offline.html must not depend on external scripts, fonts, or styles')
}
if (!offline.includes(`<a href="${paths.baseURL}">`) || offline.includes('__PWA_BASE_URL__')) {
  throw new Error(`offline.html must link home to ${paths.baseURL}`)
}

const criticalAssetPaths = await getCriticalAssetPaths(distDirectory)
const criticalAssetSizes = await getCriticalAssetSizes(distDirectory, criticalAssetPaths)
assertCriticalAssetSizes(criticalAssetSizes)
const precacheResult = await getManifest(getPrecacheOptions(distDirectory, criticalAssetPaths))
const precacheEntries = precacheResult.manifestEntries || []
const precacheBytes = precacheResult.size || 0
if (!precacheEntries.some((entry) => entry.url.endsWith('offline.html'))) throw new Error('offline.html is not in precache')
if (precacheEntries.some((entry) => /search-index-(?:notes|essays|tech|projects)\.json/.test(entry.url))) {
  throw new Error('Search index found in initial precache')
}
const missingCriticalAssets = criticalAssetPaths.filter((path) => !precacheEntries.some((entry) => entry.url.endsWith(path)))
if (missingCriticalAssets.length) throw new Error(`Critical JS is missing from the precache manifest: ${missingCriticalAssets.join(', ')}`)
if (precacheBytes > PRECACHE_HARD_LIMIT_BYTES) {
  throw new Error(`PWA precache exceeds the ${PRECACHE_HARD_LIMIT_BYTES / 1024 / 1024} MiB hard limit`)
}

for (const cacheName of Object.values(PWA_CACHE_NAMES)) {
  if (!serviceWorker.includes(cacheName)) throw new Error(`Service worker is missing cache ${cacheName}`)
}
for (const marker of ['NetworkFirst', 'StaleWhileRevalidate', 'CacheFirst', 'PrecacheFallbackPlugin', 'pwa-cache-cleanup.js']) {
  if (!serviceWorker.includes(marker)) throw new Error(`Service worker is missing ${marker}`)
}
if (!serviceWorker.includes('search-index-')) throw new Error('Service worker is missing the search-index runtime rule')

console.log(
  `PWA check passed: ${baseURL} · ${precacheEntries.length} precache entries · ${precacheBytes} bytes · ${offlineFile.size} byte offline fallback`
)
