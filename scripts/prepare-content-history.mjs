import { execFileSync } from 'node:child_process'

const isShallow = () => execFileSync('git', ['rev-parse', '--is-shallow-repository'], { encoding: 'utf8' }).trim() === 'true'

// Hosted builds may start from a shallow checkout. Fetch missing history before
// Nuxt loads its config and computes content timestamps, including npm prepare.
if (isShallow()) {
  console.log('Fetching complete Git history for content timestamps...')
  execFileSync('git', ['fetch', '--unshallow', '--no-tags', 'origin'], { stdio: 'inherit', timeout: 120_000 })
  if (isShallow()) throw new Error('The build requires complete Git history; origin is still shallow.')
}
