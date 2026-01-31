<template>
  <div class="min-h-screen bg-bg text-fg">
    <!-- Theme toggle -->
    <div class="fixed top-4 right-4 z-50">
      <ThemeToggle />
    </div>

    <!-- Hero -->
    <header class="text-center py-16 px-4">
      <h1 class="text-4xl sm:text-5xl font-mono font-medium mb-3 text-fg">db-compat</h1>
      <p class="text-base max-w-lg mx-auto text-fg-muted leading-relaxed">
        Compare SQL and API capabilities across SQLite, PostgreSQL, and MySQL.
        Test what features work with each <NuxtLink to="https://github.com/unjs/db0" external class="font-mono">db0</NuxtLink> connector—transactions, JSON, CTEs, full-text search, and more.
      </p>
      <div class="max-w-lg mx-auto mt-4 rounded-md border border-yellow-600/20 bg-yellow-500/5 px-3 py-2 flex items-center gap-2">
        <UIcon name="carbon:warning" class="size-3.5 text-yellow-600 dark:text-yellow-500 shrink-0" />
        <p class="text-xs text-yellow-700 dark:text-yellow-500/90">Auto-generated data, may not be 100% accurate.</p>
      </div>
      <div class="flex gap-4 justify-center mt-4">
        <NuxtLink to="/how-it-works" class="text-sm text-fg-subtle hover:text-fg transition-colors">How it works →</NuxtLink>
        <NuxtLink to="https://github.com/unjs/db-compat" external class="text-sm text-fg-subtle hover:text-fg transition-colors">GitHub →</NuxtLink>
      </div>
    </header>

    <!-- Matrix -->
    <main class="mx-auto px-4 pb-16">
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

      <!-- Table -->
      <div class="border border-border rounded-lg overflow-x-auto">
        <table class="w-full text-sm border-collapse table-fixed">
          <colgroup>
            <col class="w-48">
            <col v-for="_ in allTargets" :key="_" class="w-14">
          </colgroup>
          <thead class="sticky top-0 z-20">
            <tr>
              <th rowspan="2" class="text-left font-mono font-medium p-2 bg-bg-subtle text-fg border-b border-border-subtle">Capability</th>
              <th v-if="sqliteTargets.length" :colspan="sqliteTargets.length" class="text-center font-mono text-xs p-2 bg-bg-subtle text-fg-muted border-l border-l-border-subtle">SQLite</th>
              <th v-if="postgresTargets.length" :colspan="postgresTargets.length" class="text-center font-mono text-xs p-2 bg-bg-subtle text-fg-muted border-l border-l-border-subtle">PostgreSQL</th>
              <th v-if="mysqlTargets.length" :colspan="mysqlTargets.length" class="text-center font-mono text-xs p-2 bg-bg-subtle text-fg-muted border-l border-l-border-subtle">MySQL</th>
            </tr>
            <tr>
              <th v-for="(target, idx) in allTargets" :key="target" class="p-2 bg-bg-subtle align-middle text-center border-b border-border-subtle" :class="{ 'border-l border-l-border-subtle': idx === 0 || idx === sqliteTargets.length || idx === sqliteTargets.length + postgresTargets.length }">
                <ConnectorPopover :target="target" :has-data="hasData(target)" />
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(caps, category) in currentCapabilities" :key="category">
              <tr>
                <td :colspan="allTargets.length + 1" class="pt-6 pb-2 px-3 bg-bg">
                  <span class="text-xs font-mono uppercase tracking-wide text-fg-subtle">{{ category }}</span>
                </td>
              </tr>
              <tr v-for="(cap, capId) in caps" :key="capId" class="group transition-colors hover:bg-bg-subtle border-t border-border-subtle">
                <td class="p-2 bg-bg">
                  <span class="font-mono text-sm text-fg">{{ capId }}</span>
                  <p class="text-xs mt-0.5 text-fg-subtle">{{ cap.description }}</p>
                </td>
                <td v-for="target in allTargets" :key="target" class="p-2 text-center bg-bg">
                  <template v-if="hasData(target)">
                    <UIcon v-if="cap.support[target]?.supported" name="carbon:checkmark" class="size-4 mx-auto text-fg-muted" />
                  </template>
                  <span v-else class="text-fg-subtle/40">—</span>
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

const hasData = (id: TargetId) => id in compatData.__meta.targets

// Group all defined targets by dialect
const sqliteTargets = targets.filter(t => t.dialect === 'sqlite').map(t => t.id)
const postgresTargets = targets.filter(t => t.dialect === 'postgresql').map(t => t.id)
const mysqlTargets = targets.filter(t => t.dialect === 'mysql').map(t => t.id)

// All targets ordered by dialect
const allTargets = [...sqliteTargets, ...postgresTargets, ...mysqlTargets]
</script>
