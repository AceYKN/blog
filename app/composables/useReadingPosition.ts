import { articleReadingKey, normalizeReadingUrl, readingKey, readReadingPosition, writeStorage } from '~/utils/storage'

/** Restore before enabling saves, so the first layout/scroll event cannot erase a saved position. */
export function useReadingPosition() {
  const route = useRoute()
  const url = normalizeReadingUrl(route.path)
  let ready = false
  let disposed = false
  let frame = 0

  function save() {
    if (!ready) return
    const maximum = document.documentElement.scrollHeight - window.innerHeight
    const position = JSON.stringify({
      url,
      y: window.scrollY,
      progress: maximum > 0 ? Math.min(100, (window.scrollY / maximum) * 100) : 0,
      updatedAt: Date.now()
    })
    writeStorage(articleReadingKey(url), position)
    writeStorage(readingKey, position)
  }

  function onScroll() {
    if (!ready || frame) return
    frame = requestAnimationFrame(() => {
      frame = 0
      save()
    })
  }

  onMounted(async () => {
    await nextTick()
    // Vue Router applies its own scroll behavior after the page renders.
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
    if (disposed || normalizeReadingUrl(route.path) !== url) return
    const saved = readReadingPosition(articleReadingKey(url)) || readReadingPosition()
    if (!route.hash && (saved?.url === url || saved?.url === route.path)) window.scrollTo({ top: saved.y, behavior: 'instant' })
    ready = true
    save()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', save)
  })
  onBeforeRouteLeave(() => {
    save()
    ready = false
    disposed = true
  })
  onBeforeUnmount(() => {
    save()
    ready = false
    disposed = true
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('pagehide', save)
  })
}
