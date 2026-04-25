<script setup lang="ts">
import { formatPrice } from '@/lib/formatters'
import InfoButton from './InfoButton.vue'

interface Props {
  active: boolean
  title: string
  description?: string
  price?: number
  withInfo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  withInfo: false,
})

const emit = defineEmits<{
  (e: 'toggle'): void
  (e: 'info'): void
}>()
</script>

<template>
  <div :class="['simple-toggle', { 'simple-toggle_active': active }]">
    <button
      type="button"
      :aria-pressed="active"
      class="simple-toggle__main"
      @click="emit('toggle')"
    >
      <div class="simple-toggle__head">
        <span class="simple-toggle__title">{{ title }}</span>
        <span class="simple-toggle__right">
          <span v-if="props.price !== undefined" class="simple-toggle__price">
            +{{ formatPrice(props.price) }}
          </span>
          <span class="simple-toggle__switch">
            <span class="simple-toggle__switch-thumb" />
          </span>
        </span>
      </div>
      <p v-if="description" class="simple-toggle__description">
        {{ description }}
      </p>
    </button>
    <InfoButton
      v-if="withInfo"
      :aria-label="`More about ${title}`"
      @click="emit('info')"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colors' as colors;

.simple-toggle {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border: 1px solid colors.$gray-300;
  background: colors.$white;
  border-radius: 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &_active {
    border-color: colors.$orange-medium;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.08);
  }

  @media (hover: hover) {
    &:not(.simple-toggle_active):hover {
      border-color: colors.$gray-light;
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
    text-align: left;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 4px;
  }

  &__title {
    color: colors.$black;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.3;
  }

  &__right {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  &__price {
    color: colors.$gray;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &_active &__price {
    color: colors.$orange-medium;
  }

  &__switch {
    position: relative;
    width: 36px;
    height: 20px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.15);
    transition: background 0.2s ease;
  }

  &_active &__switch {
    background: colors.$orange-medium;
  }

  &__switch-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: colors.$white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;
  }

  &_active &__switch-thumb {
    transform: translateX(16px);
  }

  &__description {
    color: colors.$gray-900;
    font-size: 12.5px;
    line-height: 1.4;
  }
}
</style>
