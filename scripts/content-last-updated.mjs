import { readFileSync } from 'node:fs'
import { relative } from 'node:path'
import { execFileSync } from 'node:child_process'

const cache = new Map()
const historyChecks = new Set()
const historyDates = new Map()

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
  if (!historyChecks.has(repositoryRoot)) {
    const shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: repositoryRoot, encoding: 'utf8' }).trim()
    if (shallow === 'true')
      throw new Error('Content timestamps require complete Git history. Use checkout fetch-depth: 0 or git fetch --unshallow.')
    historyChecks.add(repositoryRoot)
  }
  const repositoryPath = relative(repositoryRoot, file).replaceAll('\\', '/')
  try {
    if (!historyDates.has(repositoryRoot)) {
      const log = execFileSync('git', ['-c', 'core.quotepath=false', 'log', '--format=%x00%cI', '--name-only', '--no-renames'], {
        cwd: repositoryRoot,
        encoding: 'utf8',
        maxBuffer: 16 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'ignore']
      })
      const dates = new Map()
      let date
      for (const line of log.split(/\r?\n/)) {
        if (line.startsWith('\0')) date = new Date(line.slice(1)).toISOString()
        else if (line && date && !dates.has(line)) dates.set(line, date)
      }
      historyDates.set(repositoryRoot, dates)
    }
    return historyDates.get(repositoryRoot).get(repositoryPath) || null
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
