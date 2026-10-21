import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { format, resolveConfig } from 'prettier'
import { contentLastUpdated } from './content-last-updated.mjs'
import { collectContent } from './content-manifest.mjs'

const output = join(process.cwd(), 'app', 'data', 'note-metadata.ts')

const metadata = collectContent()
  .filter((document) => document.kind === 'notes')
  .map(({ file, path, sourceFile }) => {
    return [path, { updatedAt: contentLastUpdated(file), githubPath: `content/${sourceFile}` }]
  })

const resolved = Object.fromEntries(await Promise.all(metadata))
await mkdir(join(process.cwd(), 'app', 'data'), { recursive: true })
const source = `// Generated from content frontmatter and Git history. Do not edit by hand.\nexport const noteMetadata: Record<string, { updatedAt: string; githubPath: string }> = ${JSON.stringify(resolved, null, 2)} as const\n`
const prettierOptions = (await resolveConfig(output)) ?? {}
await writeFile(output, await format(source, { ...prettierOptions, filepath: output }), 'utf8')
