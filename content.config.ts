import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    notes: defineCollection({
      type: 'page',
      source: 'source/**/*.md'
    }),
    essays: defineCollection({
      type: 'page',
      source: 'essays/**/*.md'
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**/*.md'
    }),
    tech: defineCollection({
      type: 'page',
      source: 'tech/**/*.md'
    })
  }
})
