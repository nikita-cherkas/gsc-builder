<script setup lang="ts">
import { computed, useId } from 'vue'

interface Option {
  value: string
  label: string
}

interface Props {
  modelValue?: string
  label?: string
  options: Option[]
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
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
      'base-select',
      { 'base-select_error': hasError, 'base-select_disabled': disabled },
    ]"
  >
    <span v-if="label" class="base-select__label">
      {{ label }}<span v-if="required" class="base-select__asterisk">*</span>
    </span>

    <span class="base-select__field">
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :aria-invalid="hasError"
        class="base-select__native"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>

      <svg
        class="base-select__chevron"
        width="12"
        height="8"
        viewBox="0 0 12 8"
        aria-hidden="true"
      >
        <path
          d="M1 1.5L6 6.5L11 1.5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>

    <span v-if="hasError || hint" class="base-select__hint">
      {{ error || hint }}
    </span>
  </label>
</template>

<style scoped lang="scss">
@use '@/styles/colors' as colors;
@use '@/styles/media-breakpoints' as breakpoints;

.base-select {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  &__label {
    font-size: 13px;
    font-weight: 500;
    line-height: 1;
    color: colors.$black;

    @include breakpoints.media-breakpoint-down(xs) {
      font-size: 12px;
    }
  }

  &__asterisk {
    color: colors.$orange-medium;
    margin-left: 2px;
  }

  &__field {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 48px;
    border-radius: 10px;
    background-color: colors.$gray-5;
    border: 1px solid colors.$gray-border;
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease;

    &:hover:not(:has(:disabled)) {
      border-color: colors.$gray-light;
    }

    &:focus-within {
      border-color: colors.$orange-medium;
      background-color: colors.$white;
    }
  }

  &__native {
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background: transparent;
    border: none;
    outline: none;
    padding: 0 38px 0 14px;
    color: colors.$black;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    cursor: pointer;
    height: 100%;

    @include breakpoints.media-breakpoint-down(xs) {
      font-size: 16px;
    }

    &:disabled {
      cursor: not-allowed;
      color: colors.$gray-light;
    }
  }

  &__chevron {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px !important;
    height: 8px !important;
    color: colors.$gray;
    pointer-events: none;
    flex-shrink: 0;
  }

  &__hint {
    font-size: 11px;
    line-height: 1.3;
    color: colors.$gray;
  }

  &_error {
    .base-select__field {
      border-color: colors.$red;
      background-color: rgba(240, 0, 0, 0.04);
    }

    .base-select__label,
    .base-select__hint {
      color: colors.$red;
    }
  }

  &_disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}
</style>
