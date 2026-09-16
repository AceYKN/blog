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

  test('keeps month course dots and the expanded mobile week grid', async ({ page }) => {
    await page.goto('./schedule?view=month&month=2026-09')
    const monthDay = page.locator('button.schedule-month-day').filter({ has: page.locator('time[datetime="2026-09-02"]') })
    await expect(monthDay.locator('.schedule-month-day__dots i')).toHaveCount(3)
    await expect(monthDay.locator('.schedule-month-day__courses')).toHaveText('3 COURSES')

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('./schedule?view=week&week=3')
    const scheduleScroll = page.locator('.schedule-week__scroll')
    const isHorizontallyScrollable = await scheduleScroll.evaluate((element) => element.scrollWidth > element.clientWidth)
    expect(isHorizontallyScrollable).toBe(true)
    const collegeCard = page.locator('[data-schedule-date="2026-09-16"] .schedule-course').filter({ hasText: '大学语文★' })
    await expect(collegeCard).toContainText('1210')
    await expect(collegeCard).toContainText('李斌')
    await expect(collegeCard.locator('.schedule-course__room')).toBeVisible()
    await expect(collegeCard.locator('.schedule-course__teacher')).toBeVisible()
  })
})
