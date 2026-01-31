<script setup lang="ts">
const props = defineProps<{ text: string; position?: 'top' | 'bottom' }>()
const isVisible = shallowRef(false)
const tooltipId = useId()
const triggerRef = shallowRef<HTMLElement | null>(null)
const tooltipStyle = computed(() => {
  if (!triggerRef.value || !isVisible.value) return {}
  const rect = triggerRef.value.getBoundingClientRect()
  const top = props.position === 'top' ? rect.top - 4 : rect.bottom + 4
  return { top: `${top}px`, left: `${rect.left + rect.width / 2}px`, transform: 'translateX(-50%)' }
})
</script>

<template>
  <div ref="triggerRef" class="relative inline-flex" :aria-describedby="isVisible ? tooltipId : undefined" @mouseenter="isVisible = true" @mouseleave="isVisible = false">
    <slot />
    <Transition enter-active-class="transition-opacity duration-150" leave-active-class="transition-opacity duration-100" enter-from-class="opacity-0" leave-to-class="opacity-0">
      <div v-if="isVisible" :id="tooltipId" role="tooltip" class="fixed px-2 py-1 font-mono text-xs rounded whitespace-nowrap z-[100] pointer-events-none bg-bg-elevated text-fg border border-border" :style="tooltipStyle">
        {{ text }}
      </div>
    </Transition>
  </div>
</template>
