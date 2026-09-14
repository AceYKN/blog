<script setup lang="ts">
const { updateAvailable, applyUpdate, dismissUpdate } = usePwa()
const applying = ref(false)

async function reloadWithUpdate() {
  applying.value = true
  await applyUpdate()
}
</script>

<template>
  <div v-if="updateAvailable" class="pwa-update-prompt" role="status" aria-live="polite">
    <span>網站已更新</span>
    <div class="pwa-update-prompt__actions">
      <button type="button" @click="dismissUpdate">稍後</button>
      <button type="button" :disabled="applying" @click="reloadWithUpdate">{{ applying ? '準備中…' : '重新載入' }}</button>
    </div>
  </div>
</template>
