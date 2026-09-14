import { createReadStream } from 'node:fs'
import { access, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, relative, resolve } from 'node:path'
import { normalizeBaseURL } from './pwa-config.mjs'

const root = resolve(process.cwd(), 'dist')
const baseURL = normalizeBaseURL(process.env.NUXT_APP_BASE_URL || '/')
const port = Number(process.env.PORT || 4173)

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
}

function stripBaseURL(pathname) {
  if (baseURL === '/') return pathname
  const baseWithoutTrailingSlash = baseURL.slice(0, -1)
  if (pathname === baseWithoutTrailingSlash || pathname === baseURL) return '/'
  if (!pathname.startsWith(baseURL)) return null
  return pathname.slice(baseWithoutTrailingSlash.length) || '/'
}

function safePath(pathname) {
  const decoded = decodeURIComponent(pathname)
  const relativePath = normalize(decoded).replace(/^([/\\])+/, '')
  const filePath = resolve(root, relativePath)
  const relativePathFromRoot = relative(root, filePath)
  if (relativePathFromRoot.startsWith('..') || relativePathFromRoot.includes(':')) return null
  return filePath
}

async function resolveFile(pathname) {
  const scopedPath = stripBaseURL(pathname)
  if (scopedPath === null) return null
  const requestedPath = safePath(scopedPath)
  if (!requestedPath) return null
  const isResourceRequest = Boolean(extname(scopedPath))

  try {
    const details = await stat(requestedPath)
    if (details.isFile()) return requestedPath
    if (details.isDirectory()) {
      const indexPath = join(requestedPath, 'index.html')
      await access(indexPath)
      return indexPath
    }
  } catch {
    // Static hosting falls back to the generated shell for direct route loads.
  }

  return isResourceRequest ? null : join(root, 'index.html')
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' })
    response.end()
    return
  }

  try {
    const requestURL = new URL(request.url || '/', 'http://127.0.0.1')
    const filePath = await resolveFile(requestURL.pathname)
    if (!filePath) {
      response.writeHead(404)
      response.end('Not found')
      return
    }
    const contentType = contentTypes[extname(filePath).toLowerCase()] || 'application/octet-stream'
    response.writeHead(200, {
      'Cache-Control': filePath.endsWith('sw.js') || filePath.endsWith('manifest.webmanifest') ? 'no-store' : 'no-cache',
      'Content-Type': contentType
    })
    if (request.method === 'HEAD') response.end()
    else createReadStream(filePath).pipe(response)
  } catch {
    response.writeHead(400)
    response.end('Bad request')
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}${baseURL}`)
})

process.on('SIGTERM', () => server.close())
process.on('SIGINT', () => server.close())
