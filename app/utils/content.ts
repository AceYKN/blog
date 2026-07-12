export type PersonalEntry = {
  id: string
  path: string
  title?: string
  description?: string
  date?: string
  tags?: string[]
}

export function newestFirst(entries: PersonalEntry[]) {
  return [...entries].sort((left, right) => String(right.date || '').localeCompare(String(left.date || '')))
}

export function allTags(entries: PersonalEntry[]) {
  return [...new Set(entries.flatMap((entry) => entry.tags || []))].sort((left, right) => left.localeCompare(right, 'zh-Hant'))
}
