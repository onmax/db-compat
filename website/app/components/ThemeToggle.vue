<template>
  <button @click="toggle" class="size-9 flex items-center justify-center rounded-md transition-colors bg-bg-subtle border border-border text-fg-muted hover:text-fg" aria-label="Toggle theme">
    <UIcon v-if="colorMode.value === 'dark'" name="carbon:sun" class="size-5" />
    <UIcon v-else name="carbon:moon" class="size-5" />
  </button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
