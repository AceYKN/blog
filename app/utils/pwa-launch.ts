export const PWA_LAST_PAGE_KEY = 'aceykn:pwa-last-page'

const sections = new Set(['/', '/schedule', '/library', '/essays', '/tech', '/projects', '/about'])
const localOrigin = 'https://pwa.invalid'

export function normalizePwaPage(value: string | null): string | null {
  if (!value || value.length > 4096 || !value.startsWith('/') || value.startsWith('//') || /[\\\r\n]/.test(value)) return null
  try {
    const url = new URL(value, localOrigin)
    const path = url.pathname.replace(/\/+$/, '') || '/'
    if (url.origin !== localOrigin || !sections.has(path)) return null
    return `${path}${url.search}${url.hash}`
  } catch {
    return null
  }
}
