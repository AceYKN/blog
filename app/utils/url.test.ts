import { describe, expect, it } from 'vitest'
import { absoluteSiteUrl, withBasePath } from './url'

describe('withBasePath', () => {
  it('keeps root deployments at the domain root', () => {
    expect(withBasePath('/', '/search-catalog.json')).toBe('/search-catalog.json')
  })

  it('keeps project deployments under their configured base', () => {
    expect(withBasePath('/blog/', '/search-catalog.json')).toBe('/blog/search-catalog.json')
    expect(withBasePath('/blog', 'favicon.png')).toBe('/blog/favicon.png')
  })
})

describe('absoluteSiteUrl', () => {
  it('joins a canonical site URL without duplicate slashes', () => {
    expect(absoluteSiteUrl('https://example.com/', '/og-image.png')).toBe('https://example.com/og-image.png')
  })
})
