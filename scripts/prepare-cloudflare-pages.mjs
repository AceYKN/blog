import { rm } from 'node:fs/promises'

// Cloudflare Pages enables its SPA fallback only when the published output
// does not contain a top-level 404.html file. Remove a cached _redirects
// file as well: Nuxt can reuse its output directory between builds.
// GitHub Pages adds its own fallback in the deployment workflow afterwards.
await Promise.all([rm('.output/public/404.html', { force: true }), rm('.output/public/_redirects', { force: true })])
