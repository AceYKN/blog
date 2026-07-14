import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const output = join(process.cwd(), 'app', 'data', 'github-projects.json')
const endpoint = 'https://api.github.com/users/AceYKN/repos?sort=updated&direction=desc&per_page=100&type=owner'

try {
  const response = await fetch(endpoint, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'aceykn-blog-build',
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {})
    },
    signal: AbortSignal.timeout(30_000)
  })
  if (!response.ok) throw new Error(`GitHub responded ${response.status}`)
  const repos = (await response.json())
    .filter((repo) => !repo.fork && !repo.archived)
    .map(({ id, name, description, language, html_url, updated_at }) => ({ id, name, description, language, html_url, updated_at }))
  await mkdir(join(process.cwd(), 'app', 'data'), { recursive: true })
  await writeFile(output, `${JSON.stringify(repos, null, 2)}\n`, 'utf8')
  console.log(`Synced ${repos.length} GitHub repositories.`)
} catch (error) {
  try {
    await readFile(output, 'utf8')
    console.warn(`GitHub sync failed; retained the last successful data (${error.message}).`)
  } catch {
    await mkdir(join(process.cwd(), 'app', 'data'), { recursive: true })
    await writeFile(output, '[]\n', 'utf8')
    console.warn(`GitHub sync failed; created an empty cache so the static build can continue (${error.message}).`)
  }
}
