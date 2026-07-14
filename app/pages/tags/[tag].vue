<script setup lang="ts">
import { newestFirst, type PersonalEntry } from '~/utils/content'

const route = useRoute()
const tag = computed(() => decodeURIComponent(String(route.params.tag)))
const { data: essays } = await useAsyncData('tag-essays', () =>
  queryCollection('essays').select('id', 'path', 'title', 'description', 'date', 'tags').all()
)
const { data: tech } = await useAsyncData('tag-tech', () =>
  queryCollection('tech').select('id', 'path', 'title', 'description', 'date', 'tags').all()
)
const matches = computed(() =>
  newestFirst([...(essays.value || []), ...(tech.value || [])] as PersonalEntry[]).filter((entry) => entry.tags?.includes(tag.value))
)

useSeoMeta({
  title: () => `#${tag.value}`,
  description: () => `標籤「${tag.value}」下的隨筆與技術文章。`
})
</script>

<template>
  <section class="content-shelf">
    <p class="eyebrow">標籤</p>
    <h1>#{{ tag }}</h1>
    <div class="content-list">
      <NuxtLink v-for="entry in matches" :key="entry.id" :to="entry.path"
        ><strong>{{ entry.title }}</strong>
        <p>{{ entry.description }}</p>
        <small>{{ entry.date }}</small></NuxtLink
      >
    </div>
    <p v-if="!matches.length" class="empty-note">暫時沒有這個標籤的文章。</p>
  </section>
</template>
