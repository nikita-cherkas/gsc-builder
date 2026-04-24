<script setup lang="ts">
import { ref } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'
import { useSceneBuilderStore } from '@/stores/sceneBuilder'
import { CUTOUT_OPTIONS, CUTOUTS_WITH_SINK, SINK_MODEL_URL, SINK_ANCHOR } from '@/data/cutout'
import type { CutoutOption } from '@/types'
import RadioCard from '@/components/ui/RadioCard.vue'
import CutoutPreview from '@/components/ui/CutoutPreview.vue'
import InfoSheet from '@/components/ui/InfoSheet.vue'

const store = useConfiguratorStore()
const sceneBuilder = useSceneBuilderStore()

const infoFor = ref<CutoutOption | null>(null)

function pickCutout(id: CutoutOption) {
  store.setCutout(id)
  if (CUTOUTS_WITH_SINK.has(id)) {
    sceneBuilder.placeAtAnchor(SINK_ANCHOR, SINK_MODEL_URL)
  } else {
    sceneBuilder.clearAnchor(SINK_ANCHOR)
  }
}
</script>

<template>
  <InfoSheet
    v-if="infoFor && CUTOUT_OPTIONS.find((o) => o.id === infoFor)?.info"
    :title="CUTOUT_OPTIONS.find((o) => o.id === infoFor)!.label"
    subtitle="Top cutouts"
    :info="CUTOUT_OPTIONS.find((o) => o.id === infoFor)!.info!"
    @back="infoFor = null"
  />

  <div v-else class="space-y-3">
    <RadioCard
      v-for="opt in CUTOUT_OPTIONS"
      :key="opt.id"
      :label="opt.label"
      :description="opt.description"
      :price="opt.price"
      :highlights="opt.features"
      :selected="store.config.cutout === opt.id"
      :with-info="!!opt.info"
      @select="pickCutout(opt.id)"
      @info="infoFor = opt.id"
    >
      <template #icon>
        <CutoutPreview :option="opt.id" :selected="store.config.cutout === opt.id" />
      </template>
    </RadioCard>
  </div>
</template>
