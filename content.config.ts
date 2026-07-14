import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const articleSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().min(1),
  updated: z.string().min(1),
  tags: z.array(z.string()),
  draft: z.boolean(),
  cover: z.string().min(1)
})

export default defineContentConfig({
  collections: {
    notes: defineCollection({
      type: 'page',
      source: 'source/**/*.md'
    }),
    essays: defineCollection({
      type: 'page',
      source: 'essays/**/*.md',
      schema: articleSchema
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**/*.md',
      schema: articleSchema
    }),
    tech: defineCollection({
      type: 'page',
      source: 'tech/**/*.md',
      schema: articleSchema
    })
  }
})
