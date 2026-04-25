<script setup lang="ts">
interface Props {
  errorMessage?: any
  type?: 'checkbox' | 'radio' | 'input'
  showErrorMessage?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  errorMessage: '',
  type: 'input',
  showErrorMessage: true,
})
</script>

<template>
  <div
    :class="{ 'base-field_checkbox': props.type === 'checkbox' }"
    class="base-field"
  >
    <div class="base-field__content">
      <slot name="default" />
    </div>

    <span
      class="base-field__error"
      v-if="props.errorMessage && props.showErrorMessage"
    >
      {{ props.errorMessage }}
    </span>
  </div>
</template>

<style scoped lang="scss">
@use 'BaseField';
</style>
