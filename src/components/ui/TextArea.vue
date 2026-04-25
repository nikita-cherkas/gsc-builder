<script setup lang="ts">
import BaseTextarea from '@/components/base/textarea/BaseTextarea.vue'

interface Props {
  label: string
  modelValue: string
  placeholder?: string
  rows?: number
  hint?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: '',
  rows: 4,
  hint: '',
})

defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()
</script>

<template>
  <BaseTextarea
    :label="label"
    :model-value="modelValue"
    :placeholder="placeholder"
    :rows="rows"
    :hint="hint"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
