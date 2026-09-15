<script setup lang="ts">
import { newestFirst, type PersonalEntry } from '~/utils/content'

const { data: essays } = await useAsyncData('home-essays', () =>
  queryCollection('essays').select('id', 'path', 'title', 'description', 'date', 'tags').all()
)
const { data: tech } = await useAsyncData('home-tech', () =>
  queryCollection('tech').select('id', 'path', 'title', 'description', 'date', 'tags').all()
)
const recent = computed(() => newestFirst([...(essays.value || []), ...(tech.value || [])] as PersonalEntry[]).slice(0, 6))
const search = ref('')
const submitSearch = () => {
  const query = search.value.trim()
  if (query) window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer')
}

useSeoMeta({
  title: '學習筆記、文章與工作紀錄',
  description: '課程筆記、項目、隨筆與技術實踐，一個由 Markdown 驅動的個人站。',
  ogTitle: 'blog — 學習筆記、文章與工作紀錄',
  ogDescription: '課程筆記、項目、隨筆與技術實踐，一個由 Markdown 驅動的個人站。',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <section class="home-utilities" aria-label="現在與常用入口">
    <NowPanel />
    <form class="quick-search" @submit.prevent="submitSearch">
      <label for="global-search">快速搜尋</label>
      <div class="search-shell">
        <input id="global-search" v-model="search" type="search" placeholder="Google 搜尋" />
        <button type="submit" aria-label="搜尋">搜尋 →</button>
      </div>
      <nav aria-label="常用連結">
        <a href="https://github.com/AceYKN" target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href="https://codeforces.com/" target="_blank" rel="noreferrer">Codeforces ↗</a>
      </nav>
    </form>
  </section>

  <section class="home-feed">
    <header>
      <h2>最近更新</h2>
    </header>
    <div v-if="recent.length" class="editorial-list">
      <NuxtLink v-for="entry in recent" :key="entry.id" :to="entry.path"
        ><time>{{ entry.date || '未標日期' }}</time
        ><strong>{{ entry.title }}</strong
        ><span>{{ entry.description }}</span></NuxtLink
      >
    </div>
    <div v-else class="editorial-empty">
      <p>这里会按时间呈现随笔与技术文章。</p>
      <NuxtLink to="/essays">写第一篇随笔 ↗</NuxtLink><NuxtLink to="/tech">写第一篇技术文章 ↗</NuxtLink>
    </div>
  </section>

  <section class="home-projects">
    <header>
      <h2>項目</h2>
      <NuxtLink to="/projects">查看所有公開倉庫 ↗</NuxtLink>
    </header>
    <GithubProjects :limit="3" />
  </section>

  <section class="about-me">
    <div>
      <h2>關於 / AceYKN</h2>
    </div>
    <p>这里是我的个人空间：课程笔记、代码项目、技术实践，也留下一些生活中的想法和片刻。</p>
    <a href="https://github.com/AceYKN" target="_blank" rel="noreferrer">GitHub / AceYKN ↗</a>
  </section>
</template>
