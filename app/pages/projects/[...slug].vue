<script setup lang="ts">
const entry = await useContentPage('projects', '找不到這個項目')
</script>
<template><ContentArticle :entry="entry" /></template>
