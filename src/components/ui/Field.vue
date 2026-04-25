<script setup lang="ts">
import BaseInput from '@/components/base/input/BaseInput.vue'

interface Props {
  label: string
  modelValue: string
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'password'
  error?: string
  hint?: string
  placeholder?: string
  autocomplete?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  error: '',
  hint: '',
  placeholder: '',
  autocomplete: 'off',
})

defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()
</script>

<template>
  <BaseInput
    :label="label"
    :model-value="modelValue"
    :type="type"
    :error="error"
    :hint="hint"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    @update:model-value="$emit('update:modelValue', String($event ?? ''))"
  />
</template>
