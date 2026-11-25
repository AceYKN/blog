import { describe, expect, it } from 'vitest'
import { courses } from '~/config/schedule'
import { contrastRatio, resolveScheduleColor, schedulePaletteForCourses, schedulePaletteLength } from './course-colors'

describe('course color resolver', () => {
  it('allocates stable, order-independent indices and shares colors by normalized course name', () => {
    const synthetic = [
      ...Array.from({ length: 30 }, (_, index) => ({ id: `course-${index}`, title: `測試課程 ${index}` })),
      { id: 'duplicate', title: ' 測試課程 0\u00a0' }
    ]

    const forward = schedulePaletteForCourses(synthetic)
    const reversed = schedulePaletteForCourses([...synthetic].reverse())
    expect(forward).toEqual(reversed)
    expect(forward.get('duplicate')).toBe(forward.get('course-0'))
    expect(new Set(forward.values()).size).toBe(30)
  })

  it('guarantees WCAG >= 4.5 contrast across all palette tones in light and dark themes', () => {
    for (const brightness of ['light', 'dark'] as const) {
      for (let index = 0; index < schedulePaletteLength() + 6; index += 1) {
        const pair = resolveScheduleColor(`Course ${index}`, brightness, { paletteIndex: index })
        expect(contrastRatio(pair.container, pair.onContainer)).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it('keeps distinct colors for every distinct course title in the configured semester', () => {
    const palette = schedulePaletteForCourses(courses)
    const uniqueTitles = new Set(courses.map((course) => course.title))
    const uniqueIndices = new Set(palette.values())
    expect(uniqueIndices.size).toBe(uniqueTitles.size)
  })
})
