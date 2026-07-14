<script setup lang="ts">
import { entryTitle, entryUrl, searchNotes, sourcePath, type LibraryEntry } from '~/utils/library'

const open = defineModel<boolean>('open', { default: false })
const query = ref('')
const input = ref<HTMLInputElement>()
const { data: entries, status } = useAsyncData('search-notes', () => queryCollection('notes').all(), { server: false })

const results = computed(() => {
  const notes = (entries.value || []) as LibraryEntry[]
  if (!query.value.trim()) return notes.slice(0, 7)
  return searchNotes(notes, query.value).slice(0, 20)
})

watch(open, async (value) => {
  if (value) {
    query.value = ''
    await nextTick()
    input.value?.focus()
  }
})

const onKeydown = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    open.value = true
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div v-if="open" class="search-backdrop" @click.self="open = false">
    <section class="search-dialog" role="dialog" aria-modal="true" aria-label="搜尋筆記">
      <input ref="input" v-model="query" type="search" placeholder="搜尋標題、路徑或標籤…" @keydown.esc="open = false" />
      <div class="search-results">
        <p v-if="status === 'pending'">正在讀取筆記索引…</p>
        <NuxtLink v-for="entry in results" :key="entry.id" :to="entryUrl(entry)" class="search-result">
          <small>{{ sourcePath(entry) }}</small
          ><strong>{{ entryTitle(entry) }}</strong>
        </NuxtLink>
        <p v-if="status !== 'pending' && !results.length">沒有相符的筆記。</p>
      </div>
    </section>
  </div>
</template>
