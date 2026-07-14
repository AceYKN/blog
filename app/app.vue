<script setup lang="ts">
// Cloudflare Web Analytics (cookie-free). Only injected when a beacon token is
// configured via NUXT_PUBLIC_CF_BEACON_TOKEN, so local dev stays clean.
const { cloudflareBeaconToken } = useRuntimeConfig().public
const route = useRoute()
const { siteUrl } = useRuntimeConfig().public
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
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
