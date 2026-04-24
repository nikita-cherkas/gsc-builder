<script setup lang="ts" generic="T extends string">
import { cn } from '@/lib/utils'

interface Swatch {
  id: T
  label: string
  hex: string
  disabled?: boolean
}

interface Props {
  swatches: readonly Swatch[]
  selectedId: T
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', id: T): void
}>()
</script>

<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
    <button
      v-for="s in props.swatches"
      :key="s.id"
      type="button"
      :disabled="s.disabled"
      :aria-pressed="s.id === props.selectedId"
      :class="cn(
        'flex items-center gap-3 rounded-lg border bg-card p-3 transition',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        s.id === props.selectedId
          ? 'border-primary ring-1 ring-primary/20'
          : 'border-border hover:border-foreground/30',
      )"
      @click="emit('select', s.id)"
    >
      <span
        class="h-8 w-8 rounded-full border shadow-inner shrink-0"
        :style="{
          backgroundColor: s.hex,
          borderColor: 'rgba(0,0,0,0.12)',
        }"
      />
      <span class="text-[13px] font-medium text-foreground leading-tight text-left">
        {{ s.label }}
      </span>
    </button>
  </div>
</template>
