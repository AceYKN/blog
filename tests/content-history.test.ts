import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { expect, it } from 'vitest'
import { contentLastUpdated } from '../scripts/content-last-updated.mjs'

it('recovers historical content dates from a shallow checkout without changing HEAD or local edits', () => {
  const directory = mkdtempSync(join(tmpdir(), 'blog-history-'))
  if (!resolve(directory).startsWith(resolve(tmpdir()) + sep)) throw new Error('Unexpected temporary directory')
  const seed = join(directory, 'seed')
  const checkout = join(directory, 'checkout')
  const script = fileURLToPath(new URL('../scripts/prepare-content-history.mjs', import.meta.url))
  const git = (cwd: string, args: string[], date = '2026-07-12T12:10:29Z') =>
    execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date }
    }).trim()
  try {
    mkdirSync(seed)
    git(seed, ['init'])
    writeFileSync(join(seed, 'note.md'), '# Historical note\n')
    git(seed, ['add', 'note.md'])
    git(seed, ['-c', 'user.name=Content test', '-c', 'user.email=test@example.invalid', 'commit', '-m', 'add note'])
    writeFileSync(join(seed, 'unrelated.txt'), 'Later change\n')
    git(seed, ['add', 'unrelated.txt'])
    git(
      seed,
      ['-c', 'user.name=Content test', '-c', 'user.email=test@example.invalid', 'commit', '-m', 'unrelated change'],
      '2026-10-20T12:00:00Z'
    )
    git(directory, ['clone', '--depth=1', pathToFileURL(seed).href, checkout])
    const originalHead = git(checkout, ['rev-parse', 'HEAD'])
    writeFileSync(join(checkout, 'unrelated.txt'), 'Preserve local edit\n')
    expect(() => contentLastUpdated(join(checkout, 'note.md'), checkout)).toThrow('complete Git history')

    execFileSync(process.execPath, [script], { cwd: checkout, stdio: 'pipe' })

    expect(git(checkout, ['rev-parse', '--is-shallow-repository'])).toBe('false')
    expect(git(checkout, ['rev-parse', 'HEAD'])).toBe(originalHead)
    expect(readFileSync(join(checkout, 'unrelated.txt'), 'utf8')).toBe('Preserve local edit\n')
    expect(contentLastUpdated(join(checkout, 'note.md'), checkout)).toBe('2026-07-12T12:10:29.000Z')

    // A complete checkout needs no reachable origin on subsequent builds.
    git(checkout, ['remote', 'remove', 'origin'])
    execFileSync(process.execPath, [script], { cwd: checkout, stdio: 'pipe' })
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
}, 30_000)
