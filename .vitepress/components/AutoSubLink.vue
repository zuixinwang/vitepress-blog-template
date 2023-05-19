<template>
  <div :class="$style.root">
    <a
      v-for="({ href, text }, index) in subUrls"
      :key="index"
      :href="href"
      :class="$style.a"
    >
      {{ text }}
    </a>
  </div>
</template>

<script setup>
import { useRoute } from 'vitepress'
import { computed } from 'vue'
const { data: { relativePath } } = useRoute()
const subUrls = computed(() => {
  if (VITE_REWRITE_REVERSE_MAP && typeof VITE_REWRITE_REVERSE_MAP === 'object') {
    return VITE_REWRITE_REVERSE_MAP[relativePath]
  }
  return []
})
</script>

<style module>
.root {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
}
.a {
  padding: 10px;
}
</style>
