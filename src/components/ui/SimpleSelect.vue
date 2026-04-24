<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface Props {
  label: string
  modelValue: string
  options: Option[]
  hint?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  hint: '',
  error: '',
})

defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

const inputId = `f-${props.label.replace(/\W/g, '-').toLowerCase()}`

const CHEVRON = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%238a7e6f' stroke-width='2'><path d='M4 6l4 4 4-4'/></svg>\")"
</script>

<template>
  <label :for="inputId" class="block">
    <span class="block mb-1.5 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
      {{ label }}
    </span>
    <select
      :id="inputId"
      :value="modelValue"
      :aria-invalid="!!error"
      :class="cn(
        'w-full rounded-lg border px-3 py-2.5 text-[16px] lg:text-[14px] bg-card transition outline-none appearance-none',
        'border-border focus:border-primary',
        'bg-no-repeat bg-[length:14px] bg-[right_10px_center]',
        error && 'border-destructive bg-destructive/5',
      )"
      :style="{ backgroundImage: CHEVRON }"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
    <span
      v-if="error || hint"
      :class="cn('block text-[11px] mt-1', error ? 'text-destructive' : 'text-muted-foreground')"
    >
      {{ error || hint }}
    </span>
  </label>
</template>
