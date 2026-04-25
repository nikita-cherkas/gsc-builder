<script lang="ts" setup>
interface Props {
  icon: string
  clickable?: boolean
  disabled?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <svg
    :class="{
      'base-icon_clickable': props.clickable,
      'base-icon_disabled': props.disabled,
    }"
    class="base-icon"
  >
    <use :href="`#${props.icon}`" />
  </svg>
</template>

<style lang="scss">
@use 'BaseIcon';
</style>
