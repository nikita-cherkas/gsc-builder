<script setup lang="ts">
import { useConfiguratorStore } from "@/stores/configurator";
import { CART_TYPE_OPTIONS } from "@/data/cart-type";
import type { CartType } from "@/types";
import RadioCard from "@/components/ui/RadioCard.vue";
import { Package, Hammer } from "lucide-vue-next";
import type { Component } from "vue";

const store = useConfiguratorStore();

const ICONS: Record<CartType, Component> = {
  knockdown: Package,
  solid: Hammer,
};
</script>

<template>
  <div class="space-y-3">
    <RadioCard
      v-for="opt in CART_TYPE_OPTIONS"
      :key="opt.id"
      :label="opt.label"
      :description="opt.description"
      :price="opt.price"
      :highlights="opt.highlights"
      :selected="store.config.cartType === opt.id"
      :with-info="!!opt.info"
      :icon="ICONS[opt.id]"
      @select="store.setCartType(opt.id)"
    />
  </div>
</template>
