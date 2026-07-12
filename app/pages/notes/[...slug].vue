<script setup lang="ts">
import { entryTitle, sourcePath, type LibraryEntry } from '~/utils/library'
import { noteMetadata } from '~/data/note-metadata'

const route = useRoute()
const slug = computed(() => Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug)
const { data: entry } = await useAsyncData(() => `note:${slug.value}`, () => queryCollection('notes').path(`/source/${slug.value}`).first())
if (!entry.value) throw createError({ statusCode: 404, statusMessage: '找不到這篇筆記' })
const note = computed(() => entry.value as LibraryEntry)
const metadata = computed(() => noteMetadata[sourcePath(note.value)])
const lastUpdated = computed(() => metadata.value?.updatedAt ? new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(metadata.value.updatedAt)) : '')
const toc = ref<Array<{ id: string; text: string; depth: number }>>([])
const activeId = ref('')
let observer: IntersectionObserver | undefined

onMounted(async () => {
  await nextTick()
  const headings = [...document.querySelectorAll<HTMLElement>('.prose h2, .prose h3')]
  toc.value = headings.map((heading) => ({ id: heading.id, text: heading.textContent?.trim() || '', depth: Number(heading.tagName.slice(1)) })).filter((item) => item.id && item.text)
  activeId.value = toc.value[0]?.id || ''
  observer = new IntersectionObserver((observations) => {
    const visible = observations.filter((item) => item.isIntersecting).sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)
    if (visible[0]?.target.id) activeId.value = visible[0].target.id
  }, { rootMargin: '-18% 0px -70% 0px', threshold: 0 })
  headings.forEach((heading) => observer?.observe(heading))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <article class="reader-layout">
    <div class="reader-main"><header class="reader-header"><p class="eyebrow">原文筆記</p><h1>{{ entryTitle(note) }}</h1><p class="reader-path">{{ sourcePath(note) }}</p><div v-if="metadata" class="article-meta"><time>Last Updated · {{ lastUpdated }}</time><a :href="`https://github.com/AceYKN/my-note/edit/main/${metadata.githubPath}`" target="_blank" rel="noreferrer">在 GitHub 編集 ↗</a></div></header><ContentRenderer :value="entry" class="prose" /></div>
    <aside v-if="toc.length" class="toc" aria-label="文章目次"><p>目次</p><a v-for="item in toc" :key="item.id" :class="[{ active: activeId === item.id }, `depth-${item.depth}`]" :href="`#${item.id}`">{{ item.text }}</a></aside>
  </article>
</template>
