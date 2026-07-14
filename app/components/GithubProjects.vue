<script setup lang="ts">
import { site } from '~/config/site'

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
const { data, pending, error } = await useFetch<GithubRepo[]>(`https://api.github.com/users/${site.githubUsername}/repos`, {
  server: false,
  query: { sort: 'updated', direction: 'desc', per_page: 100, type: 'owner' }
})
const repos = computed(() => (data.value || []).filter((repo) => !repo.fork && !repo.archived).slice(0, props.limit))
</script>

<template>
  <div :class="['github-projects', { compact: limit <= 3 }]">
    <a v-for="repo in repos" :key="repo.id" :href="repo.html_url" target="_blank" rel="noreferrer" class="repo-card"
      ><span>{{ repo.language || 'Repository' }}</span
      ><strong>{{ repo.name }}</strong>
      <p>{{ repo.description || '暫無說明。' }}</p>
      <small>GitHub ↗</small></a
    >
    <p v-if="pending" class="empty-note">正在取得 GitHub 專案…</p>
    <p v-else-if="error" class="empty-note">暫時無法取得 GitHub 專案。</p>
  </div>
</template>
