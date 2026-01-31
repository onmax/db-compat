<script setup lang="ts">
import type { TargetId } from 'db-compat-data'
import { compatData, targets } from 'db-compat-data'

const props = defineProps<{ target: TargetId }>()

const isOpen = shallowRef(false)
const triggerRef = shallowRef<HTMLElement | null>(null)
const popoverStyle = computed(() => {
  if (!triggerRef.value || !isOpen.value) return {}
  const rect = triggerRef.value.getBoundingClientRect()
  return { top: `${rect.bottom + 8}px`, left: `${rect.left + rect.width / 2}px`, transform: 'translateX(-50%)' }
})

const targetsMap = Object.fromEntries(targets.map(t => [t.id, t]))
const meta = computed(() => compatData.__meta.targets[props.target])
const targetDef = computed(() => targetsMap[props.target])

const icons: Record<string, string> = {
  'db0-better-sqlite3': 'simple-icons:sqlite',
  'db0-libsql': 'simple-icons:turso',
  'db0-bun-sqlite': 'simple-icons:bun',
  'db0-node-sqlite': 'simple-icons:nodedotjs',
  'db0-sqlite3': 'simple-icons:sqlite',
  'db0-cloudflare-d1': 'simple-icons:cloudflare',
  'db0-pglite': 'simple-icons:postgresql',
  'db0-postgresql': 'simple-icons:postgresql',
  'db0-hyperdrive-postgresql': 'simple-icons:cloudflare',
  'db0-mysql2': 'simple-icons:mysql',
  'db0-planetscale': 'simple-icons:planetscale',
  'db0-hyperdrive-mysql': 'simple-icons:cloudflare',
}

const icon = computed(() => icons[props.target] ?? 'carbon:unknown')
const connectorUrl = computed(() => `https://github.com/unjs/db0/tree/main/src/connectors/${targetDef.value?.connector ?? props.target.replace('db0-', '')}`)
const docsUrl = computed(() => `https://db0.unjs.io/connectors/${targetDef.value?.connector ?? props.target.replace('db0-', '')}`)

function toggle() { isOpen.value = !isOpen.value }
function close() { isOpen.value = false }

onClickOutside(triggerRef, close)
</script>

<template>
  <div class="relative inline-flex">
    <button ref="triggerRef" class="p-1 rounded hover:bg-bg transition-colors" :aria-expanded="isOpen" @click="toggle">
      <UIcon :name="icon" class="size-5 text-fg-muted hover:text-fg transition-colors" />
    </button>
    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-150" leave-active-class="transition-opacity duration-100" enter-from-class="opacity-0" leave-to-class="opacity-0">
        <div v-if="isOpen" class="fixed z-[100] min-w-48 p-3 rounded-lg bg-bg-elevated border border-border shadow-lg" :style="popoverStyle">
          <div class="font-mono font-medium text-sm text-fg mb-2">{{ targetDef?.name ?? props.target }}</div>
          <div class="flex gap-1.5 mb-3">
            <span class="px-1.5 py-0.5 text-xs font-mono rounded bg-bg-subtle text-fg-muted">{{ meta?.version }}</span>
            <span class="px-1.5 py-0.5 text-xs font-mono rounded bg-bg-subtle text-fg-muted">{{ meta?.dialect }}</span>
          </div>
          <div class="text-xs text-fg-subtle mb-3">Generated {{ new Date(meta?.generatedAt).toLocaleDateString() }}</div>
          <div class="flex flex-col gap-1.5">
            <NuxtLink :to="connectorUrl" external class="text-xs text-fg-muted hover:text-fg transition-colors flex items-center gap-1">
              <UIcon name="carbon:logo-github" class="size-3.5" /> GitHub
            </NuxtLink>
            <NuxtLink :to="docsUrl" external class="text-xs text-fg-muted hover:text-fg transition-colors flex items-center gap-1">
              <UIcon name="carbon:document" class="size-3.5" /> db0 Docs
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
