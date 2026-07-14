import type { Ref } from 'vue'

type ContentPageCollection = 'essays' | 'tech' | 'projects'

/**
 * Loads a single page-type content entry by its collection and route slug,
 * throwing a 404 error when nothing matches. Shared by essays/tech/projects
 * `[...slug].vue` pages, which only differ by collection name.
 */
export async function useContentPage(collection: ContentPageCollection, notFoundMessage: string) {
  const route = useRoute()
  const slug = computed(() => (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug))
  const { data: entry } = await useAsyncData(
    () => `${collection}:${slug.value}`,
    () => queryCollection(collection).path(`/${collection}/${slug.value}`).first()
  )
  if (!entry.value) throw createError({ statusCode: 404, statusMessage: notFoundMessage })
  return entry as Ref<NonNullable<(typeof entry)['value']>>
}
