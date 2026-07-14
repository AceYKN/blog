export type TocItem = { id: string; text: string; depth: number }

/** Build and track an article's h2–h4 outline after Markdown has rendered. */
export function useArticleToc() {
  const toc = ref<TocItem[]>([])
  const activeId = ref('')
  let observer: IntersectionObserver | undefined

  onMounted(async () => {
    await nextTick()
    const headings = [...document.querySelectorAll<HTMLElement>('.prose h2, .prose h3, .prose h4')]
    toc.value = headings
      .map((heading) => ({ id: heading.id, text: heading.textContent?.trim() || '', depth: Number(heading.tagName.slice(1)) }))
      .filter((item) => item.id && item.text)
    activeId.value = toc.value[0]?.id || ''

    observer = new IntersectionObserver(
      (observations) => {
        const visible = observations
          .filter((item) => item.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)
        if (visible[0]?.target.id) activeId.value = visible[0].target.id
      },
      { rootMargin: '-18% 0px -70% 0px', threshold: 0 }
    )
    headings.forEach((heading) => observer?.observe(heading))
  })

  onBeforeUnmount(() => observer?.disconnect())
  return { toc, activeId }
}
