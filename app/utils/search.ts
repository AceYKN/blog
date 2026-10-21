export type SearchDocument = {
  id: string
  kind: 'notes' | 'essays' | 'tech' | 'projects'
  course?: string
  title: string
  path: string
  url: string
  order?: number
  updated?: string
  description?: string
  headings?: string[]
  text?: string
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

const prepared = new WeakMap<SearchDocument, { fields: string[]; words: string[] }>()

function prepare(document: SearchDocument) {
  const cached = prepared.get(document)
  if (cached) return cached
  const originals = [document.title, document.path, document.headings?.join(' ') || '', document.text || '']
  const value = {
    fields: originals.map(normalize),
    // Split before normalization; punctuation/whitespace removal must not turn an
    // entire chapter into a single word for quadratic edit-distance comparisons.
    words: [
      ...new Set(
        originals
          .join(' ')
          .split(/[^\p{L}\p{N}]+/u)
          .filter((word) => word.length <= 64)
          .map(normalize)
      )
    ]
  }
  prepared.set(document, value)
  return value
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
      const { fields, words } = prepare(document)
      const [title = '', path = '', headings = '', text = ''] = fields
      const matches = terms.every(
        (term) =>
          fields.some((field) => field.includes(term)) ||
          (term.length >= 4 &&
            term.length <= 64 &&
            words.some((word) => Math.abs(word.length - term.length) <= 1 && editDistance(word, term) <= 1))
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
      return { document, score, matches }
    })
    .filter((result) => result.matches)
    .sort((left, right) => right.score - left.score || left.document.title.localeCompare(right.document.title, 'zh-Hant'))
    .slice(0, 30)
    .map(({ document, score }) => ({ ...document, score, snippet: excerpt(document.text || '', terms) }))
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
