import { access, readdir, readFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { contentRoutes, tagRoutes } from './content-routes.mjs'
import { parseMarkdown, collectContent } from './content-manifest.mjs'
import { normalizeBaseURL } from './pwa-config.mjs'

const root = process.cwd()
const contentRoot = join(root, 'content')
const outputDirectory = join(root, process.env.NUXT_OUTPUT_DIR || 'dist')
const required = ['title', 'description', 'date', 'updated', 'tags', 'draft', 'cover']
const failures = []
const scope = process.argv[2] || '--source'

if (!['--source', '--dist'].includes(scope)) {
  console.error(`Unknown check scope '${scope}'. Use --source or --dist.`)
  process.exit(2)
}

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (
    await Promise.all(entries.map((entry) => (entry.isDirectory() ? collect(join(directory, entry.name)) : [join(directory, entry.name)])))
  ).flat()
}

function frontmatter(source) {
  return parseMarkdown(source).fields
}

if (scope === '--source') {
  for (const type of ['essays', 'tech', 'projects']) {
    for (const file of (await collect(join(contentRoot, type))).filter((file) => file.endsWith('.md'))) {
      const source = await readFile(file, 'utf8')
      const fields = frontmatter(source)
      const label = relative(root, file)
      for (const field of required)
        if (fields[field] === undefined || fields[field] === '') failures.push(`${label}: missing frontmatter '${field}'`)
      if (typeof fields.draft !== 'boolean') failures.push(`${label}: draft must be true or false`)
      if (!Array.isArray(fields.tags)) failures.push(`${label}: tags must be a YAML list`)
      if (fields.draft === true) continue
      if ((source.match(/^#\s+/gm) || []).length !== 1) failures.push(`${label}: published article must have exactly one H1`)
      for (const image of source.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
        if (!image[1].trim()) failures.push(`${label}: image '${image[2]}' is missing alt text`)
      }
      for (const link of source.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g)) {
        const href = link[1]
        if (!href.startsWith('.') || !href.includes('.md')) continue
        const target = resolve(file, '..', href.split('#')[0])
        try {
          await access(target)
        } catch {
          failures.push(`${label}: internal link '${href}' does not exist`)
        }
      }
    }
  }

  const index = JSON.parse(await readFile(join(root, 'public', 'search-catalog.json'), 'utf8'))
  const publishedMarkdown = contentRoutes.length
  if (index.documents.length !== publishedMarkdown)
    failures.push(`search index has ${index.documents.length} entries; expected ${publishedMarkdown}`)
  const expected = new Set(contentRoutes.map(({ route }) => route))
  for (const document of index.documents) {
    if (!expected.delete(document.url)) failures.push(`Unexpected or duplicate search URL: ${document.url}`)
  }
  for (const missing of expected) failures.push(`Search index is missing ${missing}`)
}

if (scope === '--dist') {
  const decodeText = (text) =>
    text
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#(?:39|x27);/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
  for (const { route, empty } of [...contentRoutes, ...tagRoutes.map((route) => ({ route }))]) {
    const path = decodeURIComponent(route).replace(/^\//, '')
    const candidates = [join(outputDirectory, path, 'index.html'), join(outputDirectory, `${path}.html`)]
    let html
    for (const candidate of candidates) {
      try {
        await access(candidate)
        html = candidate
        break
      } catch {
        // Nuxt output shape depends on route generation settings; try both supported forms.
      }
    }

    if (!html) {
      failures.push(`${route}: sitemap route did not generate HTML`)
      continue
    }

    const page = await readFile(html, 'utf8')
    if (!/<link[^>]+rel="canonical"/i.test(page)) failures.push(`${route}: generated HTML has no canonical link`)
    if (!/application\/ld\+json/i.test(page)) failures.push(`${route}: generated HTML has no JSON-LD`)
    if ((page.match(/<h1[\s>]/gi) || []).length !== 1) failures.push(`${route}: generated HTML must have exactly one H1`)
    const canonical = page.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1]
    if (!canonical || decodeURIComponent(new URL(decodeText(canonical)).pathname).replace(/\/$/, '') !== decodeURIComponent(route))
      failures.push(`${route}: canonical does not match the document URL`)
    if (route.startsWith('/tags/')) {
      const heading = decodeText(page.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '')
      if (heading !== `#${decodeURIComponent(route.slice(6))}`) failures.push(`${route}: tag heading is missing from static HTML`)
    } else {
      const identity = decodeText(page.match(/data-content-path="([^"]+)"/)?.[1] || '')
      if (identity !== route) failures.push(`${route}: rendered document identity does not match`)
      if (page.includes('data-content-empty="true"') && !empty) failures.push(`${route}: a nonempty source rendered an empty body`)
      if (!/<div[^>]+class="[^"]*\bprose\b[^"]*"[^>]*>[\s\S]*?<(?:p|h[2-6]|pre|ul|ol|table|div|blockquote)[\s>]/i.test(page))
        failures.push(`${route}: no rendered article body`)
      if (/找不到這篇|Page not found|FetchError|H3Error/.test(page))
        failures.push(`${route}: generated HTML contains a loading or error fallback`)
    }
  }
  if (normalizeBaseURL(process.env.NUXT_APP_BASE_URL || '/') === '/') {
    const rules = new Map(
      (await readFile(join(outputDirectory, '_redirects'), 'utf8'))
        .trim()
        .split(/\r?\n/)
        .filter((line) => line && !line.startsWith('#'))
        .map((line) => {
          const [source, target, code] = line.split(/\s+/)
          return [decodeURIComponent(source), { target, code }]
        })
    )
    for (const { route } of contentRoutes.filter(({ route }) => route.endsWith('/index'))) {
      const rule = rules.get(route)
      if (!rule || rule.code !== '200' || /(?:\/index\/?|\.html)$/.test(rule.target)) {
        failures.push(`${route}: missing safe Cloudflare index proxy (automatic normalization would redirect this page)`)
        continue
      }
      const target = join(outputDirectory, `${decodeURIComponent(rule.target).replace(/^\//, '')}.html`)
      const page = await readFile(target, 'utf8')
      const identity = decodeText(page.match(/data-content-path="([^"]+)"/)?.[1] || '')
      if (identity !== route) failures.push(`${route}: Cloudflare proxy serves the wrong article`)
    }
  }
  const drafts = collectContent(undefined, { includeDrafts: true }).filter((document) => document.draft)
  if (drafts.length) {
    const publicFiles = await collect(outputDirectory)
    const serialized = publicFiles.filter((file) => /\.(?:html|json|sql|txt|js|mjs|map)$/i.test(file))
    for (const file of serialized) {
      const text = await readFile(file, 'utf8')
      for (const draft of drafts) {
        // Source ids are also present in Content's public database dumps.
        if (text.includes(draft.sourceFile) || text.includes(draft.url))
          failures.push(`${relative(outputDirectory, file)}: draft leaked into public output: ${draft.sourceFile}`)
      }
    }
  }
  const sitemap = await readFile(join(outputDirectory, 'sitemap.xml'), 'utf8')
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decodeText(match[1]))
  const paths = locations.map((location) => decodeURIComponent(new URL(location).pathname))
  for (const route of [...contentRoutes.map((entry) => entry.route), ...tagRoutes.map(decodeURIComponent)]) {
    if (!paths.includes(route)) failures.push(`${route}: missing from sitemap`)
  }
  if (new Set(paths).size !== paths.length) failures.push('Sitemap contains duplicate URLs')
  for (const path of paths) {
    try {
      await access(join(outputDirectory, path.replace(/^\//, ''), 'index.html'))
    } catch {
      failures.push(`${path}: sitemap points to missing HTML (check URL encoding)`)
    }
  }
}

if (failures.length) {
  console.error(`Content checks failed:\n- ${failures.join('\n- ')}`)
  process.exit(1)
}
console.log(
  scope === '--source'
    ? `Source checks passed for ${contentRoutes.length} published documents.`
    : `Generated HTML checks passed for ${contentRoutes.length} content URLs and ${tagRoutes.length} tag URLs.`
)
