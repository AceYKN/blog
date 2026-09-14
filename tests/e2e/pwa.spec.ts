import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { expect, test, type Page } from '@playwright/test'
import { normalizeBaseURL } from '../../scripts/pwa-config.mjs'

type NoteCandidate = { kind: string; title: string; path: string; url: string }

async function waitForServiceWorker(page: Page) {
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)
}

async function getNoteCandidates(page: Page) {
  return page.evaluate(async () => {
    const response = await fetch('./search-catalog.json')
    if (!response.ok) throw new Error(`search catalog request failed: ${response.status}`)
    const catalog = (await response.json()) as { documents?: NoteCandidate[] }
    return (catalog.documents || [])
      .filter((document) => document.kind === 'notes' && document.path && document.url && !document.path.endsWith('/index'))
      .slice(0, 2)
  })
}

function searchTerm(note: NoteCandidate) {
  const parts = note.path.split('/').filter(Boolean)
  return parts[parts.length - 1] || note.title
}

function siteURL(page: Page, path: string) {
  return new URL(`.${path}`, page.url()).href
}

test.describe('AceYKN PWA', () => {
  test('registers a controlling service worker', async ({ page }) => {
    await page.goto('./')
    await waitForServiceWorker(page)
    await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller?.state)).toBe('activated')
  })

  test('reads an accessed note while offline', async ({ page, context }) => {
    await page.goto('./')
    await waitForServiceWorker(page)
    const notes = await getNoteCandidates(page)
    expect(notes.length).toBeGreaterThanOrEqual(2)
    const firstNote = notes[0]
    const secondNote = notes[1]
    const firstURL = siteURL(page, firstNote.url)
    const secondURL = siteURL(page, secondNote.url)

    await page.goto(firstURL)
    const title = await page.locator('article h1').innerText()
    await expect(page.locator('article h1')).toContainText(title)

    await page.getByRole('link', { name: '課程筆記' }).first().click()
    await expect(page).toHaveURL(/\/library\/?$/)
    const librarySearch = page.locator('input[placeholder*="操作系统"]')
    await librarySearch.fill(searchTerm(secondNote))
    const secondResult = page.locator('.course-results a').filter({ hasText: secondNote.title }).first()
    await expect(secondResult).toBeVisible()
    await secondResult.click()
    await expect(page).toHaveURL(secondURL)
    await expect(page.locator('article h1')).toBeVisible()

    await context.setOffline(true)
    await page.getByRole('link', { name: '課程筆記' }).first().click()
    await expect(page).toHaveURL(/\/library\/?$/)
    const offlineLibrarySearch = page.locator('input[placeholder*="操作系统"]')
    await offlineLibrarySearch.fill(searchTerm(firstNote))
    const firstResult = page.locator('.course-results a').filter({ hasText: firstNote.title }).first()
    await expect(firstResult).toBeVisible()
    await firstResult.click()
    await expect(page).toHaveURL(firstURL)
    await expect(page.locator('article h1')).toContainText(title)
    await expect(page.locator('.prose')).toBeVisible()
  })

  test('shows the offline fallback for an unvisited route', async ({ page, context }) => {
    await page.goto('./')
    await waitForServiceWorker(page)
    await context.setOffline(true)
    await page.goto('./notes/__never-cached-by-aceykn-pwa__')
    await expect(page.locator('h1')).toHaveText('離線')
    await expect(page.getByText('尚未被儲存在本機')).toBeVisible()
  })

  test('does not turn missing static resources into the HTML shell', async ({ request }) => {
    const serverBaseURL = `http://127.0.0.1:4173${normalizeBaseURL(process.env.NUXT_APP_BASE_URL || '/')}`
    const missingAsset = await request.get(new URL('_nuxt/__never-built__.js', serverBaseURL).href)
    expect(missingAsset.status()).toBe(404)

    const missingRoute = await request.get(new URL('notes/__never-cached-by-aceykn-pwa__', serverBaseURL).href)
    expect(missingRoute.status()).toBe(200)
    expect(missingRoute.headers()['content-type']).toContain('text/html')
  })

  test('keeps a fetched search index available offline', async ({ page, context }) => {
    await page.goto('./library')
    await waitForServiceWorker(page)
    await page.reload()
    const searchIndexResponse = page.waitForResponse(
      (response) => response.url().includes('search-index-notes.json') && response.status() === 200
    )
    await page.locator('input[placeholder*="操作系统"]').fill('数据库')
    await searchIndexResponse
    await expect(page.locator('.course-results a').first()).toBeVisible()

    await context.setOffline(true)
    await page.reload()
    await page.locator('input[placeholder*="操作系统"]').fill('数据库')
    await expect(page.locator('.course-results a').first()).toBeVisible()
  })

  test('prompts for a waiting service-worker update without forcing it', async ({ page }) => {
    const serviceWorkerPath = resolve('dist/sw.js')
    const original = await readFile(serviceWorkerPath, 'utf8')
    try {
      await page.goto('./')
      await waitForServiceWorker(page)
      await writeFile(serviceWorkerPath, `${original}\n/* PWA E2E build B */\n`, 'utf8')
      await page.evaluate(async () => {
        const serviceWorker = await navigator.serviceWorker.getRegistration()
        await serviceWorker?.update()
      })
      await expect(page.getByText('網站已更新')).toBeVisible()
      await expect.poll(() => page.evaluate(async () => Boolean((await navigator.serviceWorker.getRegistration())?.waiting))).toBe(true)

      const urlBeforeDismiss = page.url()
      await page.getByRole('button', { name: '稍後' }).click()
      await expect(page.getByText('網站已更新')).toHaveCount(0)
      await expect.poll(() => page.url()).toBe(urlBeforeDismiss)

      await page.reload()
      await expect(page.getByText('網站已更新')).toBeVisible()
      await page.getByRole('button', { name: '重新載入' }).click()
      await expect(page).toHaveURL(urlBeforeDismiss)
      await expect(page.getByText('網站已更新')).toHaveCount(0)
    } finally {
      await writeFile(serviceWorkerPath, original, 'utf8')
    }
  })
})
