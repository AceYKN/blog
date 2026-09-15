import { rm } from 'node:fs/promises'
import { join } from 'node:path'

const outputDirectory = process.env.NUXT_OUTPUT_DIR || 'dist'

// Cloudflare Pages enables its SPA fallback only when the published output
// does not contain a top-level 404.html file. Remove a cached _redirects
// file as well: Nuxt can reuse its output directory between builds.
// GitHub Pages adds its own fallback in the deployment workflow afterwards.
await Promise.all([rm(join(outputDirectory, '404.html'), { force: true }), rm(join(outputDirectory, '_redirects'), { force: true })])
