// These upstream advisories have no patched release as of 2026-10-20.
// Exceptions are advisory + installed-version specific, expire, and never
// apply to browser chunks (see staticDependencyBoundary below).
export const buildOnlyExceptions = [
  {
    package: 'braces',
    version: '3.0.3',
    advisory: 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm',
    expires: '2026-11-20',
    reason: 'Build-time glob patterns come from the repository configuration; the static site accepts no glob input.'
  },
  {
    package: 'node-forge',
    version: '1.4.0',
    advisory: 'https://github.com/advisories/GHSA-86w9-cpqp-85rv',
    expires: '2026-11-20',
    reason: 'listhen uses forge for local development certificates. The published site has no Node server or RSA verification.'
  }
]

export function auditFindings(report, versions, now = new Date()) {
  if (report.error || !report.vulnerabilities) throw new Error('npm audit did not return a complete advisory report')
  const accepted = []
  const rejected = []
  for (const vulnerability of Object.values(report.vulnerabilities)) {
    // npm duplicates root advisories through transitive "via" package names.
    // Inspect every actual advisory, rather than waiving entire packages/chains.
    for (const advisory of vulnerability.via.filter((item) => typeof item === 'object')) {
      if (!['high', 'critical'].includes(advisory.severity)) continue
      const exception = buildOnlyExceptions.find(
        (item) =>
          item.package === advisory.name &&
          item.advisory === advisory.url &&
          now < new Date(`${item.expires}T00:00:00Z`) &&
          vulnerability.nodes.every((node) => versions[node] === item.version)
      )
      ;(exception ? accepted : rejected).push(advisory.url)
    }
  }
  return { accepted: [...new Set(accepted)], rejected: [...new Set(rejected)] }
}

export function staticDependencyBoundary() {
  return {
    name: 'static-dependency-boundary',
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk') continue
        for (const id of Object.keys(chunk.modules)) {
          if (/[/\\]node_modules[/\\](?:braces|node-forge)[/\\]/.test(id))
            throw new Error(`Build-only audit exception reached the browser bundle: ${id}`)
        }
      }
    }
  }
}
