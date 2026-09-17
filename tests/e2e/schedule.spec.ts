import { expect, test } from '@playwright/test'

test.describe('AceYKN schedule', () => {
  test('loads and preserves a week from the URL', async ({ page }) => {
    await page.goto('./schedule?view=week&week=8')
    await expect(page.locator('.schedule-week__intro h2')).toHaveText('第 8 教學週')
    await page.reload()
    await expect(page).toHaveURL(/\/schedule\?view=week&week=8$/)
    await expect(page.locator('.schedule-week__intro h2')).toHaveText('第 8 教學週')
  })

  test('loads and preserves a month from the URL', async ({ page }) => {
    await page.goto('./schedule?view=month&month=2026-10')
    await expect(page.locator('.schedule-month-title')).toHaveText('2026 年 10 月')
    await page.reload()
    await expect(page).toHaveURL(/\/schedule\?view=month&month=2026-10$/)
    await expect(page.locator('.schedule-month-title')).toHaveText('2026 年 10 月')
  })

  test('uses browser history when moving between teaching weeks', async ({ page }) => {
    await page.goto('./schedule?view=week&week=7')
    await page.getByRole('button', { name: '下一週 →' }).click()
    await expect(page).toHaveURL(/\/schedule\?view=week&week=8$/)
    await expect(page.locator('.schedule-week__intro h2')).toHaveText('第 8 教學週')
    await page.goBack()
    await expect(page).toHaveURL(/\/schedule\?view=week&week=7$/)
    await expect(page.locator('.schedule-week__intro h2')).toHaveText('第 7 教學週')
  })

  test('opens and closes a course from a deep link', async ({ page }) => {
    await page.goto('./schedule?view=week&week=3&course=college-chinese')
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('h2')).toHaveText('大学语文★')
    await expect(dialog).toContainText('大学语文-0013')
    await expect(dialog).toContainText('化学类202501')
    await expect(dialog).toContainText('化学类202504')
    await expect(dialog).toContainText('考试')
    await expect(dialog).toContainText('理论 36')
    await expect(dialog).toContainText('周学时 2')
    await expect(dialog).toContainText('总学时 36')
    await expect(dialog).toContainText('2.0')
    await page.getByRole('button', { name: '關閉課程詳情' }).click()
    await expect(page).toHaveURL(/\/schedule\?view=week&week=3$/)
    await expect(page.locator('[role="dialog"]')).toHaveCount(0)
  })

  test('prioritizes an explicit URL view over the stored preference', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('schedule:view', 'today'))
    await page.goto('./schedule')
    await expect(page.locator('.schedule-view-switch button.active')).toHaveText('今日')
    await page.goto('./schedule?view=month&month=2026-10')
    await expect(page.locator('.schedule-view-switch button.active')).toHaveText('月曆')
  })

  test('restores the stored preference after leaving a shared explicit URL', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('schedule:view', 'today'))
    await page.goto('./schedule?view=month&month=2026-10')
    await expect(page.locator('.schedule-view-switch button.active')).toHaveText('月曆')
    await page.getByRole('link', { name: '日程' }).click()
    await expect(page).toHaveURL(/\/schedule\/?\?view=today$/)
    await expect(page.locator('.schedule-view-switch button.active')).toHaveText('今日')
  })

  test('keeps a user-selected view when returning to the bare schedule route', async ({ page }) => {
    await page.goto('./schedule')
    await page.getByRole('button', { name: '月曆' }).click()
    await expect(page.locator('.schedule-view-switch button.active')).toHaveText('月曆')
    await page.evaluate(() => {
      const url = new URL(window.location.href)
      url.search = ''
      window.history.pushState(window.history.state, '', url)
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    await expect(page).toHaveURL(/\/schedule\/?\?view=month&month=\d{4}-\d{2}$/)
    await expect(page.locator('.schedule-view-switch button.active')).toHaveText('月曆')
  })

  test('places the Taipei current-time marker over the Today column', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-09-16T07:37:00.000Z') })
    await page.goto('./schedule?view=today')

    const today = page.locator('.schedule-day[aria-current="date"]')
    const aiCard = today.locator('.schedule-course').filter({ hasText: '人工智能（双语）' })
    const collegeCard = today.locator('.schedule-course').filter({ hasText: '大学语文★' })
    await expect(page.locator('.schedule-now-summary')).toContainText('距离下课 13 分钟')
    await expect(aiCard).toHaveClass(/schedule-course--current/)
    await expect(aiCard.locator('.schedule-course__status')).toHaveText('正在上课')
    await expect(collegeCard).toHaveClass(/schedule-course--next/)
    await expect(collegeCard.locator('.schedule-course__status')).toHaveText('下一节')

    const marker = today.locator('.schedule-now-marker-row')
    await expect(marker).toBeVisible()
    const geometry = await marker.evaluate((element) => {
      const markerBox = element.getBoundingClientRect()
      const slotsBox = element.parentElement?.getBoundingClientRect()
      if (!slotsBox) throw new Error('Schedule slots are missing')
      return {
        markerLeft: markerBox.left,
        markerRight: markerBox.right,
        markerWidth: markerBox.width,
        slotsLeft: slotsBox.left,
        slotsRight: slotsBox.right,
        slotsWidth: slotsBox.width
      }
    })
    expect(geometry.markerLeft).toBeGreaterThanOrEqual(geometry.slotsLeft - 1)
    expect(geometry.markerRight).toBeLessThanOrEqual(geometry.slotsRight + 1)
    expect(geometry.markerWidth).toBeGreaterThan(geometry.slotsWidth * 0.95)
  })

  test('keeps month course dots and shows five weekdays before horizontal scrolling on mobile', async ({ page }) => {
    await page.goto('./schedule?view=month&month=2026-09')
    const monthDay = page.locator('button.schedule-month-day').filter({ has: page.locator('time[datetime="2026-09-02"]') })
    await expect(monthDay.locator('.schedule-month-day__dots i')).toHaveCount(3)
    await expect(monthDay.locator('.schedule-month-day__courses')).toHaveText('3 COURSES')

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('./schedule?view=week&week=3')
    const scheduleScroll = page.locator('.schedule-week__scroll')
    const geometry = await scheduleScroll.evaluate((element) => {
      const scrollBox = element.getBoundingClientRect()
      const dayElements = Array.from(element.querySelectorAll<HTMLElement>('.schedule-day'))
      if (dayElements.length < 6) {
        throw new Error(`Expected at least 6 day columns, found ${dayElements.length}`)
      }
      const days = dayElements.map((day) => day.getBoundingClientRect())
      return {
        scrollable: element.scrollWidth > element.clientWidth,
        viewportRight: scrollBox.right,
        fridayRight: days[4].right,
        saturdayLeft: days[5].left
      }
    })

    expect(geometry.scrollable).toBe(true)
    expect(geometry.fridayRight).toBeLessThanOrEqual(geometry.viewportRight + 1)
    expect(geometry.saturdayLeft).toBeGreaterThanOrEqual(geometry.viewportRight - 1)

    const collegeCard = page.locator('[data-schedule-date="2026-09-16"] .schedule-course').filter({ hasText: '大学语文★' })
    await expect(collegeCard).toContainText('1210')
    await expect(collegeCard).toContainText('李斌')
    await expect(collegeCard.locator('.schedule-course__room')).toBeVisible()
    await expect(collegeCard.locator('.schedule-course__teacher')).toBeVisible()
  })
})
