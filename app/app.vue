<script setup lang="ts">
const route = useRoute()
const searchOpen = ref(false)
const readingProgress = ref(0)
const theme = ref<'light' | 'dark'>('light')
const isReading = computed(() => /^\/(notes|essays|tech)\//.test(route.path))
const isDark = computed(() => theme.value === 'dark')

const setTheme = (value: 'light' | 'dark') => {
  theme.value = value
  document.documentElement.dataset.theme = value
  localStorage.setItem('theme', value)
}

const toggleTheme = () => setTheme(isDark.value ? 'light' : 'dark')

const updateReadingProgress = () => {
  const root = document.documentElement
  const maximum = root.scrollHeight - window.innerHeight
  readingProgress.value = maximum > 0 ? Math.min(100, Math.max(0, (window.scrollY / maximum) * 100)) : 0
}

watch(() => route.fullPath, () => {
  searchOpen.value = false
  nextTick(updateReadingProgress)
})

onMounted(() => {
  const stored = localStorage.getItem('theme')
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  theme.value = stored === 'dark' || stored === 'light' ? stored : preferred
  document.documentElement.dataset.theme = theme.value
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
  updateReadingProgress()
})
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
    <div class="header-actions">
      <button class="theme-toggle" type="button" :title="isDark ? '切換至明亮模式' : '切換至深色模式'" @click="toggleTheme">
        <svg v-if="isDark" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" /></svg>
        <span>{{ isDark ? 'Light' : 'Dark' }}</span>
      </button>
      <button class="search-trigger" type="button" @click="searchOpen = true">搜尋 <kbd>⌘ K</kbd></button>
    </div>
  </header>
  <main id="main"><NuxtPage /></main>
  <footer class="site-footer"><div class="footer-mark"><NuxtLink class="wordmark" to="/">blog<span>.</span></NuxtLink><p>课程、项目、随笔与技术实践。</p></div><div><p>瀏覽</p><NuxtLink to="/library">課程</NuxtLink><NuxtLink to="/projects">項目</NuxtLink><NuxtLink to="/essays">隨筆</NuxtLink><NuxtLink to="/tech">技術</NuxtLink></div><div><p>連結</p><a href="https://github.com/AceYKN" target="_blank" rel="noreferrer">GitHub ↗</a><NuxtLink to="/about">About me</NuxtLink><span>Markdown 驅動</span></div><small>© 2026 AceYKN<br>Built with Nuxt &amp; Cloudflare Pages.</small></footer>
  <SearchOverlay v-model:open="searchOpen" />
</template>
