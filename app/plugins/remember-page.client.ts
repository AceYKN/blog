import { normalizePwaPage, PWA_LAST_PAGE_KEY } from '~/utils/pwa-launch'
import { readStorage, writeStorage } from '~/utils/storage'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const { enabled, installed } = usePwa()

  const rememberPage = () => {
    const page = normalizePwaPage(router.currentRoute.value.fullPath)
    if (page) writeStorage(PWA_LAST_PAGE_KEY, page)
  }

  nuxtApp.hook('app:mounted', async () => {
    if (!enabled.value || !installed.value) return

    const savedPage = normalizePwaPage(readStorage(PWA_LAST_PAGE_KEY))
    // Only resume a plain Home Screen launch. Explicit links and in-app Home
    // navigation retain their destination, and hydration finishes first.
    if (router.currentRoute.value.fullPath === '/' && savedPage && savedPage !== '/') {
      try {
        await router.replace(savedPage)
      } catch {
        // Keep the available homepage if the destination cannot be loaded.
        return
      }
    }

    rememberPage()
    router.afterEach((_to, _from, failure) => {
      if (!failure) rememberPage()
    })
  })
})
