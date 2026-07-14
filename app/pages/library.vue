<script setup lang="ts">
import { catalogue, entryTitle, entryUrl, type LibraryEntry } from '~/utils/library'
import { highlightParts, searchIndex, type SearchIndex } from '~/utils/search'

const { data: entries } = await useAsyncData('library-notes', () => queryCollection('notes').all())
const allEntries = computed(() => (entries.value || []) as LibraryEntry[])
const groups = computed(() => catalogue(allEntries.value))
const keyword = ref('')
const index = ref<SearchIndex>()
const isLoadingIndex = ref(false)
const matches = computed(() => searchIndex(index.value, keyword.value))
const continueReading = ref<{ url: string; title: string } | null>(null)

async function loadNotesIndex() {
  if (index.value || isLoadingIndex.value) return
  isLoadingIndex.value = true
  try {
    index.value = await $fetch<SearchIndex>('/search-index-notes.json')
  } finally {
    isLoadingIndex.value = false
  }
}

watch(keyword, (value) => {
  if (value.trim()) void loadNotesIndex()
})

onMounted(async () => {
  try {
    const saved = JSON.parse(localStorage.getItem('blog:reading-progress-v1') || 'null') as { url?: string } | null
    const catalogue = await $fetch<SearchIndex>('/search-catalog.json')
    const entry = catalogue.documents.find((document) => document.url === saved?.url && document.kind === 'notes')
    if (entry) continueReading.value = { url: entry.url, title: entry.title }
  } catch {
    continueReading.value = null
  }
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
      <details v-for="group in groups" :key="group.key">
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
      <NuxtLink v-if="continueReading" :to="continueReading.url" class="continue-reading"
        >繼續閱讀 <strong>{{ continueReading.title }}</strong> →</NuxtLink
      >
      <label class="course-search"
        ><span>ノートを探す</span
        ><input v-model="keyword" type="search" placeholder="操作系统、chap8、虚拟内存、Vue…" @focus="loadNotesIndex" />
      </label>
      <div v-if="keyword" class="course-results">
        <p v-if="isLoadingIndex">正在讀取課程筆記索引…</p>
        <template v-else>
          <p>{{ matches.length }} 件の結果</p>
          <NuxtLink v-for="entry in matches" :key="entry.id" :to="entry.url"
            ><strong
              ><template v-for="part in highlightParts(entry.title, keyword)" :key="part.text"
                ><mark v-if="part.match">{{ part.text }}</mark
                ><template v-else>{{ part.text }}</template></template
              ></strong
            ><span>{{ entry.path }}</span
            ><em>{{ entry.snippet }}</em></NuxtLink
          >
          <p v-if="!matches.length" class="empty-note">見つかりません。课程名、章节号或关键词试试。</p>
        </template>
      </div>
    </section>
  </div>
</template>
