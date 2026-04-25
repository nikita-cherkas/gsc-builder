<script lang="ts" setup>
import { Check } from 'lucide-vue-next'

interface Props {
  modelValue?: boolean
  disabled?: boolean
  label?: string
  inputType?: 'checkbox' | 'radio'
}

const props = withDefaults(defineProps<Props>(), {
  inputType: 'checkbox',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function toggle() {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <label
    :class="[
      'base-radio',
      { 'base-radio_checked': modelValue, 'base-radio_disabled': disabled },
    ]"
  >
    <input
      :checked="modelValue"
      :disabled="disabled"
      :type="inputType"
      class="base-radio__input"
      @change="toggle"
    />

    <span class="base-radio__box">
      <Check v-if="modelValue" class="base-radio__box-icon" />
    </span>

    <span v-if="label" class="base-radio__label">{{ label }}</span>
  </label>
</template>

<style lang="scss" scoped>
@use 'BaseCheckRadio';
</style>
