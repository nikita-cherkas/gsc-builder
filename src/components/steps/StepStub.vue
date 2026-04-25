<script setup lang="ts">
import { useConfiguratorStore } from '@/stores/configurator'

const store = useConfiguratorStore()
</script>

<template>
  <div class="step-stub">
    <div class="step-stub__chip">{{ store.currentStep.shortLabel }}</div>
    <h3 class="step-stub__title">{{ store.currentStep.label }}</h3>
    <p class="step-stub__hint">Coming soon — step body in progress.</p>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colors' as colors;
@use '@/styles/base' as base;

.step-stub {
  text-align: center;
  padding: 40px 12px;

  &__chip {
    color: colors.$gray;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 8px;
  }

  &__title {
    color: colors.$black;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
    @include base.font-secondary;
  }

  &__hint {
    color: colors.$gray-900;
    font-size: 13px;
  }
}
</style>
