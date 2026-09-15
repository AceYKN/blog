<script setup lang="ts">
const props = withDefaults(defineProps<{ reading?: boolean }>(), { reading: false })
const searchOpen = useSearchOverlay()
const route = useRoute()
const { offlineReady, dismissOfflineReady } = usePwa()
let offlineReadyTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => route.fullPath,
  () => {
    searchOpen.value = false
  }
)

watch(offlineReady, (value) => {
  if (!value) return
  if (offlineReadyTimer) clearTimeout(offlineReadyTimer)
  offlineReadyTimer = setTimeout(dismissOfflineReady, 5000)
})

onBeforeUnmount(() => {
  if (offlineReadyTimer) clearTimeout(offlineReadyTimer)
})
</script>

<template>
  <ReadingProgress v-if="props.reading" />
  <a class="skip-link" href="#main">跳至主要內容</a>
  <AppHeader />
  <OfflineIndicator />
  <main id="main"><slot /></main>
  <AppFooter />
  <SearchOverlay v-model:open="searchOpen" />
  <PwaUpdatePrompt />
  <p v-if="offlineReady" class="pwa-ready-notice" role="status" aria-live="polite">已可離線閱讀已瀏覽內容</p>
</template>
