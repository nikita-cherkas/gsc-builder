<script setup lang="ts">
import { computed } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'
import { TOP_COLOR_OPTIONS } from '@/data/top-color'
import SwatchPicker from '@/components/ui/SwatchPicker.vue'

const store = useConfiguratorStore()

const swatches = computed(() =>
  TOP_COLOR_OPTIONS.map((c) => ({
    ...c,
    disabled: !c.materials.includes(store.config.topMaterial),
  })),
)
</script>

<template>
  <div class="step-top-color">
    <p class="step-top-color__hint">
      Available finishes depend on the material picked in the previous step.
    </p>
    <SwatchPicker
      :swatches="swatches"
      :selected-id="store.config.topColor"
      @select="store.setTopColor"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colors' as colors;

.step-top-color {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__hint {
    color: colors.$gray;
    font-size: 12px;
    line-height: 1.5;
  }
}
</style>
