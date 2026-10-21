<script setup lang="ts">
import { repositoryEditUrl } from '~/config/site'
import { absoluteSiteUrl } from '~/utils/url'
import { readerBody } from '~/utils/content'
import { sourceFileForEntry, publicContentUrl } from '../../lib/content-identity.mjs'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirrors ContentRenderer's own permissive `value` prop type
  entry: Record<string, any> & {
    title?: string
    description?: string
    path?: string
    date?: string
    updated?: string
    cover?: string
    tags?: string[]
    body?: unknown
  }
}>()
const githubPath = computed(() => (props.entry.path ? `content/${sourceFileForEntry(props.entry)}` : ''))
const { toc, activeId } = useArticleToc()
const { siteUrl } = useRuntimeConfig().public
const route = useRoute()
const absoluteUrl = (value: string) => (value.startsWith('http') ? value : absoluteSiteUrl(siteUrl, value))
const breadcrumb = () => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首頁', item: `${siteUrl.replace(/\/$/, '')}/` },
    {
      '@type': 'ListItem',
      position: 2,
      name: route.path.split('/')[1] || '內容',
      item: `${siteUrl.replace(/\/$/, '')}/${route.path.split('/')[1]}`
    },
    { '@type': 'ListItem', position: 3, name: props.entry.title, item: `${siteUrl.replace(/\/$/, '')}${route.path}` }
  ]
})
const renderedEntry = computed(() => readerBody(props.entry))

useHead(() => ({
  script: [
    {
      key: 'article-structured-data',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BlogPosting',
            headline: props.entry.title,
            description: props.entry.description,
            datePublished: props.entry.date,
            dateModified: props.entry.updated || props.entry.date,
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
}))

useSeoMeta({
  title: () => props.entry.title,
  description: () => props.entry.description,
  ogTitle: () => props.entry.title,
  ogDescription: () => props.entry.description,
  ogType: 'article',
  ogUrl: () => `${siteUrl.replace(/\/$/, '')}${route.path}`,
  ogImage: () => absoluteUrl(props.entry.cover || '/og-image.png'),
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <article class="reader-layout standalone-article" :data-content-path="publicContentUrl(entry)">
    <div class="reader-main">
      <header class="reader-header">
        <p class="eyebrow">個人站內容</p>
        <h1>{{ entry.title }}</h1>
        <p v-if="entry.description" class="reader-path">{{ entry.description }}</p>
        <div class="article-meta">
          <time>Last Updated · {{ entry.updated || entry.date || '—' }}</time
          ><a v-if="githubPath" :href="repositoryEditUrl(githubPath)" target="_blank" rel="noreferrer">在 GitHub 編集 ↗</a>
        </div>
        <div v-if="entry.tags?.length" class="tag-list">
          <NuxtLink v-for="tag in entry.tags" :key="tag" :to="`/tags/${encodeURIComponent(tag)}`">#{{ tag }}</NuxtLink>
        </div>
      </header>
      <ContentRenderer :value="renderedEntry" class="prose" />
      <ContentEnhancements />
    </div>
    <aside v-if="toc.length" class="toc" aria-label="文章目次">
      <p>目次</p>
      <a v-for="item in toc" :key="item.id" :class="[{ active: activeId === item.id }, `depth-${item.depth}`]" :href="`#${item.id}`">{{
        item.text
      }}</a>
    </aside>
  </article>
</template>
