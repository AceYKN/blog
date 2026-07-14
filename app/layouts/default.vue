<script setup lang="ts">
const searchOpen = useSearchOverlay()
const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    searchOpen.value = false
  }
)
</script>

<template>
  <a class="skip-link" href="#main">跳至主要內容</a>
  <AppHeader />
  <main id="main"><slot /></main>
  <AppFooter />
  <SearchOverlay v-model:open="searchOpen" />
</template>
