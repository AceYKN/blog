Dependency review: 2026-11-03

Nuxt, Nuxt Content and the lockfile were updated to remove the patchable findings. All KaTeX consumers resolve to the direct patched version through an npm override; static math rendering and browser regressions must pass when changing it.

The deployment audit also requires two targeted dependency updates:

- `node-forge` resolves to 1.4.2 or later through an override. Its October 2026 advisories have patched releases, so the old 1.4.0 exception has been removed.
- All Zod consumers resolve to the direct 4.6.7 dependency, which includes the fix for [oversized collection validation](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5). The content schema imports Zod directly and uses Nuxt Content's supported Zod 4 converter, rather than its deprecated Zod re-export. Content, sitemap and robots output must pass regression checks when changing this override.

One upstream advisory still has no patched release:

- [braces 3.0.3: nested-pattern stack exhaustion](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). This project supplies repository-owned build globs. Visitor queries use the separate browser search implementation.

This is an **unfixed upstream dependency**, not a zero-vulnerability audit. `npm audit` can still report lower-severity findings. `npm run check:audit` accepts only the reviewed braces advisory/version combination until **2026-11-20** if it is reported at high/critical severity; new high/critical findings, unknown audit failures and expired exceptions fail CI. The Nuxt client build still fails if braces or node-forge enters a browser chunk. Do not use this exception for a Node/server deployment or untrusted build patterns.

Review and remove each exception when a patched release is available. Do not renew it automatically, suppress all transitive findings, or use `npm audit fix --force` to downgrade the framework.
