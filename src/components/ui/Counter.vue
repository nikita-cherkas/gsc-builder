<script setup lang="ts">
interface Props {
  value: number
  min?: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 99,
})

const emit = defineEmits<{
  (e: 'update:value', n: number): void
}>()

function dec() {
  emit('update:value', Math.max(props.min, props.value - 1))
}

function inc() {
  emit('update:value', Math.min(props.max, props.value + 1))
}
</script>

<template>
  <div class="counter">
    <button
      type="button"
      :disabled="props.value <= props.min"
      aria-label="Decrease"
      class="counter__btn"
      @click="dec"
    >
      −
    </button>
    <span class="counter__value">{{ props.value }}</span>
    <button
      type="button"
      :disabled="props.value >= props.max"
      aria-label="Increase"
      class="counter__btn"
      @click="inc"
    >
      +
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colors' as colors;

.counter {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border: 1px solid colors.$gray-300;
  background: colors.$white;
  border-radius: 10px;

  &__btn {
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: colors.$black;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s ease;

    @media (hover: hover) {
      &:not(:disabled):hover {
        background: colors.$gray-10;
      }
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  &__value {
    width: 24px;
    color: colors.$black;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }
}
</style>
