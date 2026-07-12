<script setup lang="ts">
const route = useRoute()
const slug = computed(() => Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug)
const { data: entry } = await useAsyncData(() => `project:${slug.value}`, () => queryCollection('projects').path(`/projects/${slug.value}`).first())
if (!entry.value) throw createError({ statusCode: 404, statusMessage: '找不到這個項目' })
</script>
<template><ContentArticle :entry="entry" /></template>
