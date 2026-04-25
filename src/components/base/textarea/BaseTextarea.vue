<script setup lang="ts">
import { computed, useId } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  rows?: number
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  rows: 4,
  error: '',
  hint: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

const id = useId()
const hasError = computed(() => !!props.error)
</script>

<template>
  <label
    :for="id"
    :class="[
      'base-textarea',
      { 'base-textarea_error': hasError, 'base-textarea_disabled': disabled },
    ]"
  >
    <span v-if="label" class="base-textarea__label">
      {{ label }}<span v-if="required" class="base-textarea__asterisk">*</span>
    </span>

    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :aria-invalid="hasError"
      class="base-textarea__input"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />

    <span v-if="hasError || hint" class="base-textarea__hint">
      {{ error || hint }}
    </span>
  </label>
</template>

<style scoped lang="scss">
@use 'BaseTextarea';
</style>
