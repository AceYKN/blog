<script setup lang="ts">
const { cloudflareBeaconToken, googleAnalyticsId, siteUrl } = useRuntimeConfig().public
const route = useRoute()
const canonicalUrl = computed(() => `${siteUrl.replace(/\/$/, '')}${route.path}`)

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl.value
    }
  ],
  meta: [{ property: 'og:url', content: canonicalUrl.value }],
  script: [
    {
      key: 'site-structured-data',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${siteUrl.replace(/\/$/, '')}/#website`,
            name: 'AceYKN Blog',
            alternateName: 'blog',
            url: `${siteUrl.replace(/\/$/, '')}/`,
            inLanguage: 'zh-Hant'
          },
          {
            '@type': 'Person',
            '@id': `${siteUrl.replace(/\/$/, '')}/#aceykn`,
            name: 'AceYKN',
            url: `${siteUrl.replace(/\/$/, '')}/`,
            sameAs: ['https://github.com/AceYKN']
          }
        ]
      })
    }
  ]
}))

if (cloudflareBeaconToken) {
  useHead({
    script: [
      {
        src: 'https://static.cloudflareinsights.com/beacon.min.js',
        defer: true,
        'data-cf-beacon': JSON.stringify({ token: cloudflareBeaconToken })
      }
    ]
  })
}

// Enhanced Measurement records Nuxt's browser-history route changes, so only
// configure the tag once here to avoid duplicate page_view events.
if (googleAnalyticsId) {
  useHead({
    script: [
      {
        key: 'google-analytics-loader',
        src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId)}`,
        async: true
      },
      {
        key: 'google-analytics-config',
        innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config',${JSON.stringify(googleAnalyticsId)});`
      }
    ]
  })
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
