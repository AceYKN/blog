import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { collectContent } from '../scripts/content-manifest.mjs'
import { contentIdentity, publicContentUrl, compareContentOrder } from '../lib/content-identity.mjs'
import { newestFirst, readerBody, resolveContentLink } from '../app/utils/content'
import { searchIndex } from '../app/utils/search'

const temporary: string[] = []
afterEach(() => temporary.splice(0).forEach((path) => rmSync(path, { recursive: true, force: true })))

describe('published content identity', () => {
  it.each(['source/cs/os/HW/chap2-hw.md', 'source/cs/db/tutorial/01-数据库基础与关系模型.md', 'source/cs/os/index.md'])(
    'preserves original filename in %s even when Content normalizes its path',
    (file) => {
      expect(publicContentUrl({ id: `notes/${file}`, path: '/source/normalized' })).toBe(contentIdentity(file).url)
      expect(publicContentUrl({ stem: file.replace(/\.md$/, ''), path: '/source/normalized' })).toBe(contentIdentity(file).url)
    }
  )

  it('uses YAML types and excludes drafts from both routes and tag inputs', () => {
    const directory = mkdtempSync(join(tmpdir(), 'blog-content-'))
    temporary.push(directory)
    mkdirSync(join(directory, 'tech'))
    writeFileSync(
      join(directory, 'tech', 'public.md'),
      '---\ntitle: "Published: YAML"\ntags:\n  - 中文\n  - Web\ndraft: false\n---\n# Public\n'
    )
    writeFileSync(
      join(directory, 'tech', 'secret.md'),
      '---\ntitle: Private sentinel\ntags: [private-only]\ndraft: true # do not publish\n---\nPrivate text\n'
    )
    const published = collectContent(directory)
    expect(published.map((entry: { url: string }) => entry.url)).toEqual(['/tech/public'])
    expect(published[0].tags).toEqual(['中文', 'Web'])
    expect(collectContent(directory, { includeDrafts: true })).toHaveLength(2)
  })

  it('sorts chapter numbers within groups and respects explicit order', () => {
    const documents = [{ path: 'notes/chap11' }, { path: 'HW/chap3' }, { path: 'notes/chap2' }, { path: 'HW/chap2' }]
    expect(documents.sort(compareContentOrder).map((entry) => entry.path)).toEqual(['HW/chap2', 'HW/chap3', 'notes/chap2', 'notes/chap11'])
    expect([{ path: 'a/chap2' }, { path: 'a/chap11', order: 1 }].sort(compareContentOrder)[0]?.path).toBe('a/chap11')
  })

  it('demotes nested H1s without mutating the original body and repairs legacy index links', () => {
    const entry = {
      stem: 'source/index',
      body: {
        value: [
          ['h1', {}, 'Title'],
          ['div', {}, ['h1', {}, 'Nested']]
        ]
      }
    }
    expect(readerBody(entry).body.value).toEqual([['div', {}, ['h2', {}, 'Nested']]])
    expect(entry.body.value[1]?.[2]).toEqual(['h1', {}, 'Nested'])
    expect(resolveContentLink('/cs/os/', '/notes/index')).toBe('/notes/cs/os/index')
    expect(resolveContentLink('https://example.org/cs/', '/notes/index')).toBe('https://example.org/cs/')
  })

  it('orders recent entries by their last update', () => {
    const old = { id: 'old', path: '/old', date: '2020-01-01', updated: '2026-10-20' }
    const recent = { id: 'recent', path: '/recent', date: '2026-10-19' }
    expect(newestFirst([recent, old])[0]).toBe(old)
  })

  it('finds a typo inside long body text without treating the entire body as one fuzzy word', () => {
    const index = {
      version: 1,
      documents: [
        {
          id: 'n',
          kind: 'notes' as const,
          title: 'A chapter',
          path: 'chapter',
          url: '/notes/chapter',
          text: `${'background '.repeat(10000)} semaphore synchronization`
        }
      ]
    }
    expect(searchIndex(index, 'semaphor')[0]?.id).toBe('n')
    expect(searchIndex(index, 'unrelated')).toEqual([])
  })
})
