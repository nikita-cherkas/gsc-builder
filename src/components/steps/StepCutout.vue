<script setup lang="ts">
import { ref } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'
import { CUTOUT_OPTIONS } from '@/data/cutout'
import type { CutoutOption } from '@/types'
import RadioCard from '@/components/ui/RadioCard.vue'
import CutoutPreview from '@/components/ui/CutoutPreview.vue'
import InfoSheet from '@/components/ui/InfoSheet.vue'

const store = useConfiguratorStore()

const infoFor = ref<CutoutOption | null>(null)
</script>

<template>
  <InfoSheet
    v-if="infoFor && CUTOUT_OPTIONS.find((o) => o.id === infoFor)?.info"
    :title="CUTOUT_OPTIONS.find((o) => o.id === infoFor)!.label"
    subtitle="Top cutouts"
    :info="CUTOUT_OPTIONS.find((o) => o.id === infoFor)!.info!"
    @back="infoFor = null"
  />

  <div v-else class="stack stack_3">
    <RadioCard
      v-for="opt in CUTOUT_OPTIONS"
      :key="opt.id"
      :label="opt.label"
      :description="opt.description"
      :price="opt.price"
      :highlights="opt.features"
      :selected="store.config.cutout === opt.id"
      :with-info="!!opt.info"
      @select="store.setCutout(opt.id)"
      @info="infoFor = opt.id"
    >
      <template #icon>
        <CutoutPreview :option="opt.id" :selected="store.config.cutout === opt.id" />
      </template>
    </RadioCard>
  </div>
</template>
