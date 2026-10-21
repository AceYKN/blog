<script setup lang="ts">
import catalogue from '~/data/content-catalogue.json'

const route = useRoute()
const tag = computed(() => String(route.params.tag))
const matches = computed(() =>
  catalogue.documents
    .filter((entry) => (entry.tags as string[]).includes(tag.value))
    .toSorted((left, right) => right.updated.localeCompare(left.updated))
)

if (!matches.value.length) throw createError({ statusCode: 404, statusMessage: '找不到這個標籤' })

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
      <NuxtLink v-for="entry in matches" :key="entry.id" :to="entry.url"
        ><strong>{{ entry.title }}</strong>
        <p>{{ entry.description }}</p>
        <small>{{ entry.updated.slice(0, 10) }}</small></NuxtLink
      >
    </div>
    <p v-if="!matches.length" class="empty-note">暫時沒有這個標籤的文章。</p>
  </section>
</template>
