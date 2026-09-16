import { describe, expect, it } from 'vitest'
import { courses, sectionTimes, semester } from '~/config/schedule'
import {
  formatScheduleDuration,
  getCourseTemporalStates,
  getCourseTimeRange,
  getCoursesForDate,
  getCurrentTimeMarker,
  getDayStatus,
  getGridRow,
  getTeachingWeek,
  getTaipeiClock,
  getTodayScheduleState,
  isCourseWeek
} from './schedule'

describe('schedule calendar rules', () => {
  it('maps the first teaching day to week one', () => {
    expect(getTeachingWeek('2026-08-31')).toBe(1)
    expect(getTeachingWeek('2027-01-11')).toBe(20)
  })

  it('does not extend the final teaching week beyond the semester end date', () => {
    expect(getTeachingWeek('2027-01-15')).toBe(20)
    expect(getTeachingWeek('2027-01-16')).toBeNull()
    expect(getTeachingWeek('2027-01-17')).toBeNull()
  })

  it('suppresses normal courses on holidays', () => {
    expect(getDayStatus('2026-10-02')).toMatchObject({ type: 'holiday', label: '國慶節放假' })
    expect(getCoursesForDate('2026-10-02')).toEqual([])
  })

  it('keeps New Year’s Day as a normal teaching day when the school calendar does not mark a holiday', () => {
    expect(getDayStatus('2027-01-01')).toEqual({ type: 'normal' })
    expect(getCoursesForDate('2027-01-01').map((course) => course.title)).toContain('Web 數據挖掘（雙語）')
  })

  it('uses the specified future weekday course for makeup days', () => {
    expect(getDayStatus('2026-09-20')).toMatchObject({ type: 'makeup', lessonDate: '2026-10-05' })
    expect(getCoursesForDate('2026-09-20').map((course) => course.title)).toContain('數據結構實驗')
  })

  it('matches the independently exported course periods for the non-standard blocks', () => {
    const tuesdayWeekOne = getCoursesForDate('2026-09-01')
    expect(tuesdayWeekOne.find((course) => course.id === 'web-mining-tuesday')).toBeTruthy()
    expect(tuesdayWeekOne.find((course) => course.id === 'computer-networks-lab')).toMatchObject({ startSection: 5, endSection: 8 })

    const thursdayWeekOne = getCoursesForDate('2026-09-03')
    expect(thursdayWeekOne.find((course) => course.id === 'xi-thought')).toMatchObject({ startSection: 1, endSection: 3 })
    expect(thursdayWeekOne.find((course) => course.id === 'machine-learning-odd')).toMatchObject({ startSection: 7, endSection: 8 })

    const tuesdayWeekTen = getCoursesForDate('2026-11-03')
    expect(tuesdayWeekTen.find((course) => course.id === 'computer-organization-lab')).toMatchObject({ startSection: 9, endSection: 11 })
    expect(tuesdayWeekTen.find((course) => course.id === 'artificial-intelligence-tuesday-computer')).toMatchObject({
      startSection: 7,
      endSection: 8
    })
  })

  it('schedules college Chinese on Wednesday periods 9–10 for weeks 1–18', () => {
    const collegeChinese = courses.find((course) => course.id === 'college-chinese')
    expect(collegeChinese).toMatchObject({ day: 2, startSection: 9, endSection: 10, room: '1210', teacher: '李斌' })
    expect(getCoursesForDate('2026-09-02')).toContainEqual(collegeChinese)
    expect(getCoursesForDate('2026-12-23')).toContainEqual(collegeChinese)
    expect(getCoursesForDate('2026-12-30')).toContainEqual(collegeChinese)
    expect(getCoursesForDate('2027-01-06')).not.toContainEqual(collegeChinese)
    expect(getCourseTimeRange(collegeChinese!)).toEqual({
      startMinute: 19 * 60,
      endMinute: 20 * 60 + 50,
      startLabel: '19:00',
      endLabel: '20:50'
    })
  })

  it('keeps course identifiers and ranges valid', () => {
    expect(new Set(courses.map((course) => course.id)).size).toBe(courses.length)

    for (const course of courses) {
      expect(course.day).toBeGreaterThanOrEqual(0)
      expect(course.day).toBeLessThanOrEqual(6)
      expect(course.startSection).toBeGreaterThanOrEqual(sectionTimes[0]!.section)
      expect(course.endSection).toBeLessThanOrEqual(sectionTimes.at(-1)!.section)
      expect(course.startSection).toBeLessThanOrEqual(course.endSection)

      for (const rule of course.weekRules) {
        expect(rule.start).toBeGreaterThanOrEqual(1)
        expect(rule.end).toBeLessThanOrEqual(semester.totalWeeks)
        expect(rule.start).toBeLessThanOrEqual(rule.end)
      }
    }
  })

  it('does not schedule overlapping courses on the same teaching day', () => {
    for (let week = 1; week <= semester.totalWeeks; week += 1) {
      for (let day = 0; day < 7; day += 1) {
        const activeCourses = courses.filter((course) => course.day === day && isCourseWeek(course, week))

        for (const [index, course] of activeCourses.entries()) {
          for (const other of activeCourses.slice(index + 1)) {
            const overlaps = course.startSection <= other.endSection && other.startSection <= course.endSection
            expect(overlaps, `第 ${week} 週第 ${day + 1} 天：${course.id} 與 ${other.id} 時段重疊`).toBe(false)
          }
        }
      }
    }
  })
})

describe('schedule time states', () => {
  const wednesdayWeekThree = getCoursesForDate('2026-09-16')
  const artificialIntelligence = wednesdayWeekThree.find((course) => course.id === 'artificial-intelligence-early')!
  const collegeChinese = wednesdayWeekThree.find((course) => course.id === 'college-chinese')!

  it('labels ended, current, next, and later courses with half-open time ranges', () => {
    const statesBefore = getCourseTemporalStates(wednesdayWeekThree, 18 * 60 + 59)
    expect(statesBefore.find((entry) => entry.course.id === 'college-chinese')?.state).toBe('next')

    const statesAtStart = getCourseTemporalStates(wednesdayWeekThree, 19 * 60)
    expect(statesAtStart.find((entry) => entry.course.id === 'college-chinese')?.state).toBe('current')

    const statesAtEnd = getCourseTemporalStates(wednesdayWeekThree, 20 * 60 + 50)
    expect(statesAtEnd.find((entry) => entry.course.id === 'college-chinese')?.state).toBe('ended')
    expect(getCourseTemporalStates([artificialIntelligence, collegeChinese], 15 * 60 + 37)).toEqual([
      { course: artificialIntelligence, state: 'current' },
      { course: collegeChinese, state: 'next' }
    ])
  })

  it('summarizes the current, next, finished, and empty day states', () => {
    expect(getTodayScheduleState(wednesdayWeekThree, 15 * 60 + 37)).toMatchObject({
      type: 'current',
      course: artificialIntelligence,
      remainingMinutes: 13
    })
    expect(getTodayScheduleState(wednesdayWeekThree, 16 * 60 + 30)).toMatchObject({
      type: 'next',
      course: collegeChinese,
      startsInMinutes: 150
    })
    expect(getTodayScheduleState(wednesdayWeekThree, 20 * 60 + 51)).toEqual({ type: 'finished' })
    expect(getTodayScheduleState([], 12 * 60)).toEqual({ type: 'empty' })
  })

  it('formats countdowns with ceiling and hour units', () => {
    expect(formatScheduleDuration(0.2)).toBe('不足 1 分钟')
    expect(formatScheduleDuration(23)).toBe('23 分钟')
    expect(formatScheduleDuration(83)).toBe('1 小时 23 分钟')
    expect(formatScheduleDuration(120)).toBe('2 小时')
  })

  it('derives the clock from Asia/Taipei instead of the host timezone', () => {
    expect(getTaipeiClock(new Date('2026-09-16T07:37:00.000Z'))).toEqual({
      date: '2026-09-16',
      hour: 15,
      minute: 37,
      minutes: 15 * 60 + 37,
      label: '15:37'
    })
  })

  it('keeps the current marker inside the existing grid rows', () => {
    expect(getCurrentTimeMarker(8 * 60)).toMatchObject({ row: getGridRow(1), progress: 0, label: '08:00' })
    expect(getCurrentTimeMarker(8 * 60 + 25)).toMatchObject({ row: getGridRow(1), progress: 0.5, label: '08:25' })
    expect(getCurrentTimeMarker(12 * 60 + 30)).toMatchObject({ row: getGridRow(4) + 1, progress: 0.25, label: '12:30' })
    expect(getCurrentTimeMarker(15 * 60 + 37)).toMatchObject({ row: getGridRow(6), progress: 0.74, label: '15:37' })
    expect(getCurrentTimeMarker(18 * 60 + 20)).toMatchObject({ row: getGridRow(8) + 1, progress: 30 / 70, label: '18:20' })
    expect(getCurrentTimeMarker(19 * 60)).toMatchObject({ row: getGridRow(9), progress: 0, label: '19:00' })
    expect(getCurrentTimeMarker(21 * 60 + 50)).toMatchObject({ row: getGridRow(11), progress: 1, label: '21:50' })
    expect(getCurrentTimeMarker(7 * 60 + 59)).toBeNull()
    expect(getCurrentTimeMarker(21 * 60 + 51)).toBeNull()
  })
})
