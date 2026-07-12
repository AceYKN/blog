<script setup lang="ts">
const route = useRoute()
const slug = computed(() => Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug)
const { data: entry } = await useAsyncData(() => `essay:${slug.value}`, () => queryCollection('essays').path(`/essays/${slug.value}`).first())
if (!entry.value) throw createError({ statusCode: 404, statusMessage: '找不到這篇隨筆' })
</script>
<template><ContentArticle :entry="entry" /></template>
