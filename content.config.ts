import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { draftSourceFiles } from './scripts/content-manifest.mjs'

const exclude = draftSourceFiles()

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
      source: { include: 'source/**/*.md', exclude }
    }),
    essays: defineCollection({
      type: 'page',
      source: { include: 'essays/**/*.md', exclude },
      schema: articleSchema
    }),
    projects: defineCollection({
      type: 'page',
      source: { include: 'projects/**/*.md', exclude },
      schema: articleSchema
    }),
    tech: defineCollection({
      type: 'page',
      source: { include: 'tech/**/*.md', exclude },
      schema: articleSchema
    })
  }
})
