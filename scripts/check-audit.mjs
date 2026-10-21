import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { auditFindings, buildOnlyExceptions } from './audit-policy.mjs'

// npm_execpath is provided by `npm run`; spawning Node directly also works on
// Windows without executing a .cmd through a shell.
if (!process.env.npm_execpath) throw new Error('Run this check using npm run check:audit')
const result = spawnSync(process.execPath, [process.env.npm_execpath, 'audit', '--json'], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 })
if (result.error || ![0, 1].includes(result.status)) throw result.error || new Error(result.stderr || 'npm audit failed')
const report = JSON.parse(result.stdout)
const versions = Object.fromEntries(
  Object.values(report.vulnerabilities || {})
    .flatMap((entry) => entry.nodes)
    .map((path) => [path, JSON.parse(readFileSync(`${path}/package.json`, 'utf8')).version])
)
const findings = auditFindings(report, versions)
for (const url of findings.accepted) {
  const exception = buildOnlyExceptions.find((item) => item.advisory === url)
  console.warn(`Build-only exception until ${exception.expires}: ${url}\n  ${exception.reason}`)
}
if (findings.rejected.length) {
  console.error(`Unaccepted high/critical advisories:\n${findings.rejected.join('\n')}`)
  process.exit(1)
}
console.log(`Audit gate passed with ${findings.accepted.length} temporary build-only exceptions. Raw npm audit remains available.`)
