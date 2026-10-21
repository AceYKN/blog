import { collectContent } from './content-manifest.mjs'
import { contentLastUpdated } from './content-last-updated.mjs'
import { tagUrl } from '../lib/content-identity.mjs'

export const publishedDocuments = collectContent()
export const contentRoutes = publishedDocuments.map((document) => ({
  route: document.url,
  lastmod: contentLastUpdated(document.file),
  title: document.title,
  empty: !document.content.replace(/^#\s+[^\r\n]*(?:\r?\n|$)/, '').trim()
}))

export const tagRoutes = [...new Set(publishedDocuments.flatMap((document) => document.tags))].map(tagUrl)
