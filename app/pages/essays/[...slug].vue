<script setup lang="ts">
definePageMeta({ layout: 'reading' })

const entry = await useContentPage('essays', '找不到這篇隨筆')
</script>
<template><ContentArticle :entry="entry" /></template>
