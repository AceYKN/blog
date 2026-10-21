import { describe, expect, it } from 'vitest'
import { auditFindings, buildOnlyExceptions, staticDependencyBoundary } from '../scripts/audit-policy.mjs'

const exception = buildOnlyExceptions[0]
const advisory = { name: exception.package, url: exception.advisory, severity: 'high' }
const report = { vulnerabilities: { braces: { via: [advisory], nodes: ['node_modules/braces'] } } }
const versions = { 'node_modules/braces': exception.version }

describe('dependency audit boundary', () => {
  it('accepts only the reviewed version before expiry', () => {
    expect(auditFindings(report, versions, new Date('2026-10-20')).accepted).toEqual([exception.advisory])
    expect(auditFindings(report, { 'node_modules/braces': '3.0.2' }, new Date('2026-10-20')).rejected).toHaveLength(1)
    expect(auditFindings(report, versions, new Date('2026-11-20')).rejected).toHaveLength(1)
  })
  it('does not suppress a new advisory on the same dependency', () => {
    const unknown = structuredClone(report)
    unknown.vulnerabilities.braces.via[0]!.url = 'https://github.com/advisories/new-advisory'
    expect(auditFindings(unknown, versions).rejected).toHaveLength(1)
    expect(() => auditFindings({ error: 'network failed' }, versions)).toThrow()
  })
  it('blocks either excepted dependency from browser chunks', () => {
    for (const name of ['braces', 'node-forge']) {
      expect(() =>
        staticDependencyBoundary().generateBundle({}, { app: { type: 'chunk', modules: { [`/app/node_modules/${name}/index.js`]: {} } } })
      ).toThrow(/browser bundle/)
    }
  })
})
