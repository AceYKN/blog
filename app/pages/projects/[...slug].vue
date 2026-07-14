<script setup lang="ts">
const { entry, status } = useContentPage('projects')
</script>
<template>
  <ContentArticle v-if="entry" :entry="entry" />
  <section v-else class="content-shelf">
    <p class="eyebrow">PROJECTS</p>
    <h1>{{ status === 'pending' ? '項目を開いています…' : '找不到這個項目' }}</h1>
    <NuxtLink v-if="status !== 'pending'" to="/projects">返回項目</NuxtLink>
  </section>
</template>
