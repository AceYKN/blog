import { courses, sectionTimes, semester, type Course, type WeekRule } from '~/config/schedule'

export const weekdayNames = ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'] as const

export type DayStatus = { type: 'normal' } | { type: 'holiday'; label: string } | { type: 'makeup'; label: string; lessonDate: string }

export interface CurrentClock {
  date: string
  hour: number
  minute: number
  minutes: number
  label: string
}

export interface CourseTimeRange {
  startMinute: number
  endMinute: number
  startLabel: string
  endLabel: string
}

export type CourseTemporalState = 'ended' | 'current' | 'next' | 'later'

export interface CourseTemporalStateEntry {
  course: Course
  state: CourseTemporalState
}

export type TodayScheduleState =
  | { type: 'current'; course: Course; remainingMinutes: number }
  | { type: 'next'; course: Course; startsInMinutes: number }
  | { type: 'finished' }
  | { type: 'empty' }

export interface CurrentTimeMarker {
  row: number
  progress: number
  label: string
}

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
  if (key < semester.start || key > semester.end) return null

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

const clockFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'Asia/Taipei'
})

function clockPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return parts.find((part) => part.type === type)?.value || ''
}

function minutesFromLabel(label: string) {
  const [hour = 0, minute = 0] = label.split(':').map(Number)
  return hour * 60 + minute
}

function formatClockLabel(minutes: number) {
  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export function getTaipeiClock(date: Date = new Date()): CurrentClock {
  const parts = clockFormatter.formatToParts(date)
  const year = clockPart(parts, 'year')
  const month = clockPart(parts, 'month')
  const day = clockPart(parts, 'day')
  const hour = Number(clockPart(parts, 'hour'))
  const minute = Number(clockPart(parts, 'minute'))

  return {
    date: `${year}-${month}-${day}`,
    hour,
    minute,
    minutes: hour * 60 + minute,
    label: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }
}

export function getCourseTimeRange(course: Pick<Course, 'startSection' | 'endSection'>): CourseTimeRange {
  const start = sectionTimes.find((item) => item.section === course.startSection)!
  const end = sectionTimes.find((item) => item.section === course.endSection)!

  return {
    startMinute: minutesFromLabel(start.start),
    endMinute: minutesFromLabel(end.end),
    startLabel: start.start,
    endLabel: end.end
  }
}

export function getCourseTemporalStates(coursesForDay: Course[], currentMinutes: number): CourseTemporalStateEntry[] {
  const sortedCourses = [...coursesForDay].sort((first, second) => {
    const startDifference = getCourseTimeRange(first).startMinute - getCourseTimeRange(second).startMinute
    return startDifference || first.id.localeCompare(second.id)
  })
  let foundNext = false

  return sortedCourses.map((course) => {
    const { startMinute, endMinute } = getCourseTimeRange(course)
    let state: CourseTemporalState

    if (currentMinutes >= endMinute) {
      state = 'ended'
    } else if (currentMinutes >= startMinute) {
      state = 'current'
    } else if (!foundNext) {
      state = 'next'
      foundNext = true
    } else {
      state = 'later'
    }

    return { course, state }
  })
}

export function getTodayScheduleState(coursesForDay: Course[], currentMinutes: number): TodayScheduleState {
  if (!coursesForDay.length) return { type: 'empty' }

  const states = getCourseTemporalStates(coursesForDay, currentMinutes)
  const current = states.find((entry) => entry.state === 'current')
  if (current) {
    return {
      type: 'current',
      course: current.course,
      remainingMinutes: Math.max(0, getCourseTimeRange(current.course).endMinute - currentMinutes)
    }
  }

  const next = states.find((entry) => entry.state === 'next')
  if (next) {
    return {
      type: 'next',
      course: next.course,
      startsInMinutes: Math.max(0, getCourseTimeRange(next.course).startMinute - currentMinutes)
    }
  }

  return { type: 'finished' }
}

export function formatScheduleDuration(minutes: number) {
  if (minutes < 1) return '不足 1 分钟'
  const roundedMinutes = Math.ceil(minutes)

  const hours = Math.floor(roundedMinutes / 60)
  const remainingMinutes = roundedMinutes % 60
  if (!hours) return `${roundedMinutes} 分钟`
  if (!remainingMinutes) return `${hours} 小时`
  return `${hours} 小时 ${remainingMinutes} 分钟`
}

export function formatDuration(minutes: number) {
  return formatScheduleDuration(minutes)
}

export function getCurrentTimeMarker(minutes: number): CurrentTimeMarker | null {
  const firstStart = minutesFromLabel(sectionTimes[0]!.start)
  const lastEnd = minutesFromLabel(sectionTimes.at(-1)!.end)
  if (minutes < firstStart || minutes > lastEnd) return null

  const sectionRanges = sectionTimes.map((section) => ({
    row: getGridRow(section.section),
    startMinute: minutesFromLabel(section.start),
    endMinute: minutesFromLabel(section.end)
  }))

  for (const [index, section] of sectionTimes.entries()) {
    const nextSection = sectionTimes[index + 1]
    if (!nextSection) continue

    const gapStart = minutesFromLabel(section.end)
    const gapEnd = minutesFromLabel(nextSection.start)
    if (getGridRow(nextSection.section) - getGridRow(section.section) > 1 && minutes >= gapStart && minutes < gapEnd) {
      return {
        row: getGridRow(section.section) + 1,
        progress: Math.min(1, Math.max(0, (minutes - gapStart) / (gapEnd - gapStart))),
        label: formatClockLabel(minutes)
      }
    }
  }

  const activeSection = sectionRanges.find(({ startMinute, endMinute }) => minutes >= startMinute && minutes <= endMinute)
  if (activeSection) {
    return {
      row: activeSection.row,
      progress: Math.min(1, Math.max(0, (minutes - activeSection.startMinute) / (activeSection.endMinute - activeSection.startMinute))),
      label: formatClockLabel(minutes)
    }
  }

  const previousSection = [...sectionRanges].reverse().find(({ endMinute }) => endMinute < minutes)
  if (previousSection) {
    return { row: previousSection.row, progress: 1, label: formatClockLabel(minutes) }
  }

  return null
}
