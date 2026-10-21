<script setup lang="ts">
import { entryTitle, entryUrl, sourcePath, type LibraryEntry } from '~/utils/library'
import { noteMetadata } from '~/data/note-metadata'
import { repositoryEditUrl } from '~/config/site'
import { readerBody } from '~/utils/content'

definePageMeta({ layout: 'reading', key: (route) => route.path })
useReadingPosition()

const route = useRoute()
const { siteUrl } = useRuntimeConfig().public
const breadcrumb = () => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: `${siteUrl.replace(/\/$/, '')}/` },
    { '@type': 'ListItem', position: 2, name: '課程筆記', item: `${siteUrl.replace(/\/$/, '')}/library` },
    {
      '@type': 'ListItem',
      position: 3,
      name: note.value ? entryTitle(note.value) : '課程筆記',
      item: `${siteUrl.replace(/\/$/, '')}${route.path}`
    }
  ]
})
const slug = computed(() =>
  (Array.isArray(route.params.slug) ? route.params.slug.filter(Boolean).join('/') : route.params.slug || '').replace(/\/+$/, '')
)
const {
  data: entry,
  status,
  error
} = await useAsyncData(
  () => `note:${slug.value}`,
  async () => {
    // Query the document directly. Loading the whole notes collection here
    // serializes every Markdown body into every prerendered note page and can
    // exhaust the build worker's memory as the library grows.
    const originalEntry = await queryCollection('notes').where('stem', '=', `source/${slug.value}`).first()
    return originalEntry || queryCollection('notes').path(`/source/${slug.value}`).first()
  }
)
const note = computed(() => entry.value as LibraryEntry | null)
if (error.value) throw error.value
if (!note.value && status.value === 'success') throw createError({ statusCode: 404, statusMessage: '找不到這篇筆記' })
if (note.value && decodeURIComponent(route.path).replace(/\/$/, '') !== entryUrl(note.value)) {
  await navigateTo({ path: entryUrl(note.value), query: route.query, hash: route.hash }, { redirectCode: 301, replace: true })
}
const metadata = computed(() => (note.value ? noteMetadata[sourcePath(note.value)] : undefined))

useSeoMeta({
  title: () => (note.value ? entryTitle(note.value) : '課程筆記'),
  description: () => (note.value ? note.value.description || sourcePath(note.value) : '載入課程筆記中。'),
  ogTitle: () => (note.value ? entryTitle(note.value) : '課程筆記'),
  ogDescription: () => (note.value ? note.value.description || sourcePath(note.value) : '載入課程筆記中。'),
  ogType: 'article',
  ogUrl: () => `${siteUrl.replace(/\/$/, '')}${route.path}`,
  twitterCard: 'summary_large_image'
})

const lastUpdated = computed(() =>
  metadata.value?.updatedAt
    ? new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(metadata.value.updatedAt))
    : ''
)
const { toc, activeId } = useArticleToc()
const renderedNote = computed(() => (note.value ? readerBody(note.value) : null))

useHead(() => {
  if (!note.value) return {}

  return {
    script: [
      {
        key: 'note-structured-data',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'LearningResource',
              headline: entryTitle(note.value),
              description: note.value.description || sourcePath(note.value),
              dateModified: metadata.value?.updatedAt,
              mainEntityOfPage: `${siteUrl.replace(/\/$/, '')}${route.path}`,
              author: { '@id': `${siteUrl.replace(/\/$/, '')}/#aceykn` },
              publisher: { '@id': `${siteUrl.replace(/\/$/, '')}/#aceykn` },
              isAccessibleForFree: true
            },
            breadcrumb()
          ]
        })
      }
    ]
  }
})
</script>

<template>
  <article v-if="note" class="reader-layout" :data-content-path="entryUrl(note)">
    <div class="reader-main">
      <header class="reader-header">
        <p class="eyebrow">原文筆記</p>
        <CourseNavigation :entry="note" show-jump />
        <h1>{{ entryTitle(note) }}</h1>
        <div v-if="metadata" class="article-meta">
          <time>Last Updated · {{ lastUpdated }}</time
          ><a :href="repositoryEditUrl(metadata.githubPath)" target="_blank" rel="noreferrer">在 GitHub 編集 ↗</a>
        </div>
      </header>
      <ContentRenderer v-if="renderedNote" :value="renderedNote" class="prose">
        <template #empty>
          <div class="prose" data-content-empty="true"><p>這篇筆記尚未補上正文。</p></div>
        </template>
      </ContentRenderer>
      <ContentEnhancements />
      <CourseNavigation :entry="note" :show-breadcrumbs="false" />
    </div>
    <aside v-if="toc.length" class="toc" aria-label="文章目次">
      <p>目次</p>
      <a v-for="item in toc" :key="item.id" :class="[{ active: activeId === item.id }, `depth-${item.depth}`]" :href="`#${item.id}`">{{
        item.text
      }}</a>
    </aside>
  </article>
  <section v-else class="content-shelf">
    <p class="eyebrow">COURSE NOTE</p>
    <h1>{{ status === 'pending' ? '筆記を開いています…' : '找不到這篇筆記' }}</h1>
    <p class="empty-note">{{ status === 'pending' ? '正在讀取原始筆記資料。' : '請從課程筆記頁重新選擇，或確認網址是否正確。' }}</p>
    <NuxtLink v-if="status !== 'pending'" to="/library">返回課程筆記</NuxtLink>
  </section>
</template>
