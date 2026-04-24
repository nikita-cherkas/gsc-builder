<script setup lang="ts">
import Header from "./components/shell/Header.vue";
import Viewport from "./components/shell/Viewport.vue";
import ConfiguratorControls from "./components/shell/ConfiguratorControls.vue";
import BuildSummaryBar from "./components/shell/BuildSummaryBar.vue";
import WizardShell from "./components/shell/WizardShell.vue";
import ContactModal from "./components/modals/ContactModal.vue";
import { nextTick, onMounted } from "vue";
import { useConfiguratorStore } from "./stores/configurator";

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
  <div class="flex h-dvh w-full flex-col overflow-hidden bg-background">
    <Header />

    <div class="flex min-h-0 flex-1 flex-col lg:flex-row">
      <section
        class="relative shrink-0 border-b border-border h-[34vh] min-h-55 lg:h-auto lg:min-h-0 lg:flex-1 lg:border-b-0 lg:border-r"
        style="background-color: #f5f1ea"
      >
        <Viewport />

        <div class="pointer-events-none absolute inset-0">
          <ConfiguratorControls />
        </div>

        <div
          class="pointer-events-none absolute inset-x-0 bottom-4 z-10 hidden justify-center px-4 lg:flex"
        >
          <BuildSummaryBar />
        </div>
      </section>

      <WizardShell />
    </div>

    <ContactModal />
  </div>
</template>
