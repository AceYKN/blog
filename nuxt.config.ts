export default defineNuxtConfig({
  compatibilityDate: '2026-07-12',
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxt/content'],
  css: ['~/assets/css/main.css', 'katex/dist/katex.min.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'zh-Hant' },
      title: 'blog',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '學習筆記、文章與工作紀錄。' }
      ]
    }
  },
  content: {
    build: {
      markdown: {
        remarkPlugins: {
          'remark-math': {}
        },
        rehypePlugins: {
          'rehype-katex': {}
        }
      }
    }
  },
  nitro: {
    prerender: {
      crawlLinks: false
    }
  }
})
