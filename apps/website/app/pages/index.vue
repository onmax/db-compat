<template>
  <div class="min-h-screen bg-bg text-fg">
    <!-- Theme toggle -->
    <div class="fixed top-4 right-4 z-50">
      <button @click="toggleColorMode" class="p-2 rounded-md transition-colors bg-bg-subtle border border-border text-fg-muted hover:text-fg" aria-label="Toggle theme">
        <UIcon v-if="colorMode.value === 'dark'" name="carbon:sun" class="size-5" />
        <UIcon v-else name="carbon:moon" class="size-5" />
      </button>
    </div>

    <!-- Hero -->
    <header class="text-center py-16 px-4">
      <h1 class="text-4xl sm:text-5xl font-mono font-medium mb-3 text-fg">db-compat</h1>
      <p class="text-base max-w-md mx-auto text-fg-muted">
        Database capability matrix for <NuxtLink to="https://github.com/unjs/db0" external class="font-mono">db0</NuxtLink>
      </p>
    </header>

    <!-- Matrix -->
    <main class="max-w-6xl mx-auto px-4 pb-16">
      <!-- Sticky header outside scroll container -->
      <div class="sticky top-0 z-20 bg-bg">
        <table class="w-full text-sm border-collapse border border-border border-b-0 rounded-t-lg">
          <thead>
            <tr class="bg-bg-subtle">
              <th class="text-left font-mono font-medium p-3 min-w-48 bg-bg-subtle text-fg">
                <span class="transition-opacity duration-200">{{ activeCategory || 'Capability' }}</span>
              </th>
              <th v-for="target in testedTargets" :key="target" class="text-center font-mono text-xs p-3 min-w-24 bg-bg-subtle">
                <AppTooltip :text="`${compatData.__meta.targets[target].version} · ${compatData.__meta.targets[target].dialect}`" position="bottom">
                  <NuxtLink :to="getConnectorUrl(target)" external class="no-underline text-fg-muted hover:text-fg transition-colors">{{ getTargetName(target) }}</NuxtLink>
                </AppTooltip>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <!-- Scrollable body -->
      <div class="overflow-x-auto border border-border border-t-0 rounded-b-lg">
        <table class="w-full text-sm border-collapse">
          <tbody>
            <template v-for="(caps, category) in compatData.capabilities" :key="category">
              <!-- Category header (sentinel for intersection observer) -->
              <tr :ref="(el) => setCategoryRef(el, Object.keys(compatData.capabilities).indexOf(category as string))">
                <td :colspan="testedTargets.length + 1" class="pt-6 pb-2 px-3">
                  <span class="text-xs font-mono uppercase tracking-wide text-fg-subtle">{{ category }}</span>
                </td>
              </tr>
              <!-- Capability rows -->
              <tr v-for="(cap, capId) in caps" :key="capId" class="group transition-colors duration-150 hover:bg-bg-subtle border-t border-border-subtle">
                <td class="p-3 min-w-48">
                  <span class="font-mono text-sm text-fg">{{ capId }}</span>
                  <p class="text-xs mt-0.5 text-fg-subtle">{{ cap.description }}</p>
                </td>
                <td v-for="target in testedTargets" :key="target" class="p-3 text-center min-w-24">
                  <UIcon v-if="cap.support[target]?.supported" name="carbon:checkmark" class="size-5 mx-auto text-green-500" />
                  <UIcon v-else name="carbon:close" class="size-5 mx-auto text-red-500" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Footer -->
    <footer class="text-center text-sm py-8 px-4 text-fg-subtle border-t border-border-subtle">
      <p class="mb-2">Generated {{ new Date(compatData.__meta.generatedAt).toLocaleDateString() }}</p>
      <div class="flex gap-4 justify-center">
        <NuxtLink to="https://unjs.io" external>UnJS</NuxtLink>
        <NuxtLink to="https://github.com/unjs/db0" external>GitHub</NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { CompatibilityDataV2 } from '~/types'
import data from '~/data/data.json'

const colorMode = useColorMode()
function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Track active category for sticky header using VueUse
const activeCategory = ref<string | null>(null)
const categoryElements = ref<HTMLElement[]>([])
const categories = computed(() => Object.keys(compatData.capabilities))

function setCategoryRef(el: Element | ComponentPublicInstance | null, index: number) {
  if (el) categoryElements.value[index] = el as HTMLElement
}

// Set up intersection observers for each category
onMounted(() => {
  categoryElements.value.forEach((el, index) => {
    useIntersectionObserver(el, ([{ isIntersecting }]) => {
      if (isIntersecting) activeCategory.value = categories.value[index]
    }, { rootMargin: '-60px 0px -80% 0px' })
  })
})

const targetNames: Record<string, string> = {
  'db0-better-sqlite3': 'better-sqlite3',
  'db0-libsql': 'libSQL',
  'db0-bun-sqlite': 'Bun SQLite',
  'db0-node-sqlite': 'Node SQLite',
  'db0-sqlite3': 'sqlite3',
  'db0-cloudflare-d1': 'D1',
  'db0-pglite': 'PGlite',
  'db0-postgresql': 'PostgreSQL',
  'db0-hyperdrive-postgresql': 'Hyperdrive PG',
  'db0-mysql2': 'MySQL',
  'db0-planetscale': 'PlanetScale',
  'db0-hyperdrive-mysql': 'Hyperdrive MySQL',
}

const compatData = data as CompatibilityDataV2
const testedTargets = Object.keys(compatData.__meta.targets)

function getTargetName(id: string) {
  return targetNames[id] ?? id.replace('db0-', '')
}

const connectorUrls: Record<string, string> = {
  'db0-better-sqlite3': 'https://github.com/unjs/db0/tree/main/src/connectors/better-sqlite3',
  'db0-libsql': 'https://github.com/unjs/db0/tree/main/src/connectors/libsql',
  'db0-bun-sqlite': 'https://github.com/unjs/db0/tree/main/src/connectors/bun-sqlite',
  'db0-node-sqlite': 'https://github.com/unjs/db0/tree/main/src/connectors/node-sqlite',
  'db0-sqlite3': 'https://github.com/unjs/db0/tree/main/src/connectors/sqlite3',
  'db0-cloudflare-d1': 'https://github.com/unjs/db0/tree/main/src/connectors/cloudflare-d1',
  'db0-pglite': 'https://github.com/unjs/db0/tree/main/src/connectors/pglite',
  'db0-postgresql': 'https://github.com/unjs/db0/tree/main/src/connectors/postgresql',
  'db0-mysql2': 'https://github.com/unjs/db0/tree/main/src/connectors/mysql2',
  'db0-planetscale': 'https://github.com/unjs/db0/tree/main/src/connectors/planetscale',
}

function getConnectorUrl(id: string) {
  return connectorUrls[id] ?? `https://github.com/unjs/db0/tree/main/src/connectors/${id.replace('db0-', '')}`
}
</script>
