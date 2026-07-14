<script setup lang="ts">
import { highlightParts, searchIndex, type SearchIndex } from '~/utils/search'

const open = defineModel<boolean>('open', { default: false })
const query = ref('')
const input = ref<HTMLInputElement>()
const catalogue = ref<SearchIndex>()
const fullIndex = ref<SearchIndex>()
const isLoadingCatalogue = ref(false)
const isLoadingFullIndex = ref(false)

async function loadCatalogue() {
  if (catalogue.value || isLoadingCatalogue.value) return
  isLoadingCatalogue.value = true
  try {
    catalogue.value = await $fetch<SearchIndex>('/search-catalog.json')
  } finally {
    isLoadingCatalogue.value = false
  }
}

async function loadFullIndex() {
  if (fullIndex.value || isLoadingFullIndex.value) return
  isLoadingFullIndex.value = true
  try {
    const indexes = await Promise.all(
      ['notes', 'essays', 'tech', 'projects'].map((kind) => $fetch<SearchIndex>(`/search-index-${kind}.json`))
    )
    fullIndex.value = { version: 1, documents: indexes.flatMap((index) => index.documents) }
  } finally {
    isLoadingFullIndex.value = false
  }
}

const results = computed(() => {
  const index = fullIndex.value || catalogue.value
  if (!query.value.trim()) return (index?.documents || []).slice(0, 7).map((document) => ({ ...document, snippet: '' }))
  return searchIndex(index, query.value).slice(0, 20)
})

watch(open, async (value) => {
  if (value) {
    query.value = ''
    void loadCatalogue()
    await nextTick()
    input.value?.focus()
  }
})

watch(query, (value) => {
  if (value.trim().length >= 2) void loadFullIndex()
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
        <p v-if="isLoadingCatalogue && !catalogue">正在讀取搜尋目錄…</p>
        <p v-else-if="isLoadingFullIndex">正在擴展全文索引…</p>
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
        <p v-if="!isLoadingCatalogue && !isLoadingFullIndex && !results.length">沒有相符的筆記。</p>
      </div>
    </section>
  </div>
</template>
