import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { format, resolveConfig } from 'prettier'
import { collectContent } from './content-manifest.mjs'
import { contentLastUpdated } from './content-last-updated.mjs'

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

const documents = collectContent().map((document) => ({
  id: `${document.kind}:${document.path}`,
  kind: document.kind,
  course: document.kind === 'notes' ? document.path.split('/').slice(0, 2).join('/') : undefined,
  title: document.title,
  path: document.path,
  url: document.url,
  order: typeof document.fields.order === 'number' ? document.fields.order : undefined,
  description: String(document.fields.description || ''),
  updated: contentLastUpdated(document.file),
  tags: document.tags,
  headings: [...document.content.matchAll(/^#{1,6}\s+(.+)$/gm)].map((match) => match[1].trim()),
  text: plainText(document.content)
}))

async function writeIndex(relativePath, index) {
  const output = join(process.cwd(), relativePath)
  const prettierOptions = (await resolveConfig(output)) ?? {}
  await writeFile(output, await format(JSON.stringify(index), { ...prettierOptions, filepath: output }), 'utf8')
}

await mkdir('public', { recursive: true })
await mkdir('app/data', { recursive: true })
const catalogue = documents.map((document) =>
  Object.fromEntries(Object.entries(document).filter(([key]) => !['headings', 'text'].includes(key)))
)
await writeIndex('public/search-catalog.json', { version: 1, documents: catalogue })
// Navigation must also be available to SSR, where fetching public files can fail.
await writeIndex('app/data/content-catalogue.json', { version: 1, documents: catalogue })
for (const kind of ['notes', 'essays', 'tech', 'projects']) {
  await writeIndex(`public/search-index-${kind}.json`, { version: 1, documents: documents.filter((document) => document.kind === kind) })
}
console.log(`Generated catalogue and scoped indexes for ${documents.length} published documents.`)
