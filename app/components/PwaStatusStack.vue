<script setup lang="ts">
const { enabled, offline, offlineReady, updateAvailable, dismissOfflineReady } = usePwa()
let offlineReadyTimer: ReturnType<typeof setTimeout> | undefined

const showStack = computed(() => enabled.value && (offline.value || offlineReady.value || updateAvailable.value))

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
  <div v-if="showStack" class="pwa-status-stack">
    <PwaUpdatePrompt />
    <OfflineIndicator />
    <p v-if="offlineReady" class="pwa-ready-notice" role="status" aria-live="polite">已可離線閱讀目前內容</p>
  </div>
</template>
