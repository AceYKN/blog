<script setup lang="ts">
definePageMeta({ layout: 'reading' })

const { entry, status } = useContentPage('tech')
</script>
<template>
  <ContentArticle v-if="entry" :entry="entry" />
  <section v-else class="content-shelf">
    <p class="eyebrow">TECH</p>
    <h1>{{ status === 'pending' ? '文章を開いています…' : '找不到這篇技術文章' }}</h1>
    <NuxtLink v-if="status !== 'pending'" to="/tech">返回技術文章</NuxtLink>
  </section>
</template>
