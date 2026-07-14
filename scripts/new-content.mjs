import { access, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const args = process.argv.slice(2)
const valueAfter = (flag) => args[args.indexOf(flag) + 1]
const type = valueAfter('--type')
const slug = valueAfter('--slug')
const allowed = new Set(['essays', 'tech', 'projects'])

if (!allowed.has(type) || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  throw new Error('Usage: npm run new -- --type essays|tech|projects --slug my-post (slug uses lowercase letters, digits and hyphens)')
}

const target = join(process.cwd(), 'content', type, `${slug}.md`)
try {
  await access(target)
  throw new Error(`${target} already exists.`)
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

const today = new Date().toISOString().slice(0, 10)
await mkdir(join(process.cwd(), 'content', type), { recursive: true })
await writeFile(
  target,
  `---\ntitle: ${slug.replace(/-/g, ' ')}\ndescription: 一句话摘要。\ndate: ${today}\nupdated: ${today}\ntags: []\ndraft: true\ncover: /og-image.png\n---\n\n# ${slug.replace(/-/g, ' ')}\n\n正文写在这里。\n`,
  'utf8'
)
console.log(`Created ${target}`)
