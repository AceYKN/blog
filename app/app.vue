<script setup lang="ts">
// Cloudflare Web Analytics (cookie-free). Only injected when a beacon token is
// configured via NUXT_PUBLIC_CF_BEACON_TOKEN, so local dev stays clean.
const { cloudflareBeaconToken } = useRuntimeConfig().public
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
