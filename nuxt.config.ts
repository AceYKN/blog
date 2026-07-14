export default defineNuxtConfig({
  compatibilityDate: '2026-07-12',
  ssr: false,
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

  // Hybrid rendering: the whole site is deployed as a static export (see README).
  // Prerendering these "shell" routes at build time gives them real server-rendered
  // HTML, so OG/Twitter meta and text content are visible to crawlers that don't
  // execute JS. The 100+ individual notes/essays/tech/projects pages are left to the
  // Cloudflare Pages' native SPA fallback and are rendered client-side
  // after hydration — crawling/prerendering all of them blows past the available
  // memory during `nuxt generate` (@nuxt/content's SQLite-backed prerender is not
  // cheap per route yet). If this ever moves to Cloudflare Pages Functions (nitro
  // preset "cloudflare-pages"), swap `prerender: true` for `isr: <seconds>` below,
  // and prerender individual content routes gradually/selectively instead of via
  // `crawlLinks`.
  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
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
      failOnError: false
    }
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
      cloudflareBeaconToken: process.env.NUXT_PUBLIC_CF_BEACON_TOKEN || ''
    }
  }
})
