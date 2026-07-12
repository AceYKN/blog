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

const courseLabels: Record<string, string> = {
  'cs/os': '操作系統',
  'cs/db': '資料庫系統',
  'cs/algo': '演算法',
  'cs/se': '軟體工程',
  'cs/dm': '離散數學',
  'code/vue': 'Vue',
  code: '程式設計',
  math: '數學',
  language: '語言'
}

const topLevelLabels: Record<string, string> = {
  cs: '計算機科學',
  code: '程式設計',
  language: '言語',
  math: '數學'
}

// Mirrors the navigational names already used by my-note's VitePress sidebar.
// Paths remain untouched; this only makes the reader-facing tree intelligible.
const directoryLabels: Record<string, string> = {
  abstract_algebra: '抽象代數',
  math_analysis: '數學分析',
  ode: '常微分方程',
  os: '操作系統',
  algo: '算法設計與分析',
  db: '資料庫系統',
  dm: '離散數學',
  se: '軟體工程',
  vue: 'Vue.js 完整課程',
  deutsch: 'Deutsch',
  nihongo: '日本語',
  'german-for-reading': 'German for Reading',
  notes: 'ノート',
  note: 'ノート',
  notesbychap: '章節ノート',
  review: '復習',
  review202505: '復習 2025',
  testbank: '題庫',
  pastpapers: '過去問',
  HW: '宿題',
  tutorial: '考試導讀',
  '100+70': '100＋70 題庫'
}

const courseAliases: Record<string, string[]> = {
  'cs/os': ['操作系統', '操作系统', 'operating system', 'operating systems', 'os'],
  'cs/db': ['資料庫系統', '数据库系统', '資料庫', '数据库', 'database', 'db'],
  'cs/algo': ['算法設計與分析', '算法设计与分析', '演算法', '算法', 'algorithm', 'algo'],
  'cs/se': ['軟體工程', '软件工程', 'software engineering', 'se'],
  'cs/dm': ['離散數學', '离散数学', 'discrete mathematics', 'dm'],
  'code/vue': ['vue', 'vue.js', 'vuejs'],
  math: ['數學', '数学', 'math'],
  language: ['言語', '語言', '语言', 'language']
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
  return /(?:^|\/)index\.md$/i.test(entry.id) || /^source\/(?:cs|code|language|math)(?:\/[\w+\-]+)*$/i.test(entry.id)
}

export function sectionFor(entry: LibraryEntry) {
  const key = sectionKeyFor(entry)
  return key ? courseLabels[key] : '其他筆記'
}

function sectionKeyFor(entry: LibraryEntry) {
  const path = sourcePath(entry)
  return Object.keys(courseLabels)
    .sort((left, right) => right.length - left.length)
    .find((candidate) => path === candidate || path.startsWith(`${candidate}/`))
}

export function tagsFor(entry: LibraryEntry) {
  const path = sourcePath(entry)
  const tags: string[] = []
  const section = sectionFor(entry)
  if (section !== '其他筆記') tags.push(section)
  if (/pastpapers|testbank|review|HW/i.test(path)) tags.push('題解')
  if (/note|notes|tutorial/i.test(path)) tags.push('課程筆記')
  if (/chap\d+/i.test(path)) tags.push('章節筆記')
  if (path.includes('codeforces')) tags.push('Codeforces')
  return [...new Set(tags)]
}

export function catalogue(entries: LibraryEntry[]): LibraryGroup[] {
  const groups = new Map<string, LibraryGroup>()

  for (const entry of entries.filter((entry) => !isCourseIndex(entry))) {
    const sourceParts = sourcePath(entry).split('/')
    const groupKey = topLevelLabels[sourceParts[0]] ? sourceParts[0] : 'other'
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
        child = { name: directoryLabels[folder] || folder.replace(/_/g, ' '), key: nodeKey, children: [], entries: [] }
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
      const score = terms.reduce((total, term) => total + (titleText.includes(term) ? 100 : 0) + (pathText.includes(term) ? 70 : 0) + (aliasText.includes(term) ? 60 : 0) + (bodyText.includes(term) ? 15 : 0), 0)
      return { entry, score, matches: terms.every((term) => titleText.includes(term) || pathText.includes(term) || aliasText.includes(term) || bodyText.includes(term)) }
    })
    .filter((item) => item.matches)
    .sort((left, right) => right.score - left.score || entryTitle(left.entry).localeCompare(entryTitle(right.entry), 'zh-Hant'))
    .slice(0, 30)
    .map((item) => item.entry)
}
