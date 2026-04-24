<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  label: string
  modelValue: string
  hint?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  hint: '',
  placeholder: '',
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
    <textarea
      :id="inputId"
      :value="modelValue"
      :placeholder="placeholder"
      :class="cn(
        'w-full rounded-lg border px-3 py-2.5 text-[16px] lg:text-[14px] bg-card transition outline-none',
        'border-border focus:border-primary min-h-[80px] resize-y',
      )"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <span v-if="hint" class="block text-[11px] mt-1 text-muted-foreground">{{ hint }}</span>
  </label>
</template>
