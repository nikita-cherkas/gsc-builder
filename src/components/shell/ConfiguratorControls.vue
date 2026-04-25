<script setup lang="ts">
import { useConfiguratorStore } from "@/stores/configurator";
import { Pause, Play, Ruler, RefreshCw, RotateCcw, Phone } from "lucide-vue-next";

const store = useConfiguratorStore();
</script>

<template>
  <div class="configurator-controls">
    <button
      type="button"
      :aria-label="store.autoRotate ? 'Pause rotation' : 'Start rotation'"
      :title="store.autoRotate ? 'Pause rotation' : 'Start rotation'"
      class="configurator-controls__btn"
      @click="store.toggleAutoRotate"
    >
      <Pause v-if="store.autoRotate" />
      <Play v-else />
    </button>

    <button
      type="button"
      aria-label="Show dimensions"
      title="Show dimensions"
      class="configurator-controls__btn"
    >
      <Ruler />
    </button>

    <button
      type="button"
      aria-label="Reset view"
      title="Reset view"
      class="configurator-controls__btn"
      @click="store.resetViewport()"
    >
      <RefreshCw />
    </button>

    <span class="configurator-controls__divider" aria-hidden="true" />

    <button
      type="button"
      aria-label="Reset configuration"
      title="Reset configuration"
      class="configurator-controls__btn"
      @click="store.reset"
    >
      <RotateCcw />
    </button>

    <button
      type="button"
      aria-label="Contact us"
      title="Contact us"
      class="configurator-controls__btn"
      @click="store.openContact"
    >
      <Phone />
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/colors" as colors;
@use "@/styles/media-breakpoints" as breakpoints;

.configurator-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  z-index: 3;

  @include breakpoints.media-breakpoint-down(xs) {
    top: 12px;
    right: 12px;
    gap: 6px;
  }

  &__btn {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: colors.$main-shadow;
    color: colors.$black;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease, color 0.2s ease;
    flex-shrink: 0;

    svg {
      width: 18px;
      height: 18px;
    }

    @media (hover: hover) {
      &:hover {
        background-color: colors.$white;
        color: colors.$orange-medium;
      }
    }

    @include breakpoints.media-breakpoint-down(xs) {
      width: 38px;
      height: 38px;

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }

  &__divider {
    width: 1px;
    height: 24px;
    background: rgba(0, 0, 0, 0.12);
    margin: 0 4px;
    flex-shrink: 0;

    @include breakpoints.media-breakpoint-down(xs) {
      display: none;
    }
  }
}
</style>
