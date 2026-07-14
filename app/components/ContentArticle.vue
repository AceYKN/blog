<script setup lang="ts">
const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirrors ContentRenderer's own permissive `value` prop type
  entry: Record<string, any> & { title?: string; description?: string; path?: string; date?: string; image?: string; tags?: string[] }
}>()
const githubPath = computed(() => (props.entry.path ? `content${props.entry.path}.md` : ''))
const { toc, activeId } = useArticleToc()

useSeoMeta({
  title: () => props.entry.title,
  description: () => props.entry.description,
  ogTitle: () => props.entry.title,
  ogDescription: () => props.entry.description,
  ogImage: () => props.entry.image || '/og-image.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <article class="reader-layout standalone-article">
    <div class="reader-main">
      <header class="reader-header">
        <p class="eyebrow">個人站內容</p>
        <h1>{{ entry.title }}</h1>
        <p v-if="entry.description" class="reader-path">{{ entry.description }}</p>
        <div class="article-meta">
          <time>Last Updated · {{ entry.date || '—' }}</time
          ><a v-if="githubPath" :href="`https://github.com/AceYKN/blog/edit/main/${githubPath}`" target="_blank" rel="noreferrer"
            >在 GitHub 編集 ↗</a
          >
        </div>
        <div v-if="entry.tags?.length" class="tag-list">
          <NuxtLink v-for="tag in entry.tags" :key="tag" :to="`/tags/${encodeURIComponent(tag)}`">#{{ tag }}</NuxtLink>
        </div>
      </header>
      <ContentRenderer :value="entry" class="prose" />
    </div>
    <aside v-if="toc.length" class="toc" aria-label="文章目次">
      <p>目次</p>
      <a v-for="item in toc" :key="item.id" :class="[{ active: activeId === item.id }, `depth-${item.depth}`]" :href="`#${item.id}`">{{
        item.text
      }}</a>
    </aside>
  </article>
</template>
