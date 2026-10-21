import catalogue from '~/data/content-catalogue.json'
import { publicContentUrl, type SourceEntry } from '../../lib/content-identity.mjs'

export type PersonalEntry = {
  id: string
  path: string
  stem?: string
  title?: string
  description?: string
  date?: string
  updated?: string
  tags?: string[]
}

export function newestFirst(entries: PersonalEntry[]) {
  return [...entries].sort((left, right) =>
    String(right.updated || right.date || '').localeCompare(String(left.updated || left.date || ''))
  )
}

/** Keep the page header as the single H1, including headings inside migrated HTML wrappers. */
const contentUrls = new Set(catalogue.documents.map((entry) => entry.url))
export function resolveContentLink(href: string, currentUrl: string): string {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) return href
  const parsed = new URL(href, `https://content.invalid${currentUrl}`)
  let path = decodeURIComponent(parsed.pathname).replace(/\.md$/, '').replace(/\/$/, '')
  if (/^\/(?:source|cs|code|math|language)(?:\/|$)/.test(path))
    path = path.startsWith('/source/') ? path.replace('/source/', '/notes/') : `/notes${path}`
  const target = [path, `${path}/index`].find((candidate) => contentUrls.has(candidate))
  return target ? `${target}${parsed.search}${parsed.hash}` : href
}

export function readerBody<T extends SourceEntry & { body?: unknown }>(entry: T): T {
  const body = entry.body as { value?: unknown[] } | undefined
  if (!body?.value) return entry
  const demote = (node: unknown): unknown => {
    if (!Array.isArray(node)) return node
    const attributes =
      node[0] === 'a' && typeof node[1]?.href === 'string'
        ? { ...node[1], href: resolveContentLink(node[1].href, publicContentUrl(entry)) }
        : node[1]
    return [node[0] === 'h1' ? 'h2' : node[0], attributes, ...node.slice(2).map(demote)]
  }
  const nodes = body.value
  const content = Array.isArray(nodes[0]) && nodes[0][0] === 'h1' ? nodes.slice(1) : nodes
  return { ...entry, body: { ...body, value: content.map(demote) } }
}

export function allTags(entries: PersonalEntry[]) {
  return [...new Set(entries.flatMap((entry) => entry.tags || []))].sort((left, right) => left.localeCompare(right, 'zh-Hant'))
}
