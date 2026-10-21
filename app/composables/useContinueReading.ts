import catalogue from '~/data/content-catalogue.json'
import { readReadingPosition } from '~/utils/storage'

export function useContinueReading() {
  const entry = ref<{ title: string; url: string } | null>(null)
  onMounted(() => {
    const saved = readReadingPosition()
    let url = saved?.url
    try {
      url = decodeURIComponent(url || '')
    } catch {
      // A legacy URL may contain a literal percent sign.
    }
    const document = catalogue.documents.find((item) => item.url === saved?.url || item.url === url)
    if (document) entry.value = { title: document.title, url: document.url }
  })
  return entry
}
