<script setup lang="ts">
const props = defineProps<{ entry: Record<string, unknown> & { title?: string; description?: string; path?: string; date?: string } }>()
const githubPath = computed(() => props.entry.path ? `content${props.entry.path}.md` : '')
</script>

<template>
  <article class="reader-layout standalone-article">
    <div class="reader-main"><header class="reader-header"><p class="eyebrow">個人站內容</p><h1>{{ entry.title }}</h1><p v-if="entry.description" class="reader-path">{{ entry.description }}</p><div class="article-meta"><time>Last Updated · {{ entry.date || '—' }}</time><a v-if="githubPath" :href="`https://github.com/AceYKN/blog/edit/main/${githubPath}`" target="_blank" rel="noreferrer">在 GitHub 編集 ↗</a></div></header><ContentRenderer :value="entry" class="prose" /></div>
  </article>
</template>
