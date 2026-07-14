<script setup lang="ts">
const searchOpen = useSearchOverlay()
const theme = ref<'light' | 'dark'>('light')
const isDark = computed(() => theme.value === 'dark')

const setTheme = (value: 'light' | 'dark') => {
  theme.value = value
  document.documentElement.dataset.theme = value
  localStorage.setItem('theme', value)
}

const toggleTheme = () => setTheme(isDark.value ? 'light' : 'dark')

onMounted(() => {
  const stored = localStorage.getItem('theme')
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  setTheme(stored === 'dark' || stored === 'light' ? stored : preferred)
})
</script>

<template>
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
        <svg v-if="isDark" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" /></svg>
        <span>{{ isDark ? 'Light' : 'Dark' }}</span>
      </button>
      <button class="search-trigger" type="button" @click="searchOpen = true">搜尋 <kbd>⌘ K</kbd></button>
    </div>
  </header>
</template>
