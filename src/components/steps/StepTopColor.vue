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
  <div class="space-y-3">
    <p class="text-[12px] text-muted-foreground">
      Available finishes depend on the material picked in the previous step.
    </p>
    <SwatchPicker
      :swatches="swatches"
      :selected-id="store.config.topColor"
      @select="store.setTopColor"
    />
  </div>
</template>
