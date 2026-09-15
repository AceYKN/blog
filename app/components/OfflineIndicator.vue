<script setup lang="ts">
const { enabled, offline } = usePwa()
</script>

<template>
  <p v-if="enabled && offline" class="offline-indicator" role="status" aria-live="polite">OFFLINE · 僅顯示已儲存內容</p>
</template>
