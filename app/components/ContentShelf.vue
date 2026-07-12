<script setup lang="ts">
import { allTags, newestFirst, type PersonalEntry } from '~/utils/content'

const props = defineProps<{ title: string; eyebrow: string; empty: string; entries: PersonalEntry[] | null | undefined }>()
const sortedEntries = computed(() => newestFirst(props.entries || []))
const tags = computed(() => allTags(props.entries || []))
</script>

<template>
  <section class="content-shelf">
    <p class="eyebrow">{{ eyebrow }}</p><h1>{{ title }}</h1>
    <div v-if="tags.length" class="tag-list content-tags"><NuxtLink v-for="tag in tags" :key="tag" :to="`/tags/${encodeURIComponent(tag)}`">#{{ tag }}</NuxtLink></div>
    <div v-if="sortedEntries.length" class="content-list"><NuxtLink v-for="entry in sortedEntries" :key="entry.id" :to="entry.path"><strong>{{ entry.title }}</strong><p>{{ entry.description }}</p><small>{{ entry.date || entry.path.replace(/^\//, '') }}</small></NuxtLink></div>
    <p v-else class="empty-note">{{ empty }}</p>
  </section>
</template>
