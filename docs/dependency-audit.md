Dependency review: 2026-10-20

Nuxt, Nuxt Content and the lockfile were updated to remove the patchable findings. All KaTeX consumers resolve to the direct patched version through an npm override; static math rendering and browser regressions must pass when changing it.

Two upstream advisories still have no patched release:

- [braces 3.0.3: nested-pattern stack exhaustion](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). This project supplies repository-owned build globs. Visitor queries use the separate browser search implementation.
- [node-forge 1.4.0: malformed RSA signature acceptance](https://github.com/advisories/GHSA-86w9-cpqp-85rv). Its dependency is listhen, used for development certificates. This site publishes static files and performs no server-side signature verification.

These are **unfixed upstream dependencies**, not a zero-vulnerability audit. `npm audit` intentionally continues to report them. `npm run check:audit` accepts only these exact advisory/version combinations until **2026-11-20**; new high/critical findings, unknown audit failures and expired exceptions fail CI. The Nuxt client build also fails if either package enters a browser chunk. Do not use these exceptions for a Node/server deployment or untrusted build patterns.

Review and remove each exception when a patched release is available. Do not renew it automatically, suppress all transitive findings, or use `npm audit fix --force` to downgrade the framework.
