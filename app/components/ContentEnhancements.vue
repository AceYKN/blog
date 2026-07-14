<script setup lang="ts">
let sequence = 0

async function renderMermaid(diagram: HTMLElement, source: string) {
  const mermaid = (await import('mermaid')).default
  const dark = document.documentElement.dataset.theme === 'dark'
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: dark ? 'dark' : 'neutral',
    themeVariables: dark
      ? {
          background: '#202a22',
          primaryColor: '#222c24',
          primaryTextColor: '#ece9dd',
          primaryBorderColor: '#a9c9af',
          lineColor: '#b8c8ee',
          secondaryColor: '#2d291f',
          tertiaryColor: '#302321'
        }
      : {
          background: '#e4e9e2',
          primaryColor: '#e4ebe5',
          primaryTextColor: '#20251e',
          primaryBorderColor: '#466555',
          lineColor: '#465875',
          secondaryColor: '#eee2d3',
          tertiaryColor: '#e9d9d4'
        }
  })
  const { svg } = await mermaid.render(`mermaid-${sequence++}`, source)
  diagram.dataset.source = source
  diagram.setAttribute('role', 'img')
  diagram.setAttribute('aria-label', 'Mermaid diagram')
  diagram.innerHTML = svg
}

async function enhance(root: ParentNode = document) {
  const blocks = [...root.querySelectorAll<HTMLElement>('.prose pre')]
  for (const block of blocks) {
    const code = block.querySelector<HTMLElement>('code')
    if (!code || block.dataset.enhanced) continue
    block.dataset.enhanced = 'true'
    const language = [...code.classList].find((name) => name.startsWith('language-'))?.replace('language-', '') || 'text'
    const meta = block.dataset.meta || code.dataset.meta || ''
    const filename = meta
      .match(/\[([^\]]+)]|(?:filename|file)=([^\s]+)/)
      ?.slice(1)
      .find(Boolean)

    if (language === 'mermaid') {
      try {
        const diagram = document.createElement('div')
        diagram.className = 'mermaid-diagram'
        await renderMermaid(diagram, code.textContent || '')
        block.replaceWith(diagram)
        continue
      } catch {
        block.dataset.enhanced = ''
      }
    }

    const header = document.createElement('div')
    header.className = 'code-header'
    const label = document.createElement('span')
    label.textContent = filename || block.dataset.filename || language
    const copy = document.createElement('button')
    copy.type = 'button'
    copy.className = 'code-copy'
    copy.textContent = '複製'
    copy.addEventListener('click', async () => {
      await navigator.clipboard.writeText(code.textContent || '')
      copy.textContent = '已複製'
      window.setTimeout(() => (copy.textContent = '複製'), 1400)
    })
    header.append(label, copy)
    block.prepend(header)
  }
}

async function refreshMermaid() {
  const diagrams = [...document.querySelectorAll<HTMLElement>('.mermaid-diagram')]
  await Promise.all(
    diagrams.map(async (diagram) => {
      const source = diagram.dataset.source
      if (!source) return
      try {
        await renderMermaid(diagram, source)
      } catch {
        // Keep the existing diagram visible if a re-render fails.
      }
    })
  )
}

onMounted(() => {
  void nextTick(() => enhance())
  window.addEventListener('blog:themechange', refreshMermaid)
})

onBeforeUnmount(() => {
  window.removeEventListener('blog:themechange', refreshMermaid)
})
</script>

<template><span class="content-enhancements" aria-hidden="true" /></template>
