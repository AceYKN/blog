export type SearchDocument = {
  id: string
  kind: 'notes' | 'essays' | 'tech' | 'projects'
  course?: string
  title: string
  path: string
  url: string
  headings: string[]
  text: string
}

export type SearchIndex = { version: number; documents: SearchDocument[] }
export type SearchResult = SearchDocument & { score: number; snippet: string }

function normalize(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_\-/.()[\]{}]/g, '')
}

function editDistance(left: string, right: string) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let row = 1; row <= left.length; row++) {
    let diagonal = previous[0] ?? 0
    previous[0] = row
    for (let column = 1; column <= right.length; column++) {
      const nextDiagonal = previous[column] ?? 0
      previous[column] = Math.min(
        nextDiagonal + 1,
        (previous[column - 1] ?? 0) + 1,
        diagonal + (left[row - 1] === right[column - 1] ? 0 : 1)
      )
      diagonal = nextDiagonal
    }
  }
  return previous[right.length] ?? 0
}

function includesOrFuzzy(haystack: string, term: string) {
  if (haystack.includes(term)) return true
  if (term.length < 4) return false
  return haystack.split(/[^\p{L}\p{N}]+/u).some((word) => word.length >= term.length - 1 && editDistance(normalize(word), term) <= 1)
}

function excerpt(text: string, terms: string[]) {
  const normalized = text.toLocaleLowerCase()
  const at = terms.map((term) => normalized.indexOf(term)).find((position) => position >= 0) ?? 0
  const start = Math.max(0, at - 64)
  const end = Math.min(text.length, at + 150)
  return `${start ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`
}

export function searchIndex(
  index: SearchIndex | null | undefined,
  query: string,
  options: { kind?: SearchDocument['kind']; course?: string } = {}
) {
  const terms = query.trim().split(/\s+/).map(normalize).filter(Boolean)
  if (!index || !terms.length) return [] as SearchResult[]

  return index.documents
    .filter((document) => (!options.kind || document.kind === options.kind) && (!options.course || document.course === options.course))
    .map((document) => {
      const title = normalize(document.title)
      const path = normalize(document.path)
      const headings = normalize(document.headings.join(' '))
      const text = normalize(document.text)
      const matches = terms.every(
        (term) =>
          includesOrFuzzy(title, term) || includesOrFuzzy(path, term) || includesOrFuzzy(headings, term) || includesOrFuzzy(text, term)
      )
      const score = terms.reduce(
        (total, term) =>
          total +
          (title.includes(term) ? 100 : 0) +
          (path.includes(term) ? 70 : 0) +
          (headings.includes(term) ? 50 : 0) +
          (text.includes(term) ? 10 : 0),
        0
      )
      return { ...document, score, matches, snippet: excerpt(document.text, terms) }
    })
    .filter((result) => result.matches)
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title, 'zh-Hant'))
    .slice(0, 30)
}

export function highlightParts(value: string, query: string) {
  const terms = query.trim().split(/\s+/).filter(Boolean)
  if (!terms.length) return [{ text: value, match: false }]
  const matcher = new RegExp(`(${terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'ig')
  return value
    .split(matcher)
    .filter(Boolean)
    .map((text) => ({ text, match: terms.some((term) => text.localeCompare(term, undefined, { sensitivity: 'accent' }) === 0) }))
}
