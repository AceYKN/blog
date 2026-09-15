<script setup lang="ts">
const { enabled, canInstall, installed, install, ios } = usePwa()
const showIosHelp = ref(false)
const baseURL = useRuntimeConfig().app.baseURL
const showAction = computed(() => enabled.value && baseURL === '/' && !installed.value && (canInstall.value || ios.value))

function activate() {
  if (ios.value && !canInstall.value) showIosHelp.value = true
  else void install()
}
</script>

<template>
  <div v-if="showAction" class="pwa-install-action">
    <button type="button" title="安裝 AceYKN Notes" @click="activate">Install</button>
    <div v-if="showIosHelp" class="pwa-install-help" role="status">
      <strong>加入主畫面</strong>
      <span>在 Safari 點擊分享，再選擇「加入主畫面」。</span>
      <button type="button" @click="showIosHelp = false">知道了</button>
    </div>
  </div>
</template>
