<template>
  <div class="min-h-screen bg-bg text-fg">
    <!-- Hero -->
    <header class="relative text-center py-16 px-4">
      <div class="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 class="text-4xl sm:text-5xl font-mono font-medium mb-3 text-fg">db0 Capabilities</h1>
      <p class="text-base max-w-lg mx-auto text-fg-muted leading-relaxed">
        Simplified capability matrix for <NuxtLink to="https://github.com/unjs/db0" external class="underline hover:text-fg">db0</NuxtLink> users.
        Shows the 7 key capabilities exposed by the db0 abstraction layer.
      </p>
      <div class="flex gap-4 justify-center mt-4">
        <NuxtLink to="/" class="text-sm text-fg-subtle hover:text-fg transition-colors">← Full SQL Matrix</NuxtLink>
        <NuxtLink to="https://github.com/onmax/db-compat" external class="text-sm text-fg-subtle hover:text-fg transition-colors">GitHub →</NuxtLink>
      </div>
    </header>

    <!-- Matrix -->
    <main class="mx-auto px-4 pb-16">
      <div class="border border-border rounded-lg overflow-clip">
        <!-- Sticky header -->
        <div class="sticky top-0 z-20 bg-bg">
          <table class="w-full text-sm border-collapse table-fixed">
            <colgroup>
              <col class="w-48">
              <col v-for="_ in allTargets" :key="_" class="w-14">
            </colgroup>
            <thead>
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
          </table>
        </div>
        <!-- Body -->
        <div>
          <table class="w-full text-sm border-collapse table-fixed">
            <colgroup>
              <col class="w-48">
              <col v-for="_ in allTargets" :key="_" class="w-14">
            </colgroup>
            <tbody>
              <tr v-for="(cap, capIdx) in db0CapabilityList" :key="cap.key" class="group transition-colors hover:bg-bg-subtle" :class="capIdx > 0 && 'border-t border-border-subtle'">
                <td class="p-2">
                  <span class="font-mono text-sm text-fg">{{ cap.key }}</span>
                  <p class="text-xs mt-0.5 text-fg-subtle">{{ cap.description }}</p>
                </td>
                <td v-for="(target, idx) in allTargets" :key="target" class="p-2 text-center" :class="{ 'border-l border-l-border-subtle': idx === 0 || idx === sqliteTargets.length || idx === sqliteTargets.length + postgresTargets.length }">
                  <template v-if="hasData(target)">
                    <UIcon v-if="db0Capabilities[target]?.[cap.key]" name="carbon:checkmark" class="size-4 mx-auto text-fg-muted" />
                  </template>
                  <span v-else class="text-fg-subtle/40">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="text-center text-sm py-8 px-4 text-fg-subtle border-t border-border-subtle">
      <p class="mb-2">Generated <NuxtTime :datetime="compatData.__meta.generatedAt" date-style="medium" /></p>
      <div class="flex gap-4 justify-center">
        <NuxtLink to="https://unjs.io" external>UnJS</NuxtLink>
        <NuxtLink to="https://github.com/onmax/db-compat" external>GitHub</NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { Db0Capabilities, TargetId } from 'db-compat-data'
import { compatData, db0Capabilities, targets } from 'db-compat-data'

const hasData = (id: TargetId) => id in compatData.__meta.targets

const sqliteTargets = targets.filter(t => t.dialect === 'sqlite').map(t => t.id)
const postgresTargets = targets.filter(t => t.dialect === 'postgresql').map(t => t.id)
const mysqlTargets = targets.filter(t => t.dialect === 'mysql').map(t => t.id)
const allTargets = [...sqliteTargets, ...postgresTargets, ...mysqlTargets]

const db0CapabilityList: { key: keyof Db0Capabilities, description: string }[] = [
  { key: 'supportsJSON', description: 'JSON column type and operations' },
  { key: 'supportsBooleans', description: 'Native boolean type' },
  { key: 'supportsArrays', description: 'Array column type' },
  { key: 'supportsDates', description: 'Native DATE type' },
  { key: 'supportsUUIDs', description: 'UUID type support' },
  { key: 'supportsTransactions', description: 'Transaction support (BEGIN/COMMIT)' },
  { key: 'supportsBatch', description: 'Atomic batch execution' },
]
</script>
