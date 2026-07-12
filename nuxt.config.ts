export default defineNuxtConfig({
  compatibilityDate: '2026-07-12',
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxt/content'],
  css: ['~/assets/css/main.css', 'katex/dist/katex.min.css'],
  app: {
    // GitHub project sites are served from /<repository>/, while Cloudflare
    // Pages and local development use the domain root.
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'zh-Hant' },
      title: 'blog',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '學習筆記、文章與工作紀錄。' }
      ],
      script: [
        {
          innerHTML: "try { const saved = localStorage.getItem('theme'); document.documentElement.dataset.theme = saved === 'light' || saved === 'dark' ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') } catch {}"
        }
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
