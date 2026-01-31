<template>
  <div class="min-h-screen bg-bg text-fg">
    <!-- Theme toggle -->
    <div class="fixed top-4 right-4 z-50">
      <button @click="toggleColorMode" class="p-2 rounded-md transition-colors bg-bg-subtle border border-border text-fg-muted hover:text-fg" aria-label="Toggle theme">
        <UIcon v-if="colorMode.value === 'dark'" name="carbon:sun" class="size-5" />
        <UIcon v-else name="carbon:moon" class="size-5" />
      </button>
    </div>

    <!-- Header -->
    <header class="text-center py-16 px-4">
      <NuxtLink to="/" class="text-4xl sm:text-5xl font-mono font-medium mb-3 text-fg no-underline hover:opacity-80 transition-opacity">db-compat</NuxtLink>
    </header>

    <!-- Content -->
    <main class="max-w-3xl mx-auto px-4 pb-16">
      <ContentRenderer v-if="page" :value="page" class="prose prose-neutral dark:prose-invert max-w-none" />
    </main>

    <!-- Footer -->
    <footer class="text-center text-sm py-8 px-4 text-fg-subtle border-t border-border-subtle">
      <div class="flex gap-4 justify-center">
        <NuxtLink to="https://unjs.io" external>UnJS</NuxtLink>
        <NuxtLink to="https://github.com/unjs/db0" external>GitHub</NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('how-it-works', () => queryCollection('content').path('/how-it-works').first())

const colorMode = useColorMode()
function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
