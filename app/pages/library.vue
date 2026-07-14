<script setup lang="ts">
import { catalogue, entryTitle, entryUrl, searchNotes, sourcePath, type LibraryEntry } from '~/utils/library'

const { data: entries } = await useAsyncData('library-notes', () => queryCollection('notes').all())
const allEntries = computed(() => (entries.value || []) as LibraryEntry[])
const groups = computed(() => catalogue(allEntries.value))
const keyword = ref('')
const matches = computed(() => {
  return searchNotes(allEntries.value, keyword.value)
})

useSeoMeta({
  title: '課程筆記',
  description: '操作系統、資料庫系統、演算法、軟體工程、數學等課程筆記與過去問。',
  ogTitle: '課程筆記 · blog',
  ogDescription: '操作系統、資料庫系統、演算法、軟體工程、數學等課程筆記與過去問。',
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <section class="course-heading">
    <p class="eyebrow">COURSES · {{ entries?.length || 0 }} 篇原文</p>
    <h1>課程筆記</h1>
    <p>保持原有的知识结构；先选课程，再展开专题和章节。</p>
  </section>
  <div class="course-layout">
    <aside class="course-nav">
      <p>コース案內</p>
      <details v-for="group in groups" :key="group.key" open>
        <summary>
          {{ group.name }} <small>{{ group.count }}</small>
        </summary>
        <div>
          <LibraryTree v-for="child in group.tree.children" :key="child.key" :node="child" :depth="1" /><NuxtLink
            v-for="entry in group.tree.entries"
            :key="entry.id"
            :to="entryUrl(entry)"
            class="library-entry"
            ><strong>{{ entryTitle(entry) }}</strong></NuxtLink
          >
        </div>
      </details>
    </aside>
    <section class="course-main">
      <label class="course-search"
        ><span>ノートを探す</span><input v-model="keyword" type="search" placeholder="操作系统、chap8、虚拟内存、Vue…"
      ></label>
      <div v-if="keyword" class="course-results">
        <p>{{ matches.length }} 件の結果</p>
        <NuxtLink v-for="entry in matches" :key="entry.id" :to="entryUrl(entry)"
          ><strong>{{ entryTitle(entry) }}</strong
          ><span>{{ sourcePath(entry) }}</span></NuxtLink
        >
        <p v-if="!matches.length" class="empty-note">見つかりません。课程名、章节号或关键词试试。</p>
      </div>
    </section>
  </div>
</template>
