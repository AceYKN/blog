<script setup lang="ts">
definePageMeta({ layout: 'reading' })

const entry = await useContentPage('tech', '找不到這篇技術文章')
</script>
<template><ContentArticle :entry="entry" /></template>
