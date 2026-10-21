<script setup lang="ts">
import { highlightParts, searchIndex, type SearchIndex } from '~/utils/search'
import { withBasePath } from '~/utils/url'

const open = defineModel<boolean>('open', { default: false })
const baseURL = useRuntimeConfig().app.baseURL
const query = useState('search-overlay-query', () => '')
const settledQuery = ref(query.value)
let debounceTimer: ReturnType<typeof setTimeout> | undefined
const catalogue = ref<SearchIndex>()
const fullIndex = ref<SearchIndex>()
const isLoadingCatalogue = ref(false)
const isLoadingFullIndex = ref(false)
const catalogueError = ref(false)
const fullIndexError = ref(false)
const loadedIndexes = new Map<string, SearchIndex>()

async function loadCatalogue() {
  if (catalogue.value || isLoadingCatalogue.value) return
  isLoadingCatalogue.value = true
  catalogueError.value = false
  try {
    catalogue.value = await $fetch<SearchIndex>(withBasePath(baseURL, '/search-catalog.json'))
  } catch {
    catalogueError.value = true
  } finally {
    isLoadingCatalogue.value = false
  }
}

async function loadFullIndex() {
  if (fullIndex.value || isLoadingFullIndex.value) return
  isLoadingFullIndex.value = true
  fullIndexError.value = false
  try {
    const kinds = ['notes', 'essays', 'tech', 'projects']
    const results = await Promise.allSettled(
      kinds.map(async (kind) => {
        if (!loadedIndexes.has(kind))
          loadedIndexes.set(kind, await $fetch<SearchIndex>(withBasePath(baseURL, `/search-index-${kind}.json`)))
      })
    )
    fullIndexError.value = results.some((result) => result.status === 'rejected')
    if (!fullIndexError.value) fullIndex.value = { version: 1, documents: [...loadedIndexes.values()].flatMap((index) => index.documents) }
  } finally {
    isLoadingFullIndex.value = false
  }
}

const results = computed(() => {
  const index = fullIndex.value || catalogue.value
  if (!settledQuery.value.trim()) return (index?.documents || []).slice(0, 7).map((document) => ({ ...document, snippet: '' }))
  return searchIndex(index, settledQuery.value).slice(0, 20)
})

watch(open, (value) => {
  if (value) {
    settledQuery.value = query.value
    void loadCatalogue()
    if (query.value.trim().length >= 2) void loadFullIndex()
  }
})

watch(query, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    settledQuery.value = value
    if (value.trim().length >= 2) void loadFullIndex()
  }, 120)
})

const onKeydown = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    open.value = true
  }
}

function retryIndexes() {
  void loadCatalogue()
  void loadFullIndex()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  clearTimeout(debounceTimer)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <ModalDialog v-if="open" label="搜尋筆記" class="search-dialog" @close="open = false">
    <div class="search-dialog-header">
      <input v-model="query" autofocus aria-label="搜尋筆記" type="search" placeholder="搜尋標題、路徑、章節或正文…" />
      <button type="button" aria-label="關閉搜尋" @click="open = false">×</button>
    </div>
    <div class="search-results" aria-live="polite">
      <p v-if="isLoadingCatalogue && !catalogue">正在讀取搜尋目錄…</p>
      <p v-else-if="isLoadingFullIndex">正在擴展全文索引…</p>
      <p v-if="catalogueError || fullIndexError" role="status">
        {{ catalogueError ? '搜尋目錄讀取失敗。' : '全文索引未完整載入，目前僅搜尋標題和路徑。' }}
        <button type="button" @click="retryIndexes">重新載入</button>
      </p>
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
      <p v-if="!catalogueError && !fullIndexError && !isLoadingCatalogue && !isLoadingFullIndex && !results.length">沒有相符的筆記。</p>
    </div>
  </ModalDialog>
</template>
