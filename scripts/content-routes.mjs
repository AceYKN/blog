import { readFileSync, readdirSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { contentLastUpdated } from './content-last-updated.mjs'

const contentRoot = join(process.cwd(), 'content')

function isDraft(file) {
  return /^---\s*[\s\S]*?^draft:\s*true\s*$/m.test(readFileSync(file, 'utf8'))
}

function collectMarkdown(directory, rootDirectory = directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = join(directory, entry.name)
    if (entry.isDirectory()) return collectMarkdown(absolutePath, rootDirectory)
    if (!entry.isFile() || !entry.name.endsWith('.md')) return []

    const relativePath = relative(rootDirectory, absolutePath)
    return [{ absolutePath, relativePath }]
  })
}

/**
 * The site's content is stored as Markdown, but its public routes intentionally
 * use a dedicated prefix for the learning-note collection (`/notes`).
 * Keeping this manifest at build time lets Nitro render every document to HTML
 * and lets the sitemap describe every public document without changing source
 * files or relying on a client-side crawler.
 */
export const contentRoutes = [
  { directory: 'source', prefix: '/notes' },
  { directory: 'essays', prefix: '/essays' },
  { directory: 'projects', prefix: '/projects' },
  { directory: 'tech', prefix: '/tech' }
]
  .flatMap(({ directory, prefix }) => {
    const directoryPath = join(contentRoot, directory)

    return collectMarkdown(directoryPath)
      .filter(({ absolutePath, relativePath }) => !relativePath.startsWith('.') && !isDraft(absolutePath))
      .map(({ absolutePath, relativePath }) => ({
        route: `${prefix}/${relativePath.slice(0, -3).split(sep).join('/')}`,
        lastmod: contentLastUpdated(absolutePath)
      }))
  })
  .sort((left, right) => left.route.localeCompare(right.route))
