<script lang="ts" setup>
interface Props {
  disabled?: boolean
  tag?: 'button' | 'a'
  href?: string | null
  type?: 'button' | 'submit'
  variant?: 'primary' | 'orange' | 'gray' | 'outlined' | 'text' | 'square'
  size?: 'lg' | 'sm' | 'default'
  form?: 'default' | 'square'
  active?: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'button',
  href: null,
  type: 'button',
  variant: 'primary',
  size: 'default',
  form: 'default',
})

const emit = defineEmits<{
  (e: 'click', event: PointerEvent): void
}>()

function onClick(event: PointerEvent) {
  emit('click', event)
}
</script>

<template>
  <Component
    :is="props.tag"
    :href="props.href ?? undefined"
    :type="props.tag === 'button' ? props.type : undefined"
    :disabled="props.tag === 'button' ? props.disabled : undefined"
    :class="[
      'base-button',
      `base-button_size-${props.size}`,
      `base-button_variant-${props.variant}`,
      `base-button_form-${props.form}`,
      { 'base-button_active': props.active },
      { 'base-button_disabled': props.disabled },
    ]"
    :title="props.title"
    @click="onClick"
  >
    <span v-if="$slots.left" class="base-button__icon">
      <slot name="left" />
    </span>

    <slot />

    <span v-if="$slots.right" class="base-button__icon">
      <slot name="right" />
    </span>
  </Component>
</template>

<style lang="scss" scoped>
@use 'BaseButton';
</style>
