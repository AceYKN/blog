export function readStorage(key: string): string | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value)
  } catch {
    // Storage is optional, including in private or restricted browsing.
  }
}

export type ReadingPosition = { url: string; y: number; progress: number; updatedAt: number }
export const readingKey = 'blog:reading-progress-v1'
export const articleReadingKey = (url: string) => `blog:reading-position:${url}`

export function readReadingPosition(key = readingKey): ReadingPosition | null {
  try {
    const saved = JSON.parse(readStorage(key) || 'null')
    return saved && typeof saved.url === 'string' && Number.isFinite(saved.y) && saved.y >= 0 ? saved : null
  } catch {
    return null
  }
}
