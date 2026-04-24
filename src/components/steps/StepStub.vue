<script setup lang="ts">
import { useConfiguratorStore } from '@/stores/configurator'

const store = useConfiguratorStore()
</script>

<template>
  <div class="text-center py-10">
    <div class="label-mono text-muted-foreground mb-2">{{ store.currentStep.shortLabel }}</div>
    <h3 class="font-display text-[16px] font-semibold text-foreground mb-1">
      {{ store.currentStep.label }}
    </h3>
    <p class="text-[12.5px] text-muted-foreground">Coming soon — step body in progress.</p>
  </div>
</template>
