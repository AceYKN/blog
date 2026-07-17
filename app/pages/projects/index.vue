<script setup lang="ts">
useSeoMeta({
  title: '項目',
  description: '公开仓库会自动显示在这里；点击卡片可直接前往 GitHub。',
  ogTitle: '項目 · blog',
  ogDescription: '公开仓库会自动显示在这里；点击卡片可直接前往 GitHub。',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <section class="content-shelf">
    <p class="eyebrow">GITHUB / ACEYKN</p>
    <h1>項目</h1>
    <p class="project-intro">公开仓库会自动显示在这里；点击卡片可直接前往 GitHub。</p>
    <GithubProjects />
  </section>
</template>
