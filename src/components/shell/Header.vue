<script setup lang="ts">
import { useConfiguratorStore } from "@/stores/configurator";
import { Button } from "@/components/ui/button";
import { Phone, RotateCcw } from "lucide-vue-next";

const store = useConfiguratorStore();
</script>

<template>
  <header
    class="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-white px-3 py-2 lg:px-6 lg:py-3"
  >
    <div class="flex min-w-0 items-center gap-2.5 lg:gap-3">
      <img
        src="/logo.png"
        alt="Golden State Coffee Carts logo"
        class="h-7 w-auto shrink-0 lg:h-9"
        width="180"
        height="40"
        draggable="false"
      />
    </div>

    <div class="flex shrink-0 items-center gap-2 lg:gap-3">
      <Button
        variant="outline"
        size="sm"
        aria-label="Contact us"
        class="h-8 gap-1.5 bg-transparent px-2.5 text-[11px] lg:h-9 lg:px-3 lg:text-xs"
        @click="store.openContact"
      >
        <Phone class="h-3 w-3" />
        <span class="hidden sm:inline">Contact</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Reset configuration"
        class="size-9 h-8 w-8 lg:h-9 lg:w-9 bg-transparent border-none"
        @click="store.reset"
      >
        <RotateCcw class="h-3.5 w-3.5" />
      </Button>
    </div>
  </header>
</template>
