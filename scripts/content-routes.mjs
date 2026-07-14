import { readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const contentRoot = join(process.cwd(), 'content')

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
 * use a different prefix for the migrated my-note collection (`/notes`).
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
      .filter(({ relativePath }) => !relativePath.startsWith('.'))
      .map(({ absolutePath, relativePath }) => ({
        route: `${prefix}/${relativePath.slice(0, -3).split(sep).join('/')}`,
        lastmod: statSync(absolutePath).mtime.toISOString()
      }))
  })
  .sort((left, right) => left.route.localeCompare(right.route))
