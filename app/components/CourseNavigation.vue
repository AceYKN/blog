<script setup lang="ts">
import { entryTitle, sectionFor, sourcePath, type LibraryEntry } from '~/utils/library'
import type { SearchDocument, SearchIndex } from '~/utils/search'

const props = withDefaults(
  defineProps<{
    entry: LibraryEntry
    showBreadcrumbs?: boolean
    showJump?: boolean
  }>(),
  { showBreadcrumbs: true, showJump: false }
)
const { data: index } = await useFetch<SearchIndex>('/search-catalog.json', { key: 'site-search-catalogue' })
const query = ref('')
const path = computed(() => sourcePath(props.entry).replace(/\.md$/, ''))
const current = computed(() => index.value?.documents.find((document) => document.kind === 'notes' && document.path === path.value))
const courseNotes = computed(() => {
  const course = current.value?.course
  if (!course) return []
  return (index.value?.documents || [])
    .filter(
      (document): document is SearchDocument => document.kind === 'notes' && document.course === course && !document.path.endsWith('/index')
    )
    .sort((left, right) => left.path.localeCompare(right.path, 'zh-Hant'))
})
const position = computed(() => courseNotes.value.findIndex((document) => document.url === current.value?.url))
const previous = computed(() => (position.value > 0 ? courseNotes.value[position.value - 1] : undefined))
const next = computed(() => (position.value >= 0 ? courseNotes.value[position.value + 1] : undefined))
const filteredCourseNotes = computed(() => {
  const keyword = query.value.trim().toLocaleLowerCase()
  if (!keyword) return courseNotes.value
  return courseNotes.value.filter((document) => `${document.title} ${document.path}`.toLocaleLowerCase().includes(keyword))
})
watch(path, () => {
  query.value = ''
})
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
  <details v-if="showJump && courseNotes.length" class="course-jump">
    <summary>
      <span>本課程筆記</span><small>{{ sectionFor(entry) }} · {{ courseNotes.length }} 篇</small>
    </summary>
    <div class="course-jump__body">
      <label class="course-jump__search"
        ><input v-model="query" type="search" aria-label="篩選本課程筆記" placeholder="篩選章節或關鍵字"
      /></label>
      <div class="course-jump__list">
        <NuxtLink
          v-for="document in filteredCourseNotes"
          :key="document.id"
          :to="document.url"
          :class="{ active: document.url === current?.url }"
          :aria-current="document.url === current?.url ? 'page' : undefined"
          ><strong>{{ document.title }}</strong
          ><small>{{ document.path }}</small></NuxtLink
        >
        <p v-if="!filteredCourseNotes.length" class="empty-note">找不到符合的筆記。</p>
      </div>
    </div>
  </details>
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
