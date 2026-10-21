import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { collectContent } from './content-manifest.mjs'
import { normalizeBaseURL } from './pwa-config.mjs'

const outputDirectory = process.env.NUXT_OUTPUT_DIR || 'dist'
const aliasDirectory = resolve(outputDirectory, '__content_index')
if (relative(resolve(outputDirectory), aliasDirectory) !== '__content_index') throw new Error('Invalid generated alias directory')
await rm(aliasDirectory, { recursive: true, force: true })

// Cloudflare Pages enables its SPA fallback only when the published output
// does not contain a top-level 404.html file. Replace cached redirect rules:
// Nuxt can reuse its output directory between builds.
// GitHub Pages adds its own fallback in the deployment workflow afterwards.
await Promise.all([rm(join(outputDirectory, '404.html'), { force: true }), rm(join(outputDirectory, '_redirects'), { force: true })])

if (normalizeBaseURL(process.env.NUXT_APP_BASE_URL || '/') === '/') {
  const documents = collectContent()
  const urls = new Set(documents.map((document) => document.url))
  const rules = []
  const encodePath = (path) => path.split('/').map(encodeURIComponent).join('/')
  for (const { url } of documents.filter((document) => document.url.endsWith('/index'))) {
    // A proxy target ending in /index or .html would itself be normalized,
    // causing Pages to reject the rule as a redirect loop. Use a neutral alias.
    const target = `/__content_index${url}/page`
    const aliasFile = join(outputDirectory, `${target.slice(1)}.html`)
    await mkdir(dirname(aliasFile), { recursive: true })
    await copyFile(join(outputDirectory, url.slice(1), 'index.html'), aliasFile)
    const paths = [url, `${url}/`]
    const directory = url.slice(0, -'/index'.length)
    // Support old bookmarks and cached automatic /index -> / redirects, but
    // never mask a separately published article at the directory's URL.
    if (!urls.has(directory)) paths.push(directory, `${directory}/`)
    for (const path of paths) rules.push(`${encodePath(path)} ${encodePath(target)} 200`)
  }
  // Explicit 200 proxy rules precede Pages' automatic index normalization.
  // Each response retains the original article's canonical URL and payload.
  if (rules.length) await writeFile(join(outputDirectory, '_redirects'), `${rules.join('\n')}\n`)
}
