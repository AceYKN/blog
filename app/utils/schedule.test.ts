import { describe, expect, it } from 'vitest'
import { getCoursesForDate, getDayStatus, getTeachingWeek } from './schedule'

describe('schedule calendar rules', () => {
  it('maps the first teaching day to week one', () => {
    expect(getTeachingWeek('2026-08-31')).toBe(1)
    expect(getTeachingWeek('2027-01-11')).toBe(20)
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
})
