<script setup lang="ts">
const { data: entries } = await useAsyncData('essays', () => queryCollection('essays').select('id', 'path', 'title', 'description').all())
</script>
<template><ContentShelf title="隨筆" eyebrow="ESSAYS" :entries="entries" empty="生活、感想、读到的事，想写就写。" /></template>
