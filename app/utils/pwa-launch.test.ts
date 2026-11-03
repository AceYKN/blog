import { describe, expect, it } from 'vitest'
import { normalizePwaPage } from './pwa-launch'

describe('remembered PWA pages', () => {
  it('preserves the schedule view, week and month without including the deployment base', () => {
    expect(normalizePwaPage('/schedule?view=week&week=8')).toBe('/schedule?view=week&week=8')
    expect(normalizePwaPage('/schedule/?view=month&month=2026-10')).toBe('/schedule?view=month&month=2026-10')
    expect(normalizePwaPage('/library#courses')).toBe('/library#courses')
    expect(normalizePwaPage('/')).toBe('/')
  })

  it.each([null, '', 'https://example.com/schedule', '//example.com/schedule', '/\\example.com/schedule', '/schedule\n'])(
    'rejects invalid or external destinations: %s',
    (value) => expect(normalizePwaPage(value)).toBeNull()
  )

  it.each(['/offline.html', '/_nuxt/app.js', '/blog/schedule', '/schedule/other', '/notes/cs/example', '/missing'])(
    'remembers section pages rather than transient or unknown routes: %s',
    (value) => expect(normalizePwaPage(value)).toBeNull()
  )
})
