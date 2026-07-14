import type { Ref } from 'vue'

type ContentPageCollection = 'essays' | 'tech' | 'projects'

/**
 * Loads a single page-type content entry by its collection and route slug.
 * Content is backed by a browser-side SQLite database in this static site, so
 * the page must wait for the database instead of treating its initial empty
 * state as a 404.
 */
export function useContentPage(collection: ContentPageCollection) {
  const route = useRoute()
  const slug = computed(() => (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug))
  const { data: entry, status } = useAsyncData(
    () => `${collection}:${slug.value}`,
    () => queryCollection(collection).path(`/${collection}/${slug.value}`).first(),
    { server: false }
  )
  return { entry: entry as Ref<NonNullable<(typeof entry)['value']> | null>, status }
}
