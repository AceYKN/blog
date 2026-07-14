import type { Ref } from 'vue'

type ContentPageCollection = 'essays' | 'tech' | 'projects'

/**
 * Loads a single page-type content entry by its collection and route slug.
 * Awaiting this query during SSR is important: each Markdown document is
 * prerendered to readable HTML for search engines and readers without JS.
 */
export function useContentPage(collection: ContentPageCollection) {
  const route = useRoute()
  const slug = computed(() => (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug))
  const { data: entry, status } = useAsyncData(
    () => `${collection}:${slug.value}`,
    () => queryCollection(collection).path(`/${collection}/${slug.value}`).first()
  )
  return { entry: entry as Ref<NonNullable<(typeof entry)['value']> | null>, status }
}
