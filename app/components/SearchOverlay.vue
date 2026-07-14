<script setup lang="ts">
import { highlightParts, searchIndex, type SearchIndex } from '~/utils/search'

const open = defineModel<boolean>('open', { default: false })
const query = ref('')
const input = ref<HTMLInputElement>()
const { data: index, status } = await useFetch<SearchIndex>('/search-index.json', { key: 'site-search-index' })

const results = computed(() => {
  if (!query.value.trim()) return (index.value?.documents || []).slice(0, 7).map((document) => ({ ...document, snippet: '' }))
  return searchIndex(index.value, query.value).slice(0, 20)
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
      <input ref="input" v-model="query" type="search" placeholder="搜尋標題、路徑、章節或正文…" @keydown.esc="open = false" />
      <div class="search-results">
        <p v-if="status === 'pending'">正在讀取筆記索引…</p>
        <NuxtLink v-for="entry in results" :key="entry.id" :to="entry.url" class="search-result" @click="open = false">
          <small>{{ entry.kind }} / {{ entry.path }}</small
          ><strong
            ><template v-for="part in highlightParts(entry.title, query)" :key="part.text"
              ><mark v-if="part.match">{{ part.text }}</mark
              ><template v-else>{{ part.text }}</template></template
            ></strong
          ><span v-if="entry.snippet"
            ><template v-for="part in highlightParts(entry.snippet, query)" :key="part.text"
              ><mark v-if="part.match">{{ part.text }}</mark
              ><template v-else>{{ part.text }}</template></template
            ></span
          >
        </NuxtLink>
        <p v-if="status !== 'pending' && !results.length">沒有相符的筆記。</p>
      </div>
    </section>
  </div>
</template>
