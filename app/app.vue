<script setup lang="ts">
const route = useRoute()
const searchOpen = ref(false)
const readingProgress = ref(0)
const isReading = computed(() => /^\/(notes|essays|tech)\//.test(route.path))

const updateReadingProgress = () => {
  const root = document.documentElement
  const maximum = root.scrollHeight - window.innerHeight
  readingProgress.value = maximum > 0 ? Math.min(100, Math.max(0, (window.scrollY / maximum) * 100)) : 0
}

watch(() => route.fullPath, () => {
  searchOpen.value = false
  nextTick(updateReadingProgress)
})

onMounted(() => { window.addEventListener('scroll', updateReadingProgress, { passive: true }); updateReadingProgress() })
onBeforeUnmount(() => window.removeEventListener('scroll', updateReadingProgress))
</script>

<template>
  <div v-if="isReading" class="reading-progress" :style="{ transform: `scaleX(${readingProgress / 100})` }" aria-hidden="true" />
  <a class="skip-link" href="#main">跳至主要內容</a>
  <header class="site-header">
    <NuxtLink class="wordmark" to="/">blog<span>.</span></NuxtLink>
    <nav aria-label="主要導覽">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/library">課程</NuxtLink>
      <NuxtLink to="/projects">項目</NuxtLink>
      <NuxtLink to="/essays">隨筆</NuxtLink>
      <NuxtLink to="/tech">技術</NuxtLink>
    </nav>
    <button class="search-trigger" type="button" @click="searchOpen = true">搜尋 <kbd>⌘ K</kbd></button>
  </header>
  <main id="main"><NuxtPage /></main>
  <footer class="site-footer"><div class="footer-mark"><NuxtLink class="wordmark" to="/">blog<span>.</span></NuxtLink><p>课程、项目、随笔与技术实践。</p></div><div><p>瀏覽</p><NuxtLink to="/library">課程</NuxtLink><NuxtLink to="/projects">項目</NuxtLink><NuxtLink to="/essays">隨筆</NuxtLink><NuxtLink to="/tech">技術</NuxtLink></div><div><p>連結</p><a href="https://github.com/AceYKN" target="_blank" rel="noreferrer">GitHub ↗</a><NuxtLink to="/about">About me</NuxtLink><span>Markdown 驅動</span></div><small>© 2026 AceYKN<br>Built with Nuxt &amp; Cloudflare Pages.</small></footer>
  <SearchOverlay v-model:open="searchOpen" />
</template>
