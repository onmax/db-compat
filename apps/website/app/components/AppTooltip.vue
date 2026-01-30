<script setup lang="ts">
defineProps<{ text: string; position?: 'top' | 'bottom' }>()
const isVisible = shallowRef(false)
const tooltipId = useId()
</script>

<template>
  <div class="relative inline-flex" :aria-describedby="isVisible ? tooltipId : undefined" @mouseenter="isVisible = true" @mouseleave="isVisible = false">
    <slot />
    <Transition enter-active-class="transition-opacity duration-150" leave-active-class="transition-opacity duration-100" enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div
        v-if="isVisible"
        :id="tooltipId"
        role="tooltip"
        class="absolute px-2 py-1 font-mono text-xs rounded whitespace-nowrap z-[100] pointer-events-none bg-bg-elevated text-fg border border-border"
        :class="position === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-1' : 'top-full left-1/2 -translate-x-1/2 mt-1'"
      >
        {{ text }}
      </div>
    </Transition>
  </div>
</template>
