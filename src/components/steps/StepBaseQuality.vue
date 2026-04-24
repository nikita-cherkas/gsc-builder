<script setup lang="ts">
import { useConfiguratorStore } from '@/stores/configurator'
import { BASE_QUALITY_OPTIONS } from '@/data/base-quality'
import type { BaseQuality } from '@/types'
import RadioCard from '@/components/ui/RadioCard.vue'
import { Shield, ShieldCheck } from 'lucide-vue-next'
import type { Component } from 'vue'

const store = useConfiguratorStore()

const ICONS: Record<BaseQuality, Component> = {
  standard: Shield,
  premium: ShieldCheck,
}
</script>

<template>
  <div class="space-y-3">
    <RadioCard
      v-for="opt in BASE_QUALITY_OPTIONS"
      :key="opt.id"
      :label="opt.label"
      :description="opt.description"
      :price="opt.price"
      :highlights="opt.highlights"
      :selected="store.config.baseQuality === opt.id"
      :with-info="!!opt.info"
      :icon="ICONS[opt.id]"
      @select="store.setBaseQuality(opt.id)"
    />
  </div>
</template>
