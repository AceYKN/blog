<script setup lang="ts">
const { data: entries } = await useAsyncData('tech', () => queryCollection('tech').select('id', 'path', 'title', 'description').all())
</script>
<template><ContentShelf title="技術" eyebrow="TECH" :entries="entries" empty="代码、折腾、实践和能复用的经验。" /></template>
