// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Multi-word component names aren't enforced for content-driven pages/layouts.
    'vue/multi-word-component-names': 'off',
    // This codebase relies on Vue 3 fragments (multiple root nodes) throughout.
    'vue/no-multiple-template-root': 'off',
    // Prettier owns Vue's void-element formatting; avoid contradictory autofixes.
    'vue/html-self-closing': 'off'
  }
})
