<script setup lang="ts">
const route = useRoute()
const slug = computed(() => Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug)
const { data: entry } = await useAsyncData(() => `tech:${slug.value}`, () => queryCollection('tech').path(`/tech/${slug.value}`).first())
if (!entry.value) throw createError({ statusCode: 404, statusMessage: '找不到這篇技術文章' })
</script>
<template><ContentArticle :entry="entry" /></template>
