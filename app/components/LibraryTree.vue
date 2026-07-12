<script setup lang="ts">
import { entryTitle, entryUrl, sourcePath, type LibraryTree } from '~/utils/library'

defineOptions({ name: 'LibraryTree' })

const props = defineProps<{ node: LibraryTree; depth: number }>()
const itemCount = computed(() => {
  const count = (node: LibraryTree): number => node.entries.length + node.children.reduce((total, child) => total + count(child), 0)
  return count(props.node)
})
</script>

<template>
  <div v-if="node.children.length || node.entries.length" class="tree-node" :style="{ '--tree-depth': depth }">
    <details v-if="node.children.length" class="tree-branch" :open="depth <= 1">
      <summary><span>{{ node.name }}</span><small>{{ itemCount }} 篇</small></summary>
      <div class="tree-children">
        <LibraryTree v-for="child in node.children" :key="child.key" :node="child" :depth="depth + 1" />
        <NuxtLink v-for="entry in node.entries" :key="entry.id" :to="entryUrl(entry)" class="library-entry">
          <strong>{{ entryTitle(entry) }}</strong><span>{{ sourcePath(entry) }}</span>
        </NuxtLink>
      </div>
    </details>
    <template v-else>
      <NuxtLink v-for="entry in node.entries" :key="entry.id" :to="entryUrl(entry)" class="library-entry">
        <strong>{{ entryTitle(entry) }}</strong><span>{{ sourcePath(entry) }}</span>
      </NuxtLink>
    </template>
  </div>
</template>
