<script setup lang="ts">
const { data: entries } = await useAsyncData('tech', () =>
  queryCollection('tech').where('draft', '=', false).select('id', 'stem', 'path', 'title', 'description', 'date', 'updated', 'tags').all()
)

useSeoMeta({
  title: '技術',
  description: '代码、折腾、实践和能复用的经验。',
  ogTitle: '技術 · blog',
  ogDescription: '代码、折腾、实践和能复用的经验。',
  twitterCard: 'summary_large_image'
})
</script>
<template><ContentShelf title="技術" eyebrow="TECH" :entries="entries" empty="代码、折腾、实践和能复用的经验。" /></template>
