<script setup lang="ts">
import { computed, ref, useId } from 'vue'

type InputContent = string | number | null | undefined

interface Props {
  modelValue?: InputContent
  name?: string | null
  type?: 'text' | 'number' | 'password' | 'email' | 'tel' | 'date' | 'phone'
  placeholder?: string
  disabled?: boolean
  required?: boolean
  label?: string
  error?: string
  hint?: string
  autocomplete?: string
  inputmode?: 'text' | 'numeric' | 'tel' | 'email' | 'url' | 'decimal' | 'search'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  name: null,
  placeholder: '',
  error: '',
  hint: '',
  autocomplete: 'off',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: InputContent): void
  (e: 'blur'): void
  (e: 'focus'): void
}>()

const inputId = useId()
const focused = ref(false)
const hasError = computed(() => !!props.error)

const inputType = computed(() =>
  props.type === 'phone' ? 'tel' : props.type,
)

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <label
    :for="inputId"
    :class="[
      'base-input',
      { 'base-input_focus': focused, 'base-input_error': hasError, 'base-input_disabled': disabled },
    ]"
  >
    <span v-if="label" class="base-input__label">
      {{ label }}<span v-if="required" class="base-input__asterisk">*</span>
    </span>

    <span class="base-input__field base-input__input-wrapper">
      <input
        :id="inputId"
        :type="inputType"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :name="name ?? undefined"
        :aria-invalid="hasError"
        class="base-input__input"
        @input="onInput"
        @focus="focused = true; emit('focus')"
        @blur="focused = false; emit('blur')"
      />
    </span>

    <span v-if="hasError || hint" class="base-input__hint">
      {{ error || hint }}
    </span>
  </label>
</template>

<style scoped lang="scss">
@use 'BaseInput';
</style>
