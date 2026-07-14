<script setup lang="ts">
const { data: entries } = await useAsyncData('essays', () =>
  queryCollection('essays').select('id', 'path', 'title', 'description', 'date', 'tags').all()
)

useSeoMeta({
  title: '隨筆',
  description: '生活、感想、读到的事，想写就写。',
  ogTitle: '隨筆 · blog',
  ogDescription: '生活、感想、读到的事，想写就写。',
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image'
})
</script>
<template><ContentShelf title="隨筆" eyebrow="ESSAYS" :entries="entries" empty="生活、感想、读到的事，想写就写。" /></template>
