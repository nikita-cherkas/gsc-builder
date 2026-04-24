<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  label: string
  modelValue: string
  type?: string
  error?: string
  hint?: string
  placeholder?: string
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  error: '',
  hint: '',
  placeholder: '',
  autocomplete: 'off',
})

defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

const inputId = `f-${props.label.replace(/\W/g, '-').toLowerCase()}`
</script>

<template>
  <label :for="inputId" class="block">
    <span class="block mb-1.5 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
      {{ label }}
    </span>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :aria-invalid="!!error"
      :class="cn(
        'w-full rounded-lg border px-3 py-2.5 text-[16px] lg:text-[14px] bg-card transition outline-none',
        'border-border focus:border-primary',
        error && 'border-destructive bg-destructive/5',
      )"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span
      v-if="error || hint"
      :class="cn('block text-[11px] mt-1', error ? 'text-destructive' : 'text-muted-foreground')"
    >
      {{ error || hint }}
    </span>
  </label>
</template>
