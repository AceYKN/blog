import { expect, test } from '@playwright/test'
import catalogue from '../../app/data/content-catalogue.json' with { type: 'json' }

const notePath = 'notes/code/vue/01-js-from-zero'

test.describe('published content and reading', () => {
  test.use({ serviceWorkers: 'block' })

  test('every catalogue URL returns its own static article', async ({ request }) => {
    for (let offset = 0; offset < catalogue.documents.length; offset += 8) {
      await Promise.all(
        catalogue.documents.slice(offset, offset + 8).map(async (entry) => {
          const response = await request.get(`.${entry.url}`)
          expect(response.status(), entry.url).toBe(200)
          const html = await response.text()
          expect(html, entry.url).toContain(`data-content-path="${entry.url.replaceAll('&', '&amp;')}"`)
          expect(html, entry.url).toMatch(/class="[^"]*\bprose\b/)
          expect(html, entry.url).not.toMatch(/找不到這篇|FetchError|H3Error/)
        })
      )
    }
  })

  test('Chinese, uppercase and index URLs render without JavaScript', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
    const page = await context.newPage()
    for (const path of ['notes/cs/os/HW/chap2-hw', 'notes/cs/db/tutorial/01-数据库基础与关系模型', 'notes/cs/os/index']) {
      await page.goto(`./${path}`)
      await expect(page.locator('.prose')).not.toBeEmpty()
      await expect(page.locator('h1')).toHaveCount(1)
    }
    await page.goto('./tags/DeepSeek')
    await expect(page.locator('h1')).toHaveText('#DeepSeek')
    await expect(page.locator('.content-list a').first()).toBeVisible()
    await context.close()
  })

  test('course navigation survives hydration and follows numeric chapter order', async ({ page }) => {
    await page.goto('./notes/cs/os/note/chap2')
    await expect(page.locator('.course-jump')).toBeVisible()
    const next = page.locator('.course-pagination').first().getByRole('link').last()
    await expect(next).toHaveAttribute('href', /\/notes\/cs\/os\/note\/chap3$/)
    await next.click()
    await expect(page.locator('article[data-content-path]')).toHaveAttribute('data-content-path', '/notes/cs/os/note/chap3')
  })

  test('hosted trailing slashes preserve article hydration and canonical reading history', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (/hydration.*mismatch/i.test(message.text())) errors.push(message.text())
    })
    const paths = [
      '/notes/math/ode/3-2&4-1 HW',
      '/notes/cs/os/index',
      ...catalogue.documents.filter((entry) => entry.kind !== 'notes').map((entry) => entry.url)
    ]
    for (const path of paths) {
      await page.goto(`.${path}/`)
      // Reading history is written only after the article has mounted. This
      // catches SSR content that disappears into a 404 during hydration.
      await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('blog:reading-progress-v1') || '{}').url)).toBe(path)
      await expect(page.locator('article[data-content-path]')).toHaveAttribute('data-content-path', path)
      await expect(page.locator('.prose')).not.toBeEmpty()
    }
    expect(errors).toEqual([])
  })

  test('search scrolls internally, contains focus, closes from a result and restores the trigger', async ({ page }) => {
    await page.goto('./')
    const trigger = page.locator('.search-trigger')
    await trigger.click()
    const dialog = page.getByRole('dialog', { name: '搜尋筆記' })
    const input = dialog.getByRole('searchbox')
    await expect(input).toBeFocused()
    await input.fill('Vue')
    await expect.poll(() => dialog.locator('.search-result').count()).toBeGreaterThan(8)
    await expect.poll(() => dialog.locator('.search-results').evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true)
    await input.press('Shift+Tab')
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
    const backgroundY = await page.evaluate(() => scrollY)
    const last = dialog.locator('.search-result').last()
    await last.scrollIntoViewIfNeeded()
    await expect(last).toBeInViewport()
    expect(await page.evaluate(() => scrollY)).toBe(backgroundY)
    await last.focus()
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(trigger).toBeFocused()
  })

  test('failed search indexes report a retryable error', async ({ page }) => {
    await page.route('**/search-*.json', (route) => route.abort())
    await page.goto('./')
    await page.locator('.search-trigger').click()
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('searchbox').fill('Vue')
    await expect(dialog.getByRole('status')).toContainText('讀取失敗')
    await page.unroute('**/search-*.json')
    await dialog.getByRole('button', { name: '重新載入' }).click()
    await expect(dialog.locator('.search-result').first()).toBeVisible()
    await expect(dialog.getByRole('status')).toHaveCount(0)
  })

  test('restores a saved reading position, saves subsequent scrolling and honors anchors', async ({ page }) => {
    await page.addInitScript((url) => {
      if (!localStorage.getItem('test:position-seeded')) {
        localStorage.setItem('blog:reading-progress-v1', JSON.stringify({ url, y: 2200, progress: 5, updatedAt: Date.now() }))
        localStorage.setItem('test:position-seeded', 'yes')
      }
    }, `/${notePath}`)
    await page.goto(`./${notePath}`)
    await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBe(2200)
    await page.evaluate(() => scrollTo(0, 3100))
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('blog:reading-progress-v1') || '{}').y)).toBe(3100)
    await page.goto('./library')
    await page.locator('.continue-reading').click()
    await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBe(3100)
    const heading = page.locator('.prose h2[id]').first()
    const id = await heading.getAttribute('id')
    await page.goto(`./${notePath}#${encodeURIComponent(id!)}`)
    await expect.poll(() => heading.evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(250)
  })

  test('mobile long code and equations do not widen the document', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    for (const path of [notePath, 'notes/cs/os/note/chap2', 'notes/math/ode/3-2&4-1 HW']) {
      await page.goto(`./${path}`)
      await expect(page.locator('.prose')).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
    }
  })

  test('continue reading preserves Chinese document URLs', async ({ page }) => {
    const path = '/notes/cs/db/tutorial/01-数据库基础与关系模型'
    await page.goto(`.${path}/`)
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('blog:reading-progress-v1') || '{}').url)).toBe(path)
    await page.evaluate(() => scrollTo({ top: 1400, behavior: 'instant' }))
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('blog:reading-progress-v1') || '{}').y)).toBe(1400)
    await page.goto('./')
    await page.locator('.continue-reading').click()
    await expect(page.locator('article[data-content-path]')).toHaveAttribute('data-content-path', path)
    await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBe(1400)
  })

  test('homepage searches the site and hydrates its clock without mismatch', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (/hydration.*mismatch/i.test(message.text())) errors.push(message.text())
    })
    await page.goto('./')
    await page.locator('#global-search').fill('Vue')
    await page.locator('.quick-search button[type="submit"]').click()
    await expect(page.getByRole('dialog').getByRole('searchbox')).toHaveValue('Vue')
    await expect(page.locator('.now-panel time')).not.toHaveText('--:--')
    expect(errors).toEqual([])
  })

  test('storage restrictions preserve theme and schedule controls; Escape closes course details', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.addInitScript(() => {
      Storage.prototype.getItem = () => {
        throw new DOMException('Blocked', 'SecurityError')
      }
      Storage.prototype.setItem = () => {
        throw new DOMException('Blocked', 'SecurityError')
      }
    })
    await page.goto('./schedule?view=week&week=3&course=college-chinese')
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await page.keyboard.press('Shift+Tab')
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await page.locator('.theme-toggle').click()
    await page.getByRole('button', { name: '月曆', exact: true }).click()
    await expect(page.locator('.schedule-view-switch button.active')).toHaveText('月曆')
    expect(errors).toEqual([])
  })
})
