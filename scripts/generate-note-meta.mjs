import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
import { format, resolveConfig } from 'prettier'

const root = join(process.cwd(), 'content', 'source')
const output = join(process.cwd(), 'app', 'data', 'note-metadata.ts')

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => (entry.isDirectory() ? collect(join(directory, entry.name)) : [join(directory, entry.name)]))
  )
  return files.flat()
}

const metadata = (await collect(root))
  .filter((file) => file.endsWith('.md'))
  .map(async (file) => {
    const info = await stat(file)
    const source = relative(root, file).split(sep).join('/')
    const key = source.replace(/\.md$/, '')
    return [key, { updatedAt: info.mtime.toISOString(), githubPath: `docs/${source}` }]
  })

const resolved = Object.fromEntries(await Promise.all(metadata))
await mkdir(join(process.cwd(), 'app', 'data'), { recursive: true })
const source = `// Generated from original file timestamps. Do not edit by hand.\nexport const noteMetadata: Record<string, { updatedAt: string; githubPath: string }> = ${JSON.stringify(resolved, null, 2)} as const\n`
const prettierOptions = (await resolveConfig(output)) ?? {}
await writeFile(output, await format(source, { ...prettierOptions, filepath: output }), 'utf8')
