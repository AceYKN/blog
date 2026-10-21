import { writeFileSync, unlinkSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

if (!process.env.npm_execpath) throw new Error('Run this check using npm run test:publication')
const created = []
try {
  for (const kind of ['source', 'tech']) {
    const path = resolve('content', kind, '__publication_draft_[fixture]__.md')
    writeFileSync(
      path,
      `---
title: PRIVATE_PUBLICATION_SENTINEL_${kind}
description: Draft exclusion regression fixture
date: '2026-10-20'
updated: '2026-10-20'
tags: [private-publication-sentinel]
draft: true # A real YAML comment must not make the draft public.
cover: /og-image.png
---
# PRIVATE_PUBLICATION_SENTINEL_${kind}

This private body must not appear in HTML, search indexes, or Content database dumps.
`,
      { flag: 'wx' }
    )
    created.push(path)
  }
  // generate checks public serialized artifacts against these draft identities
  // while the source fixtures still exist.
  const build = spawnSync(process.execPath, [process.env.npm_execpath, 'run', 'generate'], { stdio: 'inherit' })
  if (build.error) throw build.error
  process.exitCode = build.status ?? 1
} finally {
  for (const path of created) unlinkSync(path)
}
