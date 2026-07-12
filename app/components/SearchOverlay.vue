<script setup lang="ts">
import { entryTitle, entryUrl, sourcePath, tagsFor, type LibraryEntry } from '~/utils/library'

const open = defineModel<boolean>('open', { default: false })
const query = ref('')
const input = ref<HTMLInputElement>()
const { data: entries } = await useAsyncData('search-notes', () => queryCollection('notes').select('id', 'path', 'title', 'description').all())

const results = computed(() => {
  const terms = query.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return (entries.value || []).slice(0, 7)
  return (entries.value || []).filter((entry: LibraryEntry) => {
    const haystack = `${entryTitle(entry)} ${sourcePath(entry)} ${tagsFor(entry).join(' ')}`.toLocaleLowerCase()
    return terms.every((term) => haystack.includes(term))
  }).slice(0, 20)
})

watch(open, async (value) => {
  if (value) { query.value = ''; await nextTick(); input.value?.focus() }
})

const onKeydown = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); open.value = true }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div v-if="open" class="search-backdrop" @click.self="open = false">
    <section class="search-dialog" role="dialog" aria-modal="true" aria-label="搜尋筆記">
      <input ref="input" v-model="query" type="search" placeholder="搜尋標題、路徑或標籤…" @keydown.esc="open = false">
      <div class="search-results">
        <NuxtLink v-for="entry in results" :key="entry.id" :to="entryUrl(entry)" class="search-result">
          <small>{{ sourcePath(entry) }}</small><strong>{{ entryTitle(entry) }}</strong>
          <span>{{ tagsFor(entry).map((tag) => `#${tag}`).join(' ') }}</span>
        </NuxtLink>
        <p v-if="!results.length">沒有相符的筆記。</p>
      </div>
    </section>
  </div>
</template>
