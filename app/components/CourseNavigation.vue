<script setup lang="ts">
import { entryTitle, sourcePath, type LibraryEntry } from '~/utils/library'
import type { SearchDocument, SearchIndex } from '~/utils/search'

const props = withDefaults(
  defineProps<{
    entry: LibraryEntry
    showBreadcrumbs?: boolean
  }>(),
  { showBreadcrumbs: true }
)
const { data: index } = await useFetch<SearchIndex>('/search-index.json', { key: 'site-search-index' })
const path = computed(() => sourcePath(props.entry).replace(/\.md$/, ''))
const current = computed(() => index.value?.documents.find((document) => document.kind === 'notes' && document.path === path.value))
const courseNotes = computed(() =>
  (index.value?.documents || [])
    .filter(
      (document): document is SearchDocument =>
        document.kind === 'notes' && document.course === current.value?.course && !document.path.endsWith('/index')
    )
    .sort((left, right) => left.path.localeCompare(right.path, 'zh-Hant'))
)
const position = computed(() => courseNotes.value.findIndex((document) => document.url === current.value?.url))
const previous = computed(() => (position.value > 0 ? courseNotes.value[position.value - 1] : undefined))
const next = computed(() => (position.value >= 0 ? courseNotes.value[position.value + 1] : undefined))
const crumbs = computed(() => {
  const parts = path.value.split('/')
  return parts.slice(0, -1).map((part, index) => ({ label: part.replace(/[-_]/g, ' '), to: index === 0 ? '/library' : undefined }))
})
</script>

<template>
  <nav v-if="showBreadcrumbs" class="breadcrumbs" aria-label="麵包屑">
    <NuxtLink to="/library">課程筆記</NuxtLink
    ><span v-for="crumb in crumbs" :key="crumb.label"
      >/ <NuxtLink v-if="crumb.to" :to="crumb.to">{{ crumb.label }}</NuxtLink
      ><span v-else>{{ crumb.label }}</span></span
    ><span>/ {{ entryTitle(entry) }}</span>
  </nav>
  <nav v-if="previous || next" class="course-pagination" aria-label="本課程章節導覽">
    <NuxtLink v-if="previous" :to="previous.url"
      ><small>← 上一頁</small><strong>{{ previous.title }}</strong></NuxtLink
    >
    <span v-else />
    <NuxtLink v-if="next" :to="next.url"
      ><small>下一頁 →</small><strong>{{ next.title }}</strong></NuxtLink
    >
  </nav>
</template>
