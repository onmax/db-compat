<template>
  <div class="min-h-screen bg-bg text-fg">
    <!-- Hero -->
    <header class="relative text-center py-16 px-4">
      <div class="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 class="text-4xl sm:text-5xl font-mono font-medium mb-3 text-fg">db-compat</h1>
      <p class="text-base max-w-lg mx-auto text-fg-muted leading-relaxed">
        Compare SQL capabilities across SQLite, PostgreSQL, and MySQL drivers.
        Test what features work with each driver—transactions, JSON, CTEs, full-text search, and more.
      </p>
      <div class="w-max mx-auto mt-4 rounded-md border border-yellow-600/20 bg-yellow-500/5 px-3 py-2 flex items-center gap-2">
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
      <div class="border border-border rounded-lg overflow-hidden">
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
      <!-- Scrollable body -->
      <div>
        <table class="w-full text-sm border-collapse table-fixed">
          <colgroup>
            <col class="w-48">
            <col v-for="_ in allTargets" :key="_" class="w-14">
          </colgroup>
          <tbody>
            <template v-for="(caps, category, idx) in compatData.sql" :key="category">
              <tr :class="idx > 0 && 'border-t border-border'">
                <td class="pt-4 pb-2 px-3">
                  <span class="text-xs font-mono uppercase tracking-wide text-fg-subtle">{{ category }}</span>
                </td>
                <td v-for="(_, idx) in allTargets" :key="idx" class="pt-4 pb-2" :class="{ 'border-l border-l-border-subtle': idx === 0 || idx === sqliteTargets.length || idx === sqliteTargets.length + postgresTargets.length }" />
              </tr>
              <tr v-for="(cap, capId) in caps" :key="capId" class="group transition-colors hover:bg-bg-subtle border-t border-border-subtle">
                <td class="p-2">
                  <span class="font-mono text-sm text-fg">{{ capId }}</span>
                  <p class="text-xs mt-0.5 text-fg-subtle">{{ cap.description }}</p>
                </td>
                <td v-for="(target, idx) in allTargets" :key="target" class="p-2 text-center" :class="{ 'border-l border-l-border-subtle': idx === 0 || idx === sqliteTargets.length || idx === sqliteTargets.length + postgresTargets.length }">
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
      </div>
    </main>

    <!-- Footer -->
    <footer class="text-center text-sm py-8 px-4 text-fg-subtle border-t border-border-subtle">
      <p class="mb-2">Generated <NuxtTime :datetime="compatData.__meta.generatedAt" date-style="medium" /></p>
      <div class="flex gap-4 justify-center">
        <NuxtLink to="https://unjs.io" external>UnJS</NuxtLink>
        <NuxtLink to="https://github.com/unjs/db-compat" external>GitHub</NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { TargetId } from 'db-compat-data'
import { compatData, targets } from 'db-compat-data'

const hasData = (id: TargetId) => id in compatData.__meta.targets

const sqliteTargets = targets.filter(t => t.dialect === 'sqlite').map(t => t.id)
const postgresTargets = targets.filter(t => t.dialect === 'postgresql').map(t => t.id)
const mysqlTargets = targets.filter(t => t.dialect === 'mysql').map(t => t.id)
const allTargets = [...sqliteTargets, ...postgresTargets, ...mysqlTargets]
</script>
