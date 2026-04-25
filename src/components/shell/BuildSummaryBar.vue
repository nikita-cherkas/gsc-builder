<script setup lang="ts">
import { computed } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'
import { Info } from 'lucide-vue-next'
import type { BaseQuality, CartType } from '@/types'

const store = useConfiguratorStore()

const cartTypes: { id: CartType; label: string }[] = [
  { id: 'knockdown', label: 'Knockdown' },
  { id: 'solid', label: 'One-piece' },
]

const baseQualities: { id: BaseQuality; label: string }[] = [
  { id: 'standard', label: 'Standard' },
  { id: 'premium', label: 'Premium' },
]

const cartIndex = computed(() =>
  Math.max(0, cartTypes.findIndex((t) => t.id === store.config.cartType)),
)
const qualityIndex = computed(() =>
  Math.max(0, baseQualities.findIndex((q) => q.id === store.config.baseQuality)),
)
</script>

<template>
  <div class="build-summary">
    <div class="build-summary__bar">
      <span class="build-summary__title">Your build</span>

      <span class="build-summary__divider" aria-hidden="true" />

      <div class="build-summary__group">
        <span class="build-summary__group-label">Construction</span>
        <div role="radiogroup" aria-label="Construction" class="build-summary__pills">
          <span
            class="build-summary__pills-active"
            :style="{ width: 'calc(50% - 2px)', transform: `translateX(${cartIndex * 100}%)` }"
            aria-hidden="true"
          />
          <button
            v-for="t in cartTypes"
            :key="t.id"
            type="button"
            role="radio"
            :aria-checked="store.config.cartType === t.id"
            :class="['build-summary__pill', { 'build-summary__pill_active': store.config.cartType === t.id }]"
            @click="store.setCartType(t.id)"
          >
            {{ t.label }}
          </button>
        </div>
        <button
          type="button"
          aria-label="About cart construction"
          class="build-summary__info"
        >
          <Info />
        </button>
      </div>

      <span class="build-summary__divider" aria-hidden="true" />

      <div class="build-summary__group">
        <span class="build-summary__group-label">Material</span>
        <div role="radiogroup" aria-label="Material" class="build-summary__pills build-summary__pills_orange">
          <span
            class="build-summary__pills-active"
            :style="{ width: 'calc(50% - 2px)', transform: `translateX(${qualityIndex * 100}%)` }"
            aria-hidden="true"
          />
          <button
            v-for="q in baseQualities"
            :key="q.id"
            type="button"
            role="radio"
            :aria-checked="store.config.baseQuality === q.id"
            :class="['build-summary__pill', { 'build-summary__pill_active': store.config.baseQuality === q.id }]"
            @click="store.setBaseQuality(q.id)"
          >
            {{ q.label }}
          </button>
        </div>
        <button
          type="button"
          aria-label="About base material"
          class="build-summary__info"
        >
          <Info />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colors' as colors;

.build-summary {
  pointer-events: auto;

  &__bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid colors.$gray-300;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(23, 27, 28, 0.08), colors.$main-shadow;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  &__title {
    flex-shrink: 0;
    padding-left: 8px;
    color: colors.$gray;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  &__divider {
    flex-shrink: 0;
    width: 1px;
    height: 24px;
    background: colors.$gray-300;
  }

  &__group {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  &__group-label {
    flex-shrink: 0;
    color: colors.$gray;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  &__pills {
    position: relative;
    display: inline-flex;
    width: 160px;
    flex-shrink: 0;
    padding: 2px;
    border-radius: 999px;
    border: 1px solid colors.$gray-300;
    background: colors.$white;

    &-active {
      position: absolute;
      inset-block: 2px;
      left: 2px;
      border-radius: 999px;
      background: colors.$black;
      box-shadow: colors.$main-shadow;
      transition: transform 0.3s ease;
    }

    &_orange .build-summary__pills-active {
      background: colors.$orange-medium;
    }
  }

  &__pill {
    position: relative;
    z-index: 1;
    flex: 1;
    min-width: 0;
    height: 28px;
    border: none;
    background: transparent;
    border-radius: 999px;
    color: colors.$gray;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.3s ease;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (hover: hover) {
      &:not(.build-summary__pill_active):hover {
        color: colors.$black;
      }
    }

    &_active {
      color: colors.$white;
    }
  }

  &__info {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: transparent;
    border: none;
    color: colors.$gray;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;

    svg {
      width: 14px;
      height: 14px;
    }

    @media (hover: hover) {
      &:hover {
        background: colors.$gray-10;
        color: colors.$black;
      }
    }
  }
}
</style>
