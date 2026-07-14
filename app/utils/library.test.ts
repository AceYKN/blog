import { describe, expect, it } from 'vitest'
import { catalogue, searchNotes, type LibraryEntry } from './library'

function entry(id: string, path: string, title?: string): LibraryEntry {
  return { id, path, title }
}

const entries: LibraryEntry[] = [
  // course indexes (title should be usable as a directory-label fallback)
  entry('source/cs/index.md', '/source/cs', 'Computer Science'),
  entry('source/cs/os/index.md', '/source/cs/os', 'Operating Systems'),
  entry('source/cs/unknown/index.md', '/source/cs/unknown', 'Unknown Course'),
  // real notes
  entry('source/cs/os/notes/chap2.md', '/source/cs/os/notes/chap2', 'Chap 2 筆記'),
  entry('source/cs/os/notes/chap3.md', '/source/cs/os/notes/chap3', 'Chap 3 筆記'),
  entry('source/cs/unknown/intro.md', '/source/cs/unknown/intro', 'Intro'),
  entry('source/math/abstract_algebra/ring.md', '/source/math/abstract_algebra/ring', '環論'),
  entry('source/other-topic/random.md', '/source/other-topic/random', '隨手筆記')
]

describe('catalogue', () => {
  it('excludes course index.md entries from the tree', () => {
    const groups = catalogue(entries)
    const allEntryIds = groups.flatMap((group) => collectEntries(group.tree)).map((item) => item.id)
    expect(allEntryIds).not.toContain('source/cs/index.md')
    expect(allEntryIds).not.toContain('source/cs/os/index.md')
  })

  it('groups entries under their known top-level label', () => {
    const groups = catalogue(entries)
    const cs = groups.find((group) => group.key === 'cs')
    expect(cs?.name).toBe('計算機科學')
    expect(cs?.count).toBe(3)
  })

  it('uses the static directoryLabels override when available', () => {
    const groups = catalogue(entries)
    const cs = groups.find((group) => group.key === 'cs')
    const osNode = cs?.tree.children.find((child) => child.key === 'cs/os')
    expect(osNode?.name).toBe('操作系統')
  })

  it('falls back to the folder`s own index.md title when there is no static label', () => {
    const groups = catalogue(entries)
    const cs = groups.find((group) => group.key === 'cs')
    const unknownNode = cs?.tree.children.find((child) => child.key === 'cs/unknown')
    expect(unknownNode?.name).toBe('Unknown Course')
  })

  it('falls back to the raw folder name when neither a label nor an index.md title exists', () => {
    const groups = catalogue(entries)
    const other = groups.find((group) => group.key === 'other')
    expect(other?.tree.children.some((child) => child.name === 'other-topic')).toBe(true)
  })

  it('groups unrecognised top-level folders under "other"', () => {
    const groups = catalogue(entries)
    const other = groups.find((group) => group.key === 'other')
    expect(other?.name).toBe('其他筆記')
    expect(other?.count).toBe(1)
  })
})

describe('searchNotes', () => {
  it('returns nothing for an empty query', () => {
    expect(searchNotes(entries, '')).toEqual([])
    expect(searchNotes(entries, '   ')).toEqual([])
  })

  it('matches by title', () => {
    const results = searchNotes(entries, '環論')
    expect(results.map((item) => item.title)).toContain('環論')
  })

  it('matches via course aliases even without the literal keyword in the title', () => {
    const results = searchNotes(entries, 'operating system')
    expect(results.some((item) => item.path === '/source/cs/os/notes/chap2')).toBe(true)
  })

  it('excludes course index.md entries from results', () => {
    const results = searchNotes(entries, 'Operating Systems')
    expect(results.map((item) => item.path)).not.toContain('/source/cs/os')
  })

  it('ranks a title match above a body-only match', () => {
    const results = searchNotes(entries, 'chap2')
    expect(results[0]?.path).toBe('/source/cs/os/notes/chap2')
  })
})

function collectEntries(node: {
  entries: LibraryEntry[]
  children: Array<{ entries: LibraryEntry[]; children: unknown[] }>
}): LibraryEntry[] {
  return [...node.entries, ...node.children.flatMap((child) => collectEntries(child as never))]
}
