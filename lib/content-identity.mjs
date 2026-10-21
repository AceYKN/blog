const prefixes = { source: 'notes', essays: 'essays', tech: 'tech', projects: 'projects' }

/** Shared by build scripts and the app; public URLs are independent of Content's slugifier. */
export function contentIdentity(sourceFile) {
  const file = sourceFile.replaceAll('\\', '/').replace(/^\/?(?:content\/)?/, '')
  const [directory, ...parts] = file.replace(/\.md$/, '').split('/')
  const kind = prefixes[directory]
  if (!kind || !parts.length) throw new Error(`Unknown content source: ${sourceFile}`)
  const path = parts.join('/')
  return { kind, directory, path, stem: `${directory}/${path}`, url: `/${kind}/${path}` }
}

export function sourceFileForEntry(entry) {
  if (entry.stem) return `${entry.stem}.md`
  const id = entry.id?.replace(/^notes\//, '')
  if (id?.startsWith('source/')) return id
  if (id && /^(essays|tech|projects)\//.test(id)) return id.replace(/^([^/]+)\/\1\//, '$1/')
  return `${entry.path.replace(/^\//, '')}.md`
}

export function publicContentUrl(entry) {
  return contentIdentity(sourceFileForEntry(entry)).url
}

export function tagUrl(tag) {
  return `/tags/${encodeURIComponent(tag)}`
}

export function compareContentOrder(left, right) {
  const leftGroup = left.path.slice(0, left.path.lastIndexOf('/'))
  const rightGroup = right.path.slice(0, right.path.lastIndexOf('/'))
  const group = leftGroup.localeCompare(rightGroup, 'zh-Hant', { numeric: true })
  return (
    group ||
    (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER) ||
    left.path.localeCompare(right.path, 'zh-Hant', { numeric: true })
  )
}
