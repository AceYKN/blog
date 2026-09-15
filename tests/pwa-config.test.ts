import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { getManifest } from 'workbox-build'
import { afterEach, describe, expect, it } from 'vitest'
import {
  assertCriticalAssetSizes,
  getCacheCleanupSource,
  getCriticalAssetPaths,
  getCriticalAssetSizes,
  getPrecacheOptions,
  getPwaPaths,
  normalizeBaseURL,
  PWA_CACHE_NAMES
} from '../scripts/pwa-config.mjs'

const temporaryDirectories: string[] = []

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })))
})

describe('PWA paths', () => {
  it('normalizes root and project-site base URLs', () => {
    expect(normalizeBaseURL('/')).toBe('/')
    expect(normalizeBaseURL('/blog')).toBe('/blog/')
    expect(normalizeBaseURL('/blog/')).toBe('/blog/')
    expect(normalizeBaseURL('blog')).toBe('/blog/')
    expect(getPwaPaths('/')).toEqual({
      baseURL: '/',
      manifestURL: '/manifest.webmanifest',
      serviceWorkerURL: '/sw.js',
      offlineURL: '/offline.html'
    })
    expect(getPwaPaths('/blog')).toEqual({
      baseURL: '/blog/',
      manifestURL: '/blog/manifest.webmanifest',
      serviceWorkerURL: '/blog/sw.js',
      offlineURL: '/blog/offline.html'
    })
  })
})

describe('PWA precache inputs', () => {
  it('includes critical JS in Workbox globs with its real size and excludes search indexes', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'aceykn-pwa-config-'))
    temporaryDirectories.push(directory)
    await mkdir(join(directory, '_nuxt'), { recursive: true })
    await writeFile(join(directory, 'index.html'), '<script src="/blog/_nuxt/critical.abc.js?x=1"></script>')
    await writeFile(join(directory, '_nuxt/critical.abc.js'), 'critical-js')
    await writeFile(join(directory, '_nuxt/global.css'), 'global-css')
    await writeFile(join(directory, 'offline.html'), 'offline')
    await writeFile(join(directory, 'search-index-notes.json'), 'must stay runtime-only')

    const criticalPaths = await getCriticalAssetPaths(directory)
    const options = getPrecacheOptions(directory, criticalPaths)
    const result = await getManifest(options)

    expect(criticalPaths).toEqual(['_nuxt/critical.abc.js'])
    expect(options.additionalManifestEntries).toBeUndefined()
    expect(result.manifestEntries?.map((entry) => entry.url)).toContain('_nuxt/critical.abc.js')
    expect(result.manifestEntries?.map((entry) => entry.url)).toContain('offline.html')
    expect(result.manifestEntries?.map((entry) => entry.url)).not.toContain('search-index-notes.json')
    expect(result.size).toBeGreaterThanOrEqual('critical-js'.length + 'global-css'.length + 'offline'.length)
  })

  it('fails the critical-asset guard for an oversized JS file', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'aceykn-pwa-budget-'))
    temporaryDirectories.push(directory)
    await mkdir(join(directory, '_nuxt'), { recursive: true })
    await writeFile(join(directory, 'index.html'), '<script src="/_nuxt/oversized.js"></script>')
    await writeFile(join(directory, '_nuxt/oversized.js'), Buffer.alloc(5 * 1024 * 1024 + 1))

    const criticalPaths = await getCriticalAssetPaths(directory)
    const criticalSizes = await getCriticalAssetSizes(directory, criticalPaths)
    expect(() => assertCriticalAssetSizes(criticalSizes)).toThrow(/Critical JS exceeds/)
  })
})

describe('PWA cache lifecycle', () => {
  it('uses a blog-specific runtime namespace and emits cleanup behavior', () => {
    expect(Object.values(PWA_CACHE_NAMES)).toEqual([
      'aceykn-blog-pages-v1',
      'aceykn-blog-payload-v1',
      'aceykn-blog-search-meta-v1',
      'aceykn-blog-search-index-v1',
      'aceykn-blog-images-v1',
      'aceykn-blog-assets-v1'
    ])
    const cleanupWorker = getCacheCleanupSource({ removeAll: true, unregister: true })
    expect(cleanupWorker).toContain('skipWaiting')
    expect(cleanupWorker).toContain('caches.keys')
    expect(cleanupWorker).toContain('aceykn-blog-')
    expect(cleanupWorker).toContain('caches.delete')
    expect(cleanupWorker).toContain('registration.unregister')
  })
})
