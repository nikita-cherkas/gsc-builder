<script setup lang="ts">
import { useConfiguratorStore } from '@/stores/configurator'
import { BASE_COLOR_OPTIONS } from '@/data/base-color'
import SwatchPicker from '@/components/ui/SwatchPicker.vue'

const store = useConfiguratorStore()
</script>

<template>
  <SwatchPicker
    :swatches="BASE_COLOR_OPTIONS"
    :selected-id="store.config.baseColor"
    @select="store.setBaseColor"
  />
</template>
