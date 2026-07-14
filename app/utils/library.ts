import { courseAliases, courseLabels, directoryLabels, topLevelLabels } from '~/config/courses'

export type LibraryEntry = {
  id: string
  path: string
  title?: string
  description?: string
  body?: { toc?: { links?: Array<{ id: string; text: string; depth: number }> } }
}

export type LibraryTree = {
  name: string
  key: string
  children: LibraryTree[]
  entries: LibraryEntry[]
}

export type LibraryGroup = {
  key: string
  name: string
  tree: LibraryTree
  count: number
}

export function sourcePath(entry: LibraryEntry) {
  return entry.path.replace(/^\/source\//, '').replace(/^\//, '')
}

export function entryTitle(entry: LibraryEntry) {
  return entry.title || sourcePath(entry).split('/').at(-1)?.replace(/\.md$/, '') || '未命名筆記'
}

export function entryUrl(entry: LibraryEntry) {
  return `/notes/${sourcePath(entry).replace(/\.md$/, '')}`
}

export function isCourseIndex(entry: LibraryEntry) {
  return /(?:^|\/)index\.md$/i.test(entry.id) || /^source\/(?:cs|code|language|math)(?:\/[\w+-]+)*$/i.test(entry.id)
}

export function sectionFor(entry: LibraryEntry) {
  const key = sectionKeyFor(entry)
  return (key ? courseLabels[key] : undefined) || '其他筆記'
}

function sectionKeyFor(entry: LibraryEntry) {
  const path = sourcePath(entry)
  return Object.keys(courseLabels)
    .sort((left, right) => right.length - left.length)
    .find((candidate) => path === candidate || path.startsWith(`${candidate}/`))
}

// Builds a `directory path -> title` map from each folder's own index.md, so
// catalogue() can label a directory using its curated title when it has no
// entry in the static `directoryLabels` override map.
function indexTitlesByDirectory(entries: LibraryEntry[]) {
  const map = new Map<string, string>()
  for (const entry of entries) {
    if (!isCourseIndex(entry) || !entry.title) continue
    map.set(sourcePath(entry), entry.title)
  }
  return map
}

export function catalogue(entries: LibraryEntry[]): LibraryGroup[] {
  const groups = new Map<string, LibraryGroup>()
  const indexTitles = indexTitlesByDirectory(entries)

  for (const entry of entries.filter((entry) => !isCourseIndex(entry))) {
    const sourceParts = sourcePath(entry).split('/')
    const firstPart = sourceParts[0] ?? ''
    const groupKey = topLevelLabels[firstPart] ? firstPart : 'other'
    const groupName = topLevelLabels[groupKey] || '其他筆記'
    let group = groups.get(groupKey)

    if (!group) {
      group = {
        key: groupKey,
        name: groupName,
        count: 0,
        tree: { name: groupName, key: groupKey, children: [], entries: [] }
      }
      groups.set(groupKey, group)
    }

    group.count += 1
    const prefixSize = groupKey === 'other' ? 0 : 1
    const folders = sourceParts.slice(prefixSize, -1)
    let node = group.tree

    for (const folder of folders) {
      const nodeKey = `${node.key}/${folder}`
      let child = node.children.find((item) => item.key === nodeKey)
      if (!child) {
        const label = directoryLabels[folder] || indexTitles.get(nodeKey) || folder.replace(/_/g, ' ')
        child = { name: label, key: nodeKey, children: [], entries: [] }
        node.children.push(child)
      }
      node = child
    }
    node.entries.push(entry)
  }

  const sortTree = (node: LibraryTree) => {
    node.children.sort((left, right) => left.name.localeCompare(right.name, 'zh-Hant'))
    node.entries.sort((left, right) => entryTitle(left).localeCompare(entryTitle(right), 'zh-Hant'))
    node.children.forEach(sortTree)
  }

  const result = [...groups.values()]
  result.forEach((group) => sortTree(group.tree))
  return result.sort((left, right) => left.name.localeCompare(right.name, 'zh-Hant'))
}

function flat(value: string) {
  return value.toLocaleLowerCase().replace(/[\s_\-/.()[\]{}]/g, '')
}

export function searchNotes(entries: LibraryEntry[], query: string) {
  const terms = query.trim().split(/\s+/).map(flat).filter(Boolean)
  if (!terms.length) return []
  return entries
    .filter((entry) => !isCourseIndex(entry))
    .map((entry) => {
      const key = sectionKeyFor(entry)
      const path = sourcePath(entry)
      const title = entryTitle(entry)
      const aliases = key ? courseAliases[key] || [] : []
      const body = entry.body ? JSON.stringify(entry.body) : ''
      const titleText = flat(title)
      const pathText = flat(path)
      const aliasText = flat([sectionFor(entry), ...aliases].join(' '))
      const bodyText = flat(body)
      const score = terms.reduce(
        (total, term) =>
          total +
          (titleText.includes(term) ? 100 : 0) +
          (pathText.includes(term) ? 70 : 0) +
          (aliasText.includes(term) ? 60 : 0) +
          (bodyText.includes(term) ? 15 : 0),
        0
      )
      return {
        entry,
        score,
        matches: terms.every(
          (term) => titleText.includes(term) || pathText.includes(term) || aliasText.includes(term) || bodyText.includes(term)
        )
      }
    })
    .filter((item) => item.matches)
    .sort((left, right) => right.score - left.score || entryTitle(left.entry).localeCompare(entryTitle(right.entry), 'zh-Hant'))
    .slice(0, 30)
    .map((item) => item.entry)
}
