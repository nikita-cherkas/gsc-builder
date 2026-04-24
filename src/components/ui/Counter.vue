<script setup lang="ts">
interface Props {
  value: number
  min?: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 99,
})

const emit = defineEmits<{
  (e: 'update:value', n: number): void
}>()

function dec() {
  emit('update:value', Math.max(props.min, props.value - 1))
}

function inc() {
  emit('update:value', Math.min(props.max, props.value + 1))
}
</script>

<template>
  <div class="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1">
    <button
      type="button"
      :disabled="props.value <= props.min"
      aria-label="Decrease"
      class="flex h-7 w-7 items-center justify-center rounded-md text-foreground text-lg leading-none transition hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
      @click="dec"
    >
      −
    </button>
    <span class="font-mono text-sm font-semibold text-foreground w-6 text-center tabular-nums">
      {{ props.value }}
    </span>
    <button
      type="button"
      :disabled="props.value >= props.max"
      aria-label="Increase"
      class="flex h-7 w-7 items-center justify-center rounded-md text-foreground text-lg leading-none transition hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
      @click="inc"
    >
      +
    </button>
  </div>
</template>
