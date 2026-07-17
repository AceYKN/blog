import { readFileSync } from 'node:fs'
import { relative } from 'node:path'
import { execFileSync } from 'node:child_process'

const cache = new Map()

function frontmatterDate(file) {
  const source = readFileSync(file, 'utf8')
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!frontmatter) return null

  for (const field of ['updated', 'date']) {
    const match = frontmatter[1].match(new RegExp(`^${field}:\\s*["']?([^"'\\r\\n]+)["']?\\s*$`, 'm'))
    if (!match) continue
    const value = new Date(match[1].trim())
    if (!Number.isNaN(value.getTime())) return value.toISOString()
  }

  return null
}

function gitDate(file, repositoryRoot) {
  const repositoryPath = relative(repositoryRoot, file).replaceAll('\\', '/')
  try {
    const value = execFileSync('git', ['log', '-1', '--follow', '--format=%cI', '--', repositoryPath], {
      cwd: repositoryRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
    return value ? new Date(value).toISOString() : null
  } catch {
    return null
  }
}

/**
 * Resolve a deterministic content timestamp. Explicit frontmatter is the
 * author-controlled source of truth; committed files otherwise use Git
 * history so a fresh checkout cannot make every page look newly updated.
 */
export function contentLastUpdated(file, repositoryRoot = process.cwd()) {
  const key = `${repositoryRoot}\0${file}`
  if (cache.has(key)) return cache.get(key)

  const updatedAt = frontmatterDate(file) || gitDate(file, repositoryRoot)
  if (!updatedAt) {
    throw new Error(
      `Cannot determine last-updated time for ${relative(repositoryRoot, file)}. Commit the file or add frontmatter 'updated'.`
    )
  }

  cache.set(key, updatedAt)
  return updatedAt
}
