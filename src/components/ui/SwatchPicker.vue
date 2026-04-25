<script setup lang="ts" generic="T extends string">
interface Swatch {
  id: T
  label: string
  hex: string
  disabled?: boolean
}

interface Props {
  swatches: readonly Swatch[]
  selectedId: T
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', id: T): void
}>()
</script>

<template>
  <div class="swatch-picker">
    <button
      v-for="s in props.swatches"
      :key="s.id"
      type="button"
      :disabled="s.disabled"
      :aria-pressed="s.id === props.selectedId"
      :class="['swatch-picker__item', { 'swatch-picker__item_active': s.id === props.selectedId }]"
      @click="emit('select', s.id)"
    >
      <span
        class="swatch-picker__chip"
        :style="{ backgroundColor: s.hex }"
      />
      <span class="swatch-picker__label">
        {{ s.label }}
      </span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colors' as colors;
@use '@/styles/media-breakpoints' as breakpoints;

.swatch-picker {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @include breakpoints.media-breakpoint-up(xs) {
    grid-template-columns: repeat(3, 1fr);
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 12px;
    background: colors.$white;
    border: 1px solid colors.$gray-300;
    cursor: pointer;
    text-align: left;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    @media (hover: hover) {
      &:not(.swatch-picker__item_active):not(:disabled):hover {
        border-color: colors.$gray-light;
      }
    }

    &_active {
      border-color: colors.$orange-medium;
      box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.08);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  &__chip {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.12);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
  }

  &__label {
    color: colors.$black;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.3;
  }
}
</style>
