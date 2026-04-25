<script setup lang="ts">
import type { Component } from "vue";
import { formatPrice } from "@/lib/formatters";
import { Info } from "lucide-vue-next";

interface Props {
  label: string;
  description?: string;
  price?: number;
  highlights?: string[];
  selected: boolean;
  withInfo?: boolean;
  icon?: Component;
}

const props = withDefaults(defineProps<Props>(), {
  description: "",
  withInfo: false,
  icon: undefined,
});

const emit = defineEmits<{
  (e: "select"): void;
  (e: "info"): void;
}>();
</script>

<template>
  <div :class="['radio-card', { 'radio-card_selected': selected }]">
    <div aria-hidden="true" class="radio-card__icon-slot">
      <slot name="icon">
        <component :is="props.icon" v-if="props.icon" class="radio-card__icon" />
      </slot>
    </div>

    <button
      type="button"
      :aria-pressed="selected"
      class="radio-card__main"
      @click="emit('select')"
    >
      <span :class="['radio-card__radio', { 'radio-card__radio_on': selected }]">
        <span v-if="selected" class="radio-card__radio-dot" />
      </span>

      <div class="radio-card__body">
        <div class="radio-card__heading">
          <span class="radio-card__label">{{ label }}</span>
          <span v-if="price !== undefined" class="radio-card__price">
            {{ price === 0 ? "Included" : `+${formatPrice(price)}` }}
          </span>
        </div>

        <p v-if="description" class="radio-card__description">
          {{ description }}
        </p>

        <div v-if="highlights && highlights.length > 0" class="radio-card__chips">
          <span v-for="h in highlights" :key="h" class="radio-card__chip">
            {{ h }}
          </span>
        </div>

        <slot name="footer" />
      </div>
    </button>

    <button
      v-if="withInfo"
      type="button"
      :aria-label="`More about ${label}`"
      class="radio-card__info"
      @click="emit('info')"
    >
      <Info />
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/colors" as colors;

.radio-card {
  display: flex;
  align-items: stretch;
  border: 1px solid colors.$gray-300;
  background: colors.$white;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &_selected {
    border-color: colors.$orange-medium;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.08);
  }

  @media (hover: hover) {
    &:not(.radio-card_selected):hover {
      border-color: colors.$gray-light;
    }
  }

  &__icon-slot {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    padding: 8px;
    background: colors.$gray-5;
    border-right: 1px solid colors.$gray-300;
    color: colors.$gray;
    transition: color 0.2s ease, background 0.2s ease;
  }

  &_selected &__icon-slot {
    color: colors.$orange-medium;
    background: rgba(255, 107, 0, 0.06);
  }

  &__icon {
    width: 22px;
    height: 22px;
  }

  &__main {
    flex: 1;
    min-width: 0;
    padding: 14px;
    border: none;
    background: transparent;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  &__radio {
    flex-shrink: 0;
    margin-top: 2px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid colors.$gray-light;
    background: colors.$white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s ease, background 0.2s ease;

    &_on {
      border-color: colors.$orange-medium;
      background: colors.$orange-medium;
    }
  }

  &__radio-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: colors.$white;
  }

  &__body {
    min-width: 0;
    flex: 1;
  }

  &__heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }

  &__label {
    color: colors.$black;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.3;
  }

  .radio-card_selected &__label {
    color: colors.$orange-medium;
  }

  &__price {
    flex-shrink: 0;
    color: colors.$gray;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
  }

  &__description {
    margin-top: 4px;
    color: colors.$gray-900;
    font-size: 13px;
    line-height: 1.4;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 8px;
  }

  &__chip {
    padding: 2px 8px;
    border-radius: 999px;
    background: colors.$gray-10;
    border: 1px solid colors.$gray-300;
    color: colors.$gray;
    font-size: 11px;
    line-height: 1.3;
  }

  &__info {
    flex-shrink: 0;
    width: 40px;
    border: none;
    border-left: 1px solid colors.$gray-300;
    background: colors.$white;
    color: colors.$gray;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease, color 0.2s ease;

    svg {
      width: 16px;
      height: 16px;
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
