import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const root = join(process.cwd(), 'content')
const output = join(process.cwd(), 'public', 'search-index.json')
const sources = [
  { directory: 'source', kind: 'notes', prefix: '/notes' },
  { directory: 'essays', kind: 'essays', prefix: '/essays' },
  { directory: 'tech', kind: 'tech', prefix: '/tech' },
  { directory: 'projects', kind: 'projects', prefix: '/projects' }
]

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory() ? collect(join(directory, entry.name)) : entry.name.endsWith('.md') ? [join(directory, entry.name)] : []
    )
  )
  return files.flat()
}

function frontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  const fields = Object.fromEntries(
    (match?.[1] || '')
      .split(/\r?\n/)
      .map((line) => line.match(/^([\w-]+):\s*(.*)$/))
      .filter(Boolean)
      .map(([, key, value]) => [key, value.trim().replace(/^['"]|['"]$/g, '')])
  )
  return { fields, content: source.slice(match?.[0].length || 0) }
}

function plainText(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[`*_>#|~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function courseFor(path) {
  const parts = path.split('/')
  return parts.length >= 2 ? parts.slice(0, 2).join('/') : parts[0]
}

const documents = []
for (const source of sources) {
  const directory = join(root, source.directory)
  for (const file of await collect(directory)) {
    const raw = await readFile(file, 'utf8')
    const { fields, content } = frontmatter(raw)
    if (fields.draft === 'true') continue
    const relativePath = relative(directory, file).split(sep).join('/').replace(/\.md$/, '')
    const headings = [...content.matchAll(/^#{1,6}\s+(.+)$/gm)].map((match) => match[1].trim())
    const title = fields.title || headings[0] || relativePath.split('/').at(-1)
    documents.push({
      id: `${source.kind}:${relativePath}`,
      kind: source.kind,
      course: source.kind === 'notes' ? courseFor(relativePath) : undefined,
      title,
      path: relativePath,
      url: `${source.prefix}/${relativePath}`,
      headings,
      text: plainText(content)
    })
  }
}

documents.sort((left, right) => left.url.localeCompare(right.url, 'zh-Hant'))
await mkdir(join(process.cwd(), 'public'), { recursive: true })
await writeFile(output, `${JSON.stringify({ version: 1, documents }, null, 2)}\n`, 'utf8')
console.log(`Generated search index for ${documents.length} published documents.`)
