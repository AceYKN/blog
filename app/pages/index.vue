<script setup lang="ts">
import { newestFirst, type PersonalEntry } from '~/utils/content'

const { data: essays } = await useAsyncData('home-essays', () => queryCollection('essays').select('id', 'path', 'title', 'description', 'date', 'tags').all())
const { data: tech } = await useAsyncData('home-tech', () => queryCollection('tech').select('id', 'path', 'title', 'description', 'date', 'tags').all())
const recent = computed(() => newestFirst([...(essays.value || []), ...(tech.value || [])] as PersonalEntry[]).slice(0, 6))
const search = ref('')
const submitSearch = () => { const query = search.value.trim(); if (query) window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer') }
</script>

<template>
  <section class="home-utilities" aria-label="現在與常用入口"><NowPanel /><form class="quick-search" @submit.prevent="submitSearch"><label for="global-search">快速搜尋</label><div class="search-shell"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg><input id="global-search" v-model="search" type="search" placeholder="Google 搜尋"><button type="submit" aria-label="搜尋">↗</button></div><nav aria-label="常用連結"><a href="https://www.google.com/" target="_blank" rel="noreferrer" title="Google" aria-label="Google"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M20 12h-8v5" /></svg></a><a href="https://github.com/AceYKN" target="_blank" rel="noreferrer" title="GitHub" aria-label="GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.62-.19.62-.43v-1.68c-2.53.55-3.06-1.07-3.06-1.07-.41-1.05-1.01-1.33-1.01-1.33-.83-.56.06-.55.06-.55.91.06 1.4.94 1.4.94.82 1.4 2.14 1 2.66.76.08-.59.32-1 .58-1.23-2.02-.23-4.15-1.01-4.15-4.49 0-1 .36-1.8.94-2.43-.09-.23-.41-1.17.09-2.42 0 0 .77-.25 2.5.93A8.7 8.7 0 0 1 12 7.3c.77 0 1.54.1 2.27.31 1.73-1.18 2.5-.93 2.5-.93.5 1.25.18 2.19.09 2.42.58.63.94 1.43.94 2.43 0 3.49-2.13 4.26-4.16 4.49.33.28.62.81.62 1.63v2.42c0 .24.16.52.63.43A9 9 0 0 0 12 3Z" /></svg></a><a href="https://codeforces.com/" target="_blank" rel="noreferrer" title="Codeforces" aria-label="Codeforces"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18V9m6 9V5m6 13v-7" /></svg></a></nav></form></section>

  <section class="home-feed"><header><p class="eyebrow">RECENTLY UPDATED</p><h2>最近更新</h2></header><div v-if="recent.length" class="editorial-list"><NuxtLink v-for="entry in recent" :key="entry.id" :to="entry.path"><time>{{ entry.date || '未標日期' }}</time><strong>{{ entry.title }}</strong><span>{{ entry.description }}</span></NuxtLink></div><div v-else class="editorial-empty"><p>这里会按时间呈现随笔与技术文章。</p><NuxtLink to="/essays">写第一篇随笔 ↗</NuxtLink><NuxtLink to="/tech">写第一篇技术文章 ↗</NuxtLink></div></section>

  <section class="home-projects"><header><p class="eyebrow">GITHUB / ACEYKN</p><h2>項目</h2><NuxtLink to="/projects">查看所有公開倉庫 ↗</NuxtLink></header><GithubProjects :limit="3" /></section>

  <section class="about-me"><div><p class="eyebrow">ABOUT ME</p><h2>嗨，我是 AceYKN。</h2></div><p>这里是我的个人空间：课程笔记、代码项目、技术实践，也留下一些生活中的想法和片刻。</p><a href="https://github.com/AceYKN" target="_blank" rel="noreferrer">GitHub / AceYKN ↗</a></section>
</template>
