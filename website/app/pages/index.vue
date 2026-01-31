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
      <div class="flex gap-4 justify-center mt-4">
        <NuxtLink to="/how-it-works" class="text-sm text-fg-subtle hover:text-fg transition-colors">How it works →</NuxtLink>
        <NuxtLink to="https://github.com/unjs/db-compat" external class="text-sm text-fg-subtle hover:text-fg transition-colors">GitHub →</NuxtLink>
      </div>
    </header>

    <!-- Matrix -->
    <main class="max-w-6xl mx-auto px-4 pb-16">
      <!-- Kind Toggle -->
      <div class="flex justify-center mb-8">
        <div class="inline-flex gap-1 p-0.5 bg-bg-subtle border border-border-subtle rounded-md" role="tablist">
          <button
            v-for="tab in kindTabs"
            :key="tab.value"
            role="tab"
            :aria-selected="activeKind === tab.value"
            class="px-3 py-1.5 font-mono text-xs rounded border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/50"
            :class="activeKind === tab.value ? 'bg-bg text-fg border-border shadow-sm' : 'text-fg-subtle border-transparent hover:text-fg'"
            @click="activeKind = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Sticky header -->
      <div class="sticky top-0 z-20 bg-bg border border-border border-b-0 rounded-t-lg overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th class="text-left font-mono font-medium p-3 min-w-48 bg-bg-subtle text-fg">Capability</th>
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
      <div class="border border-border border-t-0 rounded-b-lg overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <tbody>
            <template v-for="(caps, category) in currentCapabilities" :key="category">
              <tr>
                <td :colspan="testedTargets.length + 1" class="pt-6 pb-2 px-3">
                  <span class="text-xs font-mono uppercase tracking-wide text-fg-subtle">{{ category }}</span>
                </td>
              </tr>
              <tr v-for="(cap, capId) in caps" :key="capId" class="group transition-colors hover:bg-bg-subtle border-t border-border-subtle">
                <td class="p-3 min-w-48">
                  <span class="font-mono text-sm text-fg">{{ capId }}</span>
                  <p class="text-xs mt-0.5 text-fg-subtle">{{ cap.description }}</p>
                </td>
                <td v-for="target in testedTargets" :key="target" class="p-3 text-center min-w-24">
                  <UIcon v-if="cap.support[target]?.supported" name="carbon:checkmark" class="size-4 mx-auto text-fg-muted" />
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
        <NuxtLink to="https://github.com/unjs/db-compat" external>GitHub</NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { CompatKind, TargetId } from 'db-compat-data'
import { compatData, targets } from 'db-compat-data'

const colorMode = useColorMode()
function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Kind toggle (sql vs db0)
const route = useRoute()
const router = useRouter()
const activeKind = computed<CompatKind>({
  get: () => (route.query.kind === 'db0' ? 'db0' : 'sql'),
  set: (val) => { router.replace({ query: val === 'sql' ? {} : { kind: val } }) },
})
const kindTabs: { label: string, value: CompatKind }[] = [
  { label: 'SQL', value: 'sql' },
  { label: 'db0 API', value: 'db0' },
]

const currentCapabilities = computed(() => compatData[activeKind.value])

const targetsMap = Object.fromEntries(targets.map(t => [t.id, t]))
const testedTargets = Object.keys(compatData.__meta.targets) as TargetId[]

function getTargetName(id: TargetId) {
  return targetsMap[id]?.name ?? id.replace('db0-', '')
}

function getConnectorUrl(id: TargetId) {
  const connector = targetsMap[id]?.connector
  return `https://github.com/unjs/db0/tree/main/src/connectors/${connector ?? id.replace('db0-', '')}`
}
</script>
