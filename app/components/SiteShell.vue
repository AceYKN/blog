<script setup lang="ts">
const props = withDefaults(defineProps<{ reading?: boolean }>(), { reading: false })
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
  <ReadingProgress v-if="props.reading" />
  <a class="skip-link" href="#main">跳至主要內容</a>
  <AppHeader />
  <main id="main"><slot /></main>
  <AppFooter />
  <SearchOverlay v-model:open="searchOpen" />
</template>
