import { access, readdir, readFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { contentRoutes } from './content-routes.mjs'

const root = process.cwd()
const contentRoot = join(root, 'content')
const required = ['title', 'description', 'date', 'updated', 'tags', 'draft', 'cover']
const failures = []

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (
    await Promise.all(entries.map((entry) => (entry.isDirectory() ? collect(join(directory, entry.name)) : [join(directory, entry.name)])))
  ).flat()
}

function frontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return Object.fromEntries(
    (match?.[1] || '')
      .split(/\r?\n/)
      .map((line) => line.match(/^([\w-]+):\s*(.*)$/))
      .filter(Boolean)
      .map(([, key, value]) => [key, value.trim()])
  )
}

for (const type of ['essays', 'tech', 'projects']) {
  for (const file of (await collect(join(contentRoot, type))).filter((file) => file.endsWith('.md'))) {
    const source = await readFile(file, 'utf8')
    const fields = frontmatter(source)
    const label = relative(root, file)
    for (const field of required) if (!fields[field]) failures.push(`${label}: missing frontmatter '${field}'`)
    if (fields.draft && !/^(true|false)$/.test(fields.draft)) failures.push(`${label}: draft must be true or false`)
    if (fields.tags && !/^\[.*\]$/.test(fields.tags)) failures.push(`${label}: tags must be a YAML list`)
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

const index = JSON.parse(await readFile(join(root, 'public', 'search-index.json'), 'utf8'))
const publishedMarkdown = contentRoutes.length
if (index.documents.length !== publishedMarkdown)
  failures.push(`search index has ${index.documents.length} entries; expected ${publishedMarkdown}`)

for (const { route } of contentRoutes) {
  const directory = route.replace(/^\//, '')
  const html = join(root, 'dist', directory, 'index.html')
  try {
    const page = await readFile(html, 'utf8')
    if (!/<link[^>]+rel="canonical"/i.test(page)) failures.push(`${route}: generated HTML has no canonical link`)
    if (!/application\/ld\+json/i.test(page)) failures.push(`${route}: generated HTML has no JSON-LD`)
    if ((page.match(/<h1[\s>]/gi) || []).length !== 1) failures.push(`${route}: generated HTML must have exactly one H1`)
  } catch {
    failures.push(`${route}: sitemap route did not generate HTML at ${relative(root, html)}`)
  }
}

if (failures.length) {
  console.error(`Content checks failed:\n- ${failures.join('\n- ')}`)
  process.exit(1)
}
console.log(`Content checks passed for ${contentRoutes.length} sitemap URLs and ${index.documents.length} search documents.`)
