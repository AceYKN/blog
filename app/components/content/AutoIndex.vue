<script setup lang="ts">
import catalogue from '~/data/content-catalogue.json'
import { compareContentOrder } from '../../../lib/content-identity.mjs'

const props = defineProps<{ path: string; variant?: string; unwrapSingleGroup?: boolean }>()
const entries = computed(() => {
  const prefix = props.path.replace(/^\/|\/$/g, '')
  return catalogue.documents
    .filter((entry) => entry.kind === 'notes' && entry.path.startsWith(`${prefix}/`) && !/(^|\/)index$/.test(entry.path))
    .toSorted(compareContentOrder)
})
</script>

<template>
  <ul class="content-auto-index">
    <li v-for="entry in entries" :key="entry.id">
      <NuxtLink :to="entry.url">{{ entry.title }}</NuxtLink>
    </li>
  </ul>
</template>
