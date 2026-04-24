<script setup lang="ts">
import { useConfiguratorStore } from "@/stores/configurator";
import { Pause, Play, Ruler, RefreshCw } from "lucide-vue-next";

const store = useConfiguratorStore();
</script>

<template>
  <div class="pointer-events-auto absolute right-2 top-2 flex flex-col gap-1.5">
    <button
      type="button"
      :aria-label="store.autoRotate ? 'Pause rotation' : 'Start rotation'"
      :title="store.autoRotate ? 'Pause rotation' : 'Start rotation'"
      class="flex h-8 w-8 aspect-square shrink-0 items-center justify-center rounded-full border shadow-sm backdrop-blur transition border-border bg-card/90 text-foreground hover:bg-card"
      @click="store.toggleAutoRotate"
    >
      <Pause v-if="store.autoRotate" class="h-3.5 w-3.5" />
      <Play v-else class="h-3.5 w-3.5" />
    </button>

    <button
      type="button"
      aria-label="Show dimensions"
      title="Show dimensions"
      class="flex h-8 w-8 aspect-square shrink-0 items-center justify-center rounded-full border shadow-sm backdrop-blur transition border-border bg-card/90 text-foreground hover:bg-card"
    >
      <Ruler class="h-3.5 w-3.5" />
    </button>

    <button
      type="button"
      aria-label="Reset view"
      title="Reset view"
      class="flex h-8 w-8 aspect-square shrink-0 items-center justify-center rounded-full border shadow-sm backdrop-blur transition border-border bg-card/90 text-foreground hover:bg-card"
      @click="store.resetViewport()"
    >
      <RefreshCw class="h-3.5 w-3.5" />
    </button>
  </div>
</template>
