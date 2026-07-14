<script setup lang="ts">
const route = useRoute()
const progress = ref(0)

const update = () => {
  const root = document.documentElement
  const maximum = root.scrollHeight - window.innerHeight
  progress.value = maximum > 0 ? Math.min(100, Math.max(0, (window.scrollY / maximum) * 100)) : 0
}

// Nuxt reuses the layout instance across route changes, so recompute after
// the new page's content has actually rendered.
watch(
  () => route.fullPath,
  () => nextTick(update)
)

onMounted(() => {
  window.addEventListener('scroll', update, { passive: true })
  update()
})
onBeforeUnmount(() => window.removeEventListener('scroll', update))
</script>

<template>
  <div class="reading-progress" :style="{ transform: `scaleX(${progress / 100})` }" aria-hidden="true" />
</template>
