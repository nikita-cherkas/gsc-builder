<script setup lang="ts">
import { nextTick, onMounted } from "vue";
import { useConfiguratorStore } from "./stores/configurator";
import Viewport from "./components/shell/Viewport.vue";
import ConfiguratorControls from "./components/shell/ConfiguratorControls.vue";
import BuildSummaryBar from "./components/shell/BuildSummaryBar.vue";
import WizardShell from "./components/shell/WizardShell.vue";
import ContactModal from "./components/modals/ContactModal.vue";

const configuratorStore = useConfiguratorStore();

onMounted(() => {
  window.parent.postMessage(
    {
      message: "getCookingEquipment",
    },
    "*",
  );

  window.addEventListener("message", async ({ data }) => {
    if (data && data.success && data.message === "getCookingEquipment") {
      configuratorStore.setEquipmentData(data.data?.content);
      await nextTick();
    }
  });
});
</script>

<template>
  <div class="builder-page">
    <div class="builder-page__configurator">
      <Viewport />

      <img
        src="/logo.png"
        alt="Golden State Coffee Carts"
        class="builder-page__logo"
        loading="lazy"
        draggable="false"
      />

      <ConfiguratorControls />

      <div class="builder-page__summary-block">
        <BuildSummaryBar />
      </div>
    </div>

    <WizardShell class="builder-page__sidebar" />

    <ContactModal />
  </div>
</template>

<style lang="scss" scoped>
@use "./styles/colors" as colors;
@use "./styles/base" as base;
@use "./styles/media-breakpoints" as breakpoints;

.builder-page {
  position: relative;
  display: flex;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  background-color: colors.$canvas;

  @include breakpoints.media-breakpoint-down(md) {
    flex-direction: column;
  }

  &__configurator {
    position: relative;
    flex: 1;
    min-width: 0;
    min-height: 0;

    @include breakpoints.media-breakpoint-down(md) {
      flex: 0 0 auto;
      height: 38dvh;
      min-height: 220px;
      border-bottom: 1px solid colors.$gray-300;
    }
  }

  &__sidebar {
    flex: 0 0 base.$sidebar-width;
    width: base.$sidebar-width;
    min-width: 0;
    max-width: base.$sidebar-width;

    @include breakpoints.media-breakpoint-down(md) {
      flex: 1;
      width: 100%;
      max-width: 100%;
      min-height: 0;
    }
  }

  &__logo {
    position: absolute;
    top: 20px;
    left: 20px;
    height: 38px;
    width: auto;
    max-width: 160px;
    object-fit: contain;
    pointer-events: none;
    user-select: none;
    z-index: 2;

    @include breakpoints.media-breakpoint-down(xs) {
      top: 12px;
      left: 12px;
      height: 30px;
      max-width: 120px;
    }
  }

  &__summary-block {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    pointer-events: none;
    max-width: calc(100% - 40px);

    @include breakpoints.media-breakpoint-down(md) {
      display: none;
    }
  }
}
</style>
