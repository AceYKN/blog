import { rm } from 'node:fs/promises'

// Cloudflare Pages enables its SPA fallback only when the published output
// does not contain a top-level 404.html file. GitHub Pages adds its own
// fallback in the deployment workflow after this script has run.
await rm('.output/public/404.html', { force: true })
