<script setup lang="ts">
import { computed } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'
import type { StepId } from '@/types'

import StepCartType from '@/components/steps/StepCartType.vue'
import StepBaseQuality from '@/components/steps/StepBaseQuality.vue'
import StepBaseColor from '@/components/steps/StepBaseColor.vue'
import StepCutout from '@/components/steps/StepCutout.vue'
import StepTopMaterial from '@/components/steps/StepTopMaterial.vue'
import StepTopColor from '@/components/steps/StepTopColor.vue'
import StepAddons from '@/components/steps/StepAddons.vue'
import StepEquipment from '@/components/steps/StepEquipment.vue'
import StepSummary from '@/components/steps/StepSummary.vue'
import StepCustomer from '@/components/steps/StepCustomer.vue'

const store = useConfiguratorStore()

const STEP_MAP: Record<StepId, unknown> = {
  'cart-type': StepCartType,
  'base-quality': StepBaseQuality,
  'base-color': StepBaseColor,
  cutout: StepCutout,
  'top-material': StepTopMaterial,
  'top-color': StepTopColor,
  addons: StepAddons,
  equipment: StepEquipment,
  summary: StepSummary,
  customer: StepCustomer,
}

const activeComponent = computed(() => STEP_MAP[store.effectiveStepId])
</script>

<template>
  <Transition name="fade" mode="out-in">
    <component :is="activeComponent" :key="store.effectiveStepId" />
  </Transition>
</template>

<style scoped>
.fade-enter-active {
  transition: opacity 240ms ease, transform 240ms ease;
}
.fade-leave-active {
  transition: opacity 120ms ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.fade-leave-to {
  opacity: 0;
}
</style>
