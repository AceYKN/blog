import { readFile, stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { getManifest } from 'workbox-build'
import { getCriticalAssets, getPwaPaths, getPrecacheOptions, normalizeBaseURL, PWA_CACHE_NAMES } from './pwa-config.mjs'

const root = process.cwd()
const distDirectory = resolve(root, process.env.PWA_DIST_DIR || 'dist')
const baseURL = normalizeBaseURL(process.env.NUXT_APP_BASE_URL || '/')
const paths = getPwaPaths(baseURL)

if (process.env.NUXT_PUBLIC_PWA_ENABLED === 'false') {
  console.log('PWA check skipped because NUXT_PUBLIC_PWA_ENABLED=false')
  process.exit(0)
}

async function readRequired(relativePath) {
  try {
    const details = await stat(join(distDirectory, relativePath))
    if (!details.isFile() || details.size === 0) throw new Error('empty')
    return details
  } catch (error) {
    throw new Error(`Missing PWA output: ${relativePath}`, { cause: error })
  }
}

const manifestFile = await readRequired('manifest.webmanifest')
const serviceWorkerFile = await readRequired('sw.js')
const offlineFile = await readRequired('offline.html')
const faviconFile = await readRequired('favicon.png')
const indexFile = await readRequired('index.html')
const manifest = JSON.parse(await readFile(join(distDirectory, 'manifest.webmanifest'), 'utf8'))
const serviceWorker = await readFile(join(distDirectory, 'sw.js'), 'utf8')
const offline = await readFile(join(distDirectory, 'offline.html'), 'utf8')
const indexHTML = await readFile(join(distDirectory, 'index.html'), 'utf8')

const expectedIcons = [
  ['pwa/icon-192.png', 192, 100 * 1024],
  ['pwa/icon-512.png', 512, 250 * 1024],
  ['pwa/icon-maskable-512.png', 512, 250 * 1024],
  ['pwa/apple-touch-icon.png', 180, 150 * 1024]
]
for (const [relativePath, expectedSize, maxBytes] of expectedIcons) {
  const details = await readRequired(relativePath)
  if (details.size > maxBytes) throw new Error(`${relativePath} exceeds its ${maxBytes} byte budget`)
  const png = await readFile(join(distDirectory, relativePath))
  if (png.readUInt32BE(0) !== 0x89504e47 || png.readUInt32BE(4) !== 0x0d0a1a0a) throw new Error(`${relativePath} is not a PNG`)
  const width = png.readUInt32BE(16)
  const height = png.readUInt32BE(20)
  if (width !== expectedSize || height !== expectedSize)
    throw new Error(`${relativePath} must be ${expectedSize}x${expectedSize}, got ${width}x${height}`)
}

const requiredManifest = {
  name: 'AceYKN Notes',
  short_name: 'AceYKN',
  start_url: paths.baseURL,
  scope: paths.baseURL,
  display: 'standalone'
}
for (const [key, expected] of Object.entries(requiredManifest)) {
  if (manifest[key] !== expected)
    throw new Error(`Manifest ${key} must be ${JSON.stringify(expected)}, got ${JSON.stringify(manifest[key])}`)
}
if (manifest.theme_color !== '#f5f1e6') throw new Error('Manifest theme_color must be #f5f1e6')
if (!Array.isArray(manifest.icons) || manifest.icons.length < 3) throw new Error('Manifest must expose the three PWA icons')
if (faviconFile.size >= 100 * 1024) throw new Error('favicon.png exceeds the 100 KiB budget')
if (manifestFile.size >= 5 * 1024) throw new Error('manifest.webmanifest exceeds the 5 KiB budget')
if (indexFile.size === 0 || offlineFile.size === 0 || serviceWorkerFile.size === 0)
  throw new Error('index.html, offline.html, and sw.js must be non-empty')
if (!indexHTML.includes(`href="${paths.manifestURL}"`)) throw new Error(`index.html must reference ${paths.manifestURL}`)
if (!indexHTML.includes(`href="${paths.baseURL}pwa/apple-touch-icon.png"`)) {
  throw new Error(`index.html must reference ${paths.baseURL}pwa/apple-touch-icon.png`)
}
const assetReferences = [...indexHTML.matchAll(/(?:src|href)=["']([^"']*_nuxt\/[^"']+)["']/g)].map((match) => match[1])
const expectedAssetPrefix = `${paths.baseURL}_nuxt/`
if (!assetReferences.length || assetReferences.some((reference) => !reference.startsWith(expectedAssetPrefix))) {
  throw new Error(`index.html contains a Nuxt asset outside ${expectedAssetPrefix}`)
}
if (/<script\s+src=/i.test(offline) || /https?:\/\//i.test(offline)) {
  throw new Error('offline.html must not depend on external scripts, fonts, or styles')
}
if (!offline.includes(`location.href = '${paths.baseURL}'`) || offline.includes('__PWA_BASE_URL__')) {
  throw new Error(`offline.html must resolve its home action to ${paths.baseURL}`)
}

const criticalAssets = await getCriticalAssets(distDirectory)
const precacheResult = await getManifest(getPrecacheOptions(distDirectory, criticalAssets))
const precacheEntries = precacheResult.manifestEntries || []
if (!precacheEntries.some((entry) => entry.url.endsWith('offline.html'))) throw new Error('offline.html is not in precache')
if (precacheEntries.some((entry) => /search-index-(?:notes|essays|tech|projects)\.json/.test(entry.url))) {
  throw new Error('Search index found in initial precache')
}

for (const cacheName of Object.values(PWA_CACHE_NAMES)) {
  if (!serviceWorker.includes(cacheName)) throw new Error(`Service worker is missing cache ${cacheName}`)
}
for (const marker of ['NetworkFirst', 'StaleWhileRevalidate', 'CacheFirst', 'PrecacheFallbackPlugin']) {
  if (!serviceWorker.includes(marker)) throw new Error(`Service worker is missing ${marker}`)
}
if (!serviceWorker.includes('search-index-')) throw new Error('Service worker is missing the search-index runtime rule')

console.log(`PWA check passed: ${baseURL} · ${precacheEntries.length} precache entries · ${offlineFile.size} byte offline fallback`)
