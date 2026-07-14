<script setup lang="ts">
import repos from '~/data/github-projects.json'

type GithubRepo = {
  id: number
  name: string
  description: string | null
  language: string | null
  html_url: string
  fork: boolean
  archived: boolean
  updated_at: string
}
const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 12 })
const visibleRepos = computed(() => (repos as GithubRepo[]).slice(0, props.limit))
</script>

<template>
  <div :class="['github-projects', { compact: limit <= 3 }]">
    <a v-for="repo in visibleRepos" :key="repo.id" :href="repo.html_url" target="_blank" rel="noreferrer" class="repo-card"
      ><span>{{ repo.language || 'Repository' }}</span
      ><strong>{{ repo.name }}</strong>
      <p>{{ repo.description || '暫無說明。' }}</p>
      <small>GitHub ↗</small></a
    >
    <p v-if="!visibleRepos.length" class="empty-note">目前沒有可顯示的公開專案。</p>
  </div>
</template>
