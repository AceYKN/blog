<script setup lang="ts">
const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- mirrors ContentRenderer's own permissive `value` prop type
  entry: Record<string, any> & { title?: string; description?: string; path?: string; date?: string; image?: string }
}>()
const githubPath = computed(() => (props.entry.path ? `content${props.entry.path}.md` : ''))

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
      </header>
      <ContentRenderer :value="entry" class="prose" />
    </div>
  </article>
</template>
