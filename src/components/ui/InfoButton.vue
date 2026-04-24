<script setup lang="ts">
import { Info } from 'lucide-vue-next'

interface Props {
  ariaLabel?: string
}

withDefaults(defineProps<Props>(), {
  ariaLabel: 'More info',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function handleClick(event: MouseEvent) {
  event.stopPropagation()
  event.preventDefault()
  emit('click', event)
}
</script>

<template>
  <button
    type="button"
    class="shrink-0 h-7 w-7 rounded-md border border-border bg-white/70 text-muted-foreground hover:text-foreground hover:border-edge-strong transition flex items-center justify-center"
    :aria-label="ariaLabel"
    title="More info"
    @click="handleClick"
  >
    <Info class="h-3.5 w-3.5" />
  </button>
</template>
