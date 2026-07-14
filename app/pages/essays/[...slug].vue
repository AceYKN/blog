<script setup lang="ts">
definePageMeta({ layout: 'reading' })

const { entry, status } = useContentPage('essays')
</script>
<template>
  <ContentArticle v-if="entry" :entry="entry" />
  <section v-else class="content-shelf">
    <p class="eyebrow">ESSAYS</p>
    <h1>{{ status === 'pending' ? '文章を開いています…' : '找不到這篇隨筆' }}</h1>
    <NuxtLink v-if="status !== 'pending'" to="/essays">返回隨筆</NuxtLink>
  </section>
</template>
