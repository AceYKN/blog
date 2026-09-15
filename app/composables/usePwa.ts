import { withBasePath } from '~/utils/url'

type InstallOutcome = 'accepted' | 'dismissed'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: InstallOutcome; platform: string }>
}

type NavigatorWithStandalone = Navigator & { standalone?: boolean }

interface PwaState {
  supported: boolean
  installed: boolean
  canInstall: boolean
  offline: boolean
  updateAvailable: boolean
  offlineReady: boolean
}

const INSTALL_DISMISSED_UNTIL = 'aceykn:pwa-install-dismissed-until'
const OFFLINE_READY_SHOWN = 'aceykn:pwa-offline-ready-shown'
const LAST_UPDATE_CHECK = 'aceykn:pwa-last-update-check'
const DISMISS_DURATION = 30 * 24 * 60 * 60 * 1000
const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000

let initialized = false
let registration: ServiceWorkerRegistration | null = null
let deferredInstallPrompt: BeforeInstallPromptEvent | null = null
let reloadAfterUpdate = false
let visibilityListenerInstalled = false

function isIosDevice() {
  if (import.meta.server) return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

function isIosSafari() {
  if (!isIosDevice()) return false
  const userAgent = navigator.userAgent
  return /safari/i.test(userAgent) && !/crios|fxios|edgios|opios|duckduckgo|gsa/i.test(userAgent)
}

function isStandalone() {
  if (import.meta.server) return false
  return window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as NavigatorWithStandalone).standalone)
}

function isInstallDismissed() {
  try {
    return Number(localStorage.getItem(INSTALL_DISMISSED_UNTIL) || 0) > Date.now()
  } catch {
    return false
  }
}

function rememberInstallDismissal() {
  try {
    localStorage.setItem(INSTALL_DISMISSED_UNTIL, String(Date.now() + DISMISS_DURATION))
  } catch {
    // Installation remains available if local storage is unavailable.
  }
}

function updateThemeColor(theme: 'light' | 'dark') {
  if (import.meta.server) return
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  meta?.setAttribute('content', theme === 'dark' ? '#161914' : '#f5f1e6')
}

export function usePwa() {
  const state = useState<PwaState>('aceykn-pwa-state', () => ({
    supported: false,
    installed: false,
    canInstall: false,
    offline: false,
    updateAvailable: false,
    offlineReady: false
  }))
  const config = useRuntimeConfig()
  const baseURL = config.app.baseURL
  const publicConfig = config.public as typeof config.public & { pwaEnabled?: boolean; pwaDev?: boolean; siteUrl?: string }
  const pwaEnabled = publicConfig.pwaEnabled !== false
  const ios = computed(() => isIosSafari())
  const canonicalOrigin = computed(() => {
    if (import.meta.server || !publicConfig.siteUrl) return false
    try {
      return window.location.origin === new URL(publicConfig.siteUrl).origin
    } catch {
      return false
    }
  })

  const setOffline = (value: boolean) => {
    state.value.offline = value
  }

  const setInstalled = () => {
    state.value.installed = true
    state.value.canInstall = false
    deferredInstallPrompt = null
  }

  const handleBeforeInstallPrompt = (event: Event) => {
    const installEvent = event as BeforeInstallPromptEvent
    if (
      !pwaEnabled ||
      !canonicalOrigin.value ||
      (import.meta.dev && publicConfig.pwaDev !== true) ||
      state.value.installed ||
      isInstallDismissed()
    ) {
      installEvent.preventDefault()
      return
    }
    installEvent.preventDefault()
    deferredInstallPrompt = installEvent
    state.value.canInstall = true
  }

  const handleUpdateFound = () => {
    const installing = registration?.installing
    if (!installing) return
    installing.addEventListener('statechange', () => {
      if (installing.state === 'installed' && registration?.waiting && navigator.serviceWorker.controller) {
        state.value.updateAvailable = true
      }
    })
  }

  const showOfflineReadyOnce = () => {
    try {
      if (localStorage.getItem(OFFLINE_READY_SHOWN)) return
      localStorage.setItem(OFFLINE_READY_SHOWN, '1')
      state.value.offlineReady = true
    } catch {
      // The site remains usable when browser storage is unavailable.
    }
  }

  const checkForUpdate = async () => {
    if (!registration) return
    try {
      await registration.update()
      try {
        localStorage.setItem(LAST_UPDATE_CHECK, String(Date.now()))
      } catch {
        // A failed local write does not affect service-worker updates.
      }
    } catch {
      // Updating is progressive enhancement; a network or private-mode error is harmless.
    }
  }

  const install = async () => {
    if (!deferredInstallPrompt) return
    const prompt = deferredInstallPrompt
    deferredInstallPrompt = null
    state.value.canInstall = false
    try {
      await prompt.prompt()
      const choice = await prompt.userChoice
      if (choice.outcome === 'dismissed') rememberInstallDismissal()
    } catch {
      // The browser can reject the prompt when installation is no longer available.
    }
  }

  const applyUpdate = async (): Promise<boolean> => {
    const waiting = registration?.waiting
    if (!waiting) {
      state.value.updateAvailable = false
      return false
    }
    reloadAfterUpdate = true
    state.value.updateAvailable = false
    try {
      waiting.postMessage({ type: 'SKIP_WAITING' })
      return true
    } catch {
      reloadAfterUpdate = false
      return false
    }
  }

  const dismissUpdate = () => {
    state.value.updateAvailable = false
  }

  const dismissOfflineReady = () => {
    state.value.offlineReady = false
  }

  const waitForController = async () => {
    if (navigator.serviceWorker.controller) return true
    return new Promise<boolean>((resolve) => {
      const timeout = window.setTimeout(() => resolve(false), 5000)
      navigator.serviceWorker.addEventListener(
        'controllerchange',
        () => {
          window.clearTimeout(timeout)
          resolve(true)
        },
        { once: true }
      )
    })
  }

  const cacheCurrentPage = async () => {
    if (!navigator.onLine || window.location.origin !== location.origin || !navigator.serviceWorker.controller) return false
    try {
      const response = await fetch(window.location.href, {
        cache: 'no-store',
        credentials: 'same-origin',
        headers: { accept: 'text/html' }
      })
      if (!response.ok || response.type !== 'basic') return false

      const resources = performance
        .getEntriesByType('resource')
        .map((entry) => new URL(entry.name, window.location.href))
        .filter((url) => url.origin === window.location.origin)
        .filter((url) => {
          if (url.pathname.endsWith('/sw.js') || url.pathname.endsWith('/manifest.webmanifest')) return false
          return url.pathname.includes('/_nuxt/') || url.pathname.endsWith('.json')
        })

      await Promise.allSettled(
        [...new Set(resources.map((url) => url.href))].map((url) => fetch(url, { cache: 'no-store', credentials: 'same-origin' }))
      )

      return true
    } catch {
      return false
    }
  }

  const initialize = async () => {
    if (initialized || import.meta.server) return
    initialized = true
    state.value.offline = !navigator.onLine
    state.value.installed = isStandalone()
    window.addEventListener('online', () => setOffline(false))
    window.addEventListener('offline', () => setOffline(true))
    window.addEventListener('appinstalled', setInstalled)
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('blog:themechange', () => {
      const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
      updateThemeColor(theme)
    })

    if (!pwaEnabled || (import.meta.dev && publicConfig.pwaDev !== true) || !('serviceWorker' in navigator)) return

    state.value.supported = true
    const serviceWorkerURL = withBasePath(baseURL, '/sw.js')
    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register(serviceWorkerURL, { scope: baseURL })
        registration.addEventListener('updatefound', handleUpdateFound)
        if (registration.waiting && navigator.serviceWorker.controller) state.value.updateAvailable = true
        await navigator.serviceWorker.ready
        if ((await waitForController()) && (await cacheCurrentPage())) showOfflineReadyOnce()
      } catch {
        state.value.supported = false
      }
    }

    if (document.readyState === 'complete') void register()
    else window.addEventListener('load', () => void register(), { once: true })

    if (!visibilityListenerInstalled) {
      visibilityListenerInstalled = true
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') return
        try {
          const lastCheck = Number(localStorage.getItem(LAST_UPDATE_CHECK) || 0)
          if (Date.now() - lastCheck > UPDATE_CHECK_INTERVAL) void checkForUpdate()
        } catch {
          void checkForUpdate()
        }
      })
    }

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!reloadAfterUpdate) return
      reloadAfterUpdate = false
      window.location.reload()
    })
  }

  return {
    enabled: computed(() => pwaEnabled),
    supported: computed(() => state.value.supported),
    installed: computed(() => state.value.installed),
    canInstall: computed(() => state.value.canInstall),
    offline: computed(() => state.value.offline),
    updateAvailable: computed(() => state.value.updateAvailable),
    offlineReady: computed(() => state.value.offlineReady),
    ios,
    canonicalOrigin,
    initialize,
    install,
    applyUpdate,
    dismissUpdate,
    dismissOfflineReady,
    checkForUpdate
  }
}
