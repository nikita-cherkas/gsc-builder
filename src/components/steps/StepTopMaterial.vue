<script setup lang="ts">
import { ref } from "vue";
import { useConfiguratorStore } from "@/stores/configurator";
import { useSceneBuilderStore, type TableWoodVariant } from "@/stores/sceneBuilder";
import { TOP_COLOR_OPTIONS } from "@/data/top-color";
import { TOP_MATERIAL_OPTIONS } from "@/data/top-material";
import type { TopColor, TopMaterial } from "@/types";
import RadioCard from "@/components/ui/RadioCard.vue";
import InfoSheet from "@/components/ui/InfoSheet.vue";
import { Layers, TreePine, Sparkles } from "lucide-vue-next";
import type { Component } from "vue";

const store = useConfiguratorStore();
const sceneBuilder = useSceneBuilderStore();

const infoFor = ref<TopMaterial | null>(null);

const ICONS: Record<TopMaterial, Component> = {
  laminate: Layers,
  hardwood: TreePine,
  stainless: Sparkles,
};

const FALLBACK_BY_MATERIAL: Record<TopMaterial, TopColor> = {
  laminate: "oak",
  hardwood: "walnut",
  stainless: "steel",
};

const WOOD_VARIANT_BY_MATERIAL: Partial<Record<TopMaterial, TableWoodVariant>> = {
  laminate: "light",
  hardwood: "dark",
};

function setMaterial(id: TopMaterial) {
  store.setTopMaterial(id);
  const colorIsValid = TOP_COLOR_OPTIONS.find(
    (col) => col.id === store.config.topColor && col.materials.includes(id),
  );
  if (!colorIsValid) {
    store.setTopColor(FALLBACK_BY_MATERIAL[id]);
  }

  const variant = WOOD_VARIANT_BY_MATERIAL[id];
  if (variant) sceneBuilder.setTableWoodVariant(variant);
}
</script>

<template>
  <InfoSheet
    v-if="infoFor && TOP_MATERIAL_OPTIONS.find((o) => o.id === infoFor)?.info"
    :title="TOP_MATERIAL_OPTIONS.find((o) => o.id === infoFor)!.label"
    subtitle="Top material"
    :info="TOP_MATERIAL_OPTIONS.find((o) => o.id === infoFor)!.info!"
    @back="infoFor = null"
  />

  <div v-else class="stack stack_3">
    <RadioCard
      v-for="opt in TOP_MATERIAL_OPTIONS"
      :key="opt.id"
      :label="opt.label"
      :description="opt.description"
      :price="opt.price"
      :highlights="opt.highlights"
      :selected="store.config.topMaterial === opt.id"
      :with-info="!!opt.info"
      :icon="ICONS[opt.id]"
      @select="setMaterial(opt.id)"
      @info="infoFor = opt.id"
    />
  </div>
</template>
