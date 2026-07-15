import { courses, semester, type Course, type WeekRule } from '~/config/schedule'

export const weekdayNames = ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'] as const

export type DayStatus = { type: 'normal' } | { type: 'holiday'; label: string } | { type: 'makeup'; label: string; lessonDate: string }

const holidays: Record<string, string> = {
  '2026-09-25': '中秋節放假',
  '2026-09-26': '中秋節放假',
  '2026-09-27': '中秋節放假',
  '2026-10-01': '國慶節放假',
  '2026-10-02': '國慶節放假',
  '2026-10-03': '國慶節放假',
  '2026-10-04': '國慶節放假',
  '2026-10-05': '國慶節放假',
  '2026-10-06': '國慶節放假',
  '2026-10-07': '國慶節放假'
}

const makeupClasses: Record<string, { lessonDate: string; label: string }> = {
  '2026-09-20': { lessonDate: '2026-10-05', label: '調課 · 執行 10/05 月曜日課表' },
  '2026-10-10': { lessonDate: '2026-10-06', label: '調課 · 執行 10/06 火曜日課表' }
}

const dateFormatter = new Intl.DateTimeFormat('zh-TW', { month: '2-digit', day: '2-digit', timeZone: 'Asia/Taipei' })

function parseKey(key: string) {
  const [year = 0, month = 1, day = 1] = key.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day, 12))
}

function keyFromDate(date: Date) {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(key: string, days: number) {
  const date = parseKey(key)
  date.setUTCDate(date.getUTCDate() + days)
  return keyFromDate(date)
}

function weekRuleMatches(rule: WeekRule, week: number) {
  if (week < rule.start || week > rule.end) return false
  if (rule.parity === 'odd') return week % 2 === 1
  if (rule.parity === 'even') return week % 2 === 0
  return true
}

export function isCourseWeek(course: Course, week: number) {
  return course.weekRules.some((rule) => weekRuleMatches(rule, week))
}

export function getTeachingWeek(key: string) {
  const difference = Math.floor((parseKey(key).getTime() - parseKey(semester.start).getTime()) / 86_400_000)
  const week = Math.floor(difference / 7) + 1
  return week >= 1 && week <= semester.totalWeeks ? week : null
}

export function getDateForWeek(week: number, day: number) {
  return addDays(semester.start, (week - 1) * 7 + day)
}

export function getWeekDates(week: number) {
  return Array.from({ length: 7 }, (_, day) => getDateForWeek(week, day))
}

export function getDayStatus(key: string): DayStatus {
  const makeup = makeupClasses[key]
  if (makeup) return { type: 'makeup', ...makeup }
  if (holidays[key]) return { type: 'holiday', label: holidays[key] }
  return { type: 'normal' }
}

export function getCoursesForDate(key: string) {
  const status = getDayStatus(key)
  if (status.type === 'holiday') return []

  const lessonDate = status.type === 'makeup' ? status.lessonDate : key
  const week = getTeachingWeek(lessonDate)
  if (!week) return []

  const weekday = (parseKey(lessonDate).getUTCDay() + 6) % 7
  return courses.filter((course) => course.day === weekday && isCourseWeek(course, week))
}

export function getDateLabel(key: string) {
  return dateFormatter.format(parseKey(key))
}

export function getMonthGrid(monthKey: string) {
  const [year = 0, month = 1] = monthKey.split('-').map(Number)
  const monthStart = `${year}-${String(month).padStart(2, '0')}-01`
  const mondayOffset = (parseKey(monthStart).getUTCDay() + 6) % 7
  const firstVisibleDate = addDays(monthStart, -mondayOffset)
  return Array.from({ length: 42 }, (_, index) => addDays(firstVisibleDate, index))
}

export function getMonthName(monthKey: string) {
  const [year = 0, month = 1] = monthKey.split('-').map(Number)
  return `${year} 年 ${month} 月`
}

export function getAdjacentMonth(monthKey: string, offset: number) {
  const [year = 0, month = 1] = monthKey.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1 + offset, 1, 12))
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

export function getMonthKey(key: string) {
  return key.slice(0, 7)
}

export function getWeekRangeLabel(week: number) {
  const [first, last] = [getDateForWeek(week, 0), getDateForWeek(week, 6)]
  return `${getDateLabel(first)} — ${getDateLabel(last)}`
}

export function formatWeekRules(rules: WeekRule[]) {
  return rules
    .map((rule) => {
      const parity = rule.parity === 'odd' ? '單週' : rule.parity === 'even' ? '雙週' : ''
      return `第 ${rule.start}${rule.start === rule.end ? '' : `–${rule.end}`} 週${parity ? `・${parity}` : ''}`
    })
    .join('、')
}

export function getGridRow(section: number) {
  return section + (section >= 5 ? 1 : 0) + (section >= 9 ? 1 : 0)
}
