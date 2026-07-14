<script setup lang="ts">
import { entryTitle, sourcePath, type LibraryEntry } from '~/utils/library'
import { noteMetadata } from '~/data/note-metadata'

definePageMeta({ layout: 'reading' })

const route = useRoute()
const slug = computed(() => (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug))
const { data: entry, status } = useAsyncData(
  () => `note:${slug.value}`,
  async () => {
    // Query the document directly. Loading the whole notes collection here
    // serializes every Markdown body into every prerendered note page and can
    // exhaust the build worker's memory as the library grows.
    const migratedEntry = await queryCollection('notes').path(`/source/${slug.value}`).first()
    return migratedEntry || queryCollection('notes').path(`/${slug.value}`).first()
  }
)
const note = computed(() => entry.value as LibraryEntry | null)
const metadata = computed(() => (note.value ? noteMetadata[sourcePath(note.value)] : undefined))

useSeoMeta({
  title: () => (note.value ? entryTitle(note.value) : '課程筆記'),
  description: () => (note.value ? note.value.description || sourcePath(note.value) : '載入課程筆記中。'),
  ogTitle: () => (note.value ? entryTitle(note.value) : '課程筆記'),
  ogDescription: () => (note.value ? note.value.description || sourcePath(note.value) : '載入課程筆記中。'),
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image'
})

const lastUpdated = computed(() =>
  metadata.value?.updatedAt
    ? new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(metadata.value.updatedAt))
    : ''
)
const { toc, activeId } = useArticleToc()
const { siteUrl } = useRuntimeConfig().public
const renderedNote = computed(() => {
  if (!note.value) return null

  const body = note.value.body as { value?: unknown[] } | undefined
  const nodes = body?.value
  const firstNode = nodes?.[0]
  if (body && nodes && Array.isArray(firstNode) && firstNode[0] === 'h1') {
    return { ...note.value, body: { ...body, value: nodes.slice(1) } }
  }

  return note.value
})

useHead(() => {
  if (!note.value) return {}

  return {
    script: [
      {
        key: 'note-structured-data',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: entryTitle(note.value),
          description: note.value.description || sourcePath(note.value),
          dateModified: metadata.value?.updatedAt,
          mainEntityOfPage: `${siteUrl.replace(/\/$/, '')}${route.path}`,
          author: { '@type': 'Person', name: 'AceYKN' },
          publisher: { '@type': 'Person', name: 'AceYKN' }
        })
      }
    ]
  }
})
</script>

<template>
  <article v-if="note" class="reader-layout">
    <div class="reader-main">
      <header class="reader-header">
        <p class="eyebrow">原文筆記</p>
        <h1>{{ entryTitle(note) }}</h1>
        <p class="reader-path">{{ sourcePath(note) }}</p>
        <div v-if="metadata" class="article-meta">
          <time>Last Updated · {{ lastUpdated }}</time
          ><a :href="`https://github.com/AceYKN/my-note/edit/main/${metadata.githubPath}`" target="_blank" rel="noreferrer"
            >在 GitHub 編集 ↗</a
          >
        </div>
      </header>
      <ContentRenderer v-if="renderedNote" :value="renderedNote" class="prose" />
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
