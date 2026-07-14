import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    notes: defineCollection({
      type: 'page',
      source: 'source/**/*.md'
    }),
    essays: defineCollection({
      type: 'page',
      source: 'essays/**/*.md',
      schema: z.object({
        date: z.string().optional(),
        tags: z.array(z.string()).optional()
      })
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/**/*.md',
      schema: z.object({
        date: z.string().optional(),
        tags: z.array(z.string()).optional()
      })
    }),
    tech: defineCollection({
      type: 'page',
      source: 'tech/**/*.md',
      schema: z.object({
        date: z.string().optional(),
        tags: z.array(z.string()).optional()
      })
    })
  }
})
