<script setup lang="ts">
const { enabled, updateAvailable, applyUpdate, dismissUpdate } = usePwa()
const applying = ref(false)

async function reloadWithUpdate() {
  applying.value = true
  const applied = await applyUpdate()
  if (!applied) applying.value = false
}
</script>

<template>
  <div v-if="enabled && updateAvailable" class="pwa-update-prompt">
    <span role="status" aria-live="polite">網站已更新</span>
    <div class="pwa-update-prompt__actions">
      <button type="button" @click="dismissUpdate">稍後</button>
      <button type="button" :disabled="applying" @click="reloadWithUpdate">{{ applying ? '準備中…' : '重新載入' }}</button>
    </div>
  </div>
</template>
