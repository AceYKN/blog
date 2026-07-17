<script setup lang="ts">
import { entryTitle, sourcePath, type LibraryEntry } from '~/utils/library'
import { noteMetadata } from '~/data/note-metadata'
import { repositoryEditUrl } from '~/config/site'

definePageMeta({ layout: 'reading' })

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
const renderedNote = computed(() => {
  if (!note.value) return null

  const body = note.value.body as { value?: unknown[] } | undefined
  const nodes = body?.value
  const firstNode = nodes?.[0]
  if (body && nodes) {
    const withoutDuplicateTitle = Array.isArray(firstNode) && firstNode[0] === 'h1' ? nodes.slice(1) : nodes
    return {
      ...note.value,
      body: {
        ...body,
        value: withoutDuplicateTitle.map((node) => (Array.isArray(node) && node[0] === 'h1' ? ['h2', ...node.slice(1)] : node))
      }
    }
  }

  return note.value
})

onMounted(async () => {
  await nextTick()
  try {
    const saved = JSON.parse(localStorage.getItem('blog:reading-progress-v1') || 'null') as { url?: string; y?: number } | null
    if (saved?.url === route.path && typeof saved.y === 'number' && saved.y > 80) window.scrollTo({ top: saved.y, behavior: 'auto' })
  } catch {
    // Restoring a position is optional when browser storage is unavailable.
  }
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
  <article v-if="note" class="reader-layout">
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
      <ContentRenderer v-if="renderedNote" :value="renderedNote" class="prose" />
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
