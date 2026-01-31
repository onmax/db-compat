<template>
  <div class="min-h-screen bg-bg text-fg">
    <!-- Theme toggle -->
    <div class="fixed top-4 right-4 z-50">
      <ThemeToggle />
    </div>

    <!-- Header -->
    <header class="text-center py-16 px-4">
      <NuxtLink to="/" class="text-4xl sm:text-5xl font-mono font-medium mb-3 text-fg no-underline hover:opacity-80 transition-opacity">db-compat</NuxtLink>
    </header>

    <!-- Content -->
    <main class="max-w-3xl mx-auto px-4 pb-16">
      <NuxtLink to="/" class="text-sm text-fg-subtle hover:text-fg no-underline">← Back</NuxtLink>
      <ContentRenderer v-if="page" :value="page" class="prose prose-neutral dark:prose-invert prose-content max-w-none mt-8" />
    </main>

    <!-- Footer -->
    <footer class="text-center text-sm py-8 px-4 text-fg-subtle border-t border-border-subtle">
      <div class="flex gap-4 justify-center">
        <NuxtLink to="https://unjs.io" external>UnJS</NuxtLink>
        <NuxtLink to="https://github.com/unjs/db-compat" external>GitHub</NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('how-it-works', () => queryCollection('content').path('/how-it-works').first())
</script>
