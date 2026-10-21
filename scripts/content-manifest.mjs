import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'
import { parse } from 'yaml'
import { contentIdentity } from '../lib/content-identity.mjs'

export function parseMarkdown(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  const fields = match ? parse(match[1]) || {} : {}
  if (typeof fields !== 'object' || Array.isArray(fields)) throw new Error('Frontmatter must be a mapping')
  return { fields, content: source.slice(match?.[0].length || 0) }
}

export function collectContent(root = join(process.cwd(), 'content'), { includeDrafts = false } = {}) {
  const walk = (directory) => {
    if (!existsSync(directory)) return []
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      if (entry.name.startsWith('.')) return []
      const file = join(directory, entry.name)
      if (entry.isDirectory()) return walk(file)
      if (!entry.isFile() || !entry.name.endsWith('.md')) return []
      const { fields, content } = parseMarkdown(readFileSync(file, 'utf8'))
      const draft = fields.draft === true || fields.draft === 'true'
      if (draft && !includeDrafts) return []
      const sourceFile = relative(root, file).replaceAll('\\', '/')
      const identity = contentIdentity(sourceFile)
      const title = String(fields.title || content.match(/^#\s+(.+)$/m)?.[1] || identity.path.split('/').at(-1))
      const tags = Array.isArray(fields.tags) ? fields.tags.map(String) : []
      return [{ ...identity, sourceFile, file, fields, content, title, tags, draft }]
    })
  }
  return ['source', 'essays', 'tech', 'projects']
    .flatMap((directory) => walk(join(root, directory)))
    .sort((left, right) => left.url.localeCompare(right.url, 'zh-Hant'))
}

/** Exclude drafts before Content creates its public SQLite dumps. */
export function draftSourceFiles() {
  return (
    collectContent(undefined, { includeDrafts: true })
      .filter((document) => document.draft)
      // Content interprets excludes as globs; source filenames may contain [].
      .map((document) => document.sourceFile.replace(/[()[\]{}?*+!@]/g, '\\$&'))
  )
}
