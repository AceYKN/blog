import { contentRoutes } from './scripts/content-routes.mjs'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-12',
  ssr: true,
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxtjs/sitemap', '@nuxtjs/robots'],
  css: ['~/assets/css/main.css', 'katex/dist/katex.min.css'],

  // Used by @nuxtjs/sitemap, @nuxtjs/robots and OG/canonical URL generation.
  // Override in production via NUXT_PUBLIC_SITE_URL.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://aceykn-blog.pages.dev',
    name: 'blog',
    description: '學習筆記、文章與工作紀錄。',
    defaultLocale: 'zh-Hant'
  },

  app: {
    // GitHub project sites are served from /<repository>/, while Cloudflare
    // Pages and local development use the domain root.
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'zh-Hant' },
      title: 'blog',
      titleTemplate: '%s · blog',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '學習筆記、文章與工作紀錄。' },
        { name: 'google-site-verification', content: 'fK_ZazKGBmk9Zu5OsiJAVEoaJCHqy4os1J3_6CmJyLo' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'blog' },
        { property: 'og:locale', content: 'zh_Hant' },
        { property: 'og:title', content: 'blog' },
        { property: 'og:description', content: '學習筆記、文章與工作紀錄。' },
        { property: 'og:image', content: '/og-image.png' },
        // No twitter:title/description: Twitter/X falls back to og:title/og:description
        // when they're absent, so pages only need to override the two og: tags above.
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: '/og-image.png' }
      ],
      script: [
        {
          innerHTML:
            "try { const saved = localStorage.getItem('theme'); document.documentElement.dataset.theme = saved === 'light' || saved === 'dark' ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') } catch {}"
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

  // Static HTML is deliberate: search engines and AI crawlers can read each
  // document without executing JavaScript. The manifest is built from Markdown
  // filenames only, leaving the migrated note content untouched.
  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/schedule': { prerender: true },
    '/library': { prerender: true },
    '/essays': { prerender: true },
    '/tech': { prerender: true },
    '/projects': { prerender: true }
  },

  nitro: {
    output: {
      publicDir: 'dist'
    },
    prerender: {
      crawlLinks: false,
      failOnError: true,
      routes: contentRoutes.map(({ route }) => route)
    }
  },

  sitemap: {
    urls: contentRoutes.map(({ route, lastmod }) => ({ loc: route, lastmod }))
  },

  // Prettier owns code formatting; disable @nuxt/eslint's stylistic rules to avoid conflicts.
  eslint: {
    config: {
      stylistic: false
    }
  },

  // Cloudflare Web Analytics is cookie-free and free on Cloudflare Pages. Set
  // NUXT_PUBLIC_CF_BEACON_TOKEN in the Pages project settings to enable it;
  // leave it unset locally/in dev and nothing is injected.
  runtimeConfig: {
    public: {
      cloudflareBeaconToken: process.env.NUXT_PUBLIC_CF_BEACON_TOKEN || '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://aceykn-blog.pages.dev'
    }
  }
})
