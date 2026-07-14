<script setup lang="ts">
let sequence = 0

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
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'neutral'
        })
        const { svg } = await mermaid.render(`mermaid-${sequence++}`, code.textContent || '')
        const diagram = document.createElement('div')
        diagram.className = 'mermaid-diagram'
        diagram.setAttribute('role', 'img')
        diagram.setAttribute('aria-label', 'Mermaid diagram')
        diagram.innerHTML = svg
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

onMounted(() => {
  void nextTick(() => enhance())
})
</script>

<template><span class="content-enhancements" aria-hidden="true" /></template>
