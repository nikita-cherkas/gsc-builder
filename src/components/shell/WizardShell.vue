<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useConfiguratorStore } from "@/stores/configurator";
import Step from "@/components/general/step/Step.vue";
import StepRouter from "./StepRouter.vue";

const store = useConfiguratorStore();

const carouselRef = ref<HTMLDivElement | null>(null);

const continueLabel = computed(() => store.nextLabel);
const counterLabel = computed(
  () => `Step ${store.stepIndex + 1} of ${store.steps.length}`,
);

watch(
  () => store.effectiveStepId,
  async () => {
    await nextTick();
    const carousel = carouselRef.value;
    if (!carousel) return;
    const active = carousel.querySelector<HTMLElement>(".wizard__pill_active");
    active?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  },
);
</script>

<template>
  <aside class="wizard">
    <div class="wizard__header">
      <div ref="carouselRef" class="wizard__pills">
        <button
          v-for="(step, idx) in store.steps"
          :key="step.id"
          type="button"
          :class="[
            'wizard__pill',
            { wizard__pill_active: step.id === store.effectiveStepId },
            { wizard__pill_done: idx < store.stepIndex },
          ]"
          @click="store.goTo(step.id)"
        >
          <span class="wizard__pill-num">{{ idx + 1 }}</span>
          <span class="wizard__pill-label">{{
            step.shortLabel ?? step.label
          }}</span>
        </button>
      </div>
    </div>

    <div class="wizard__body">
      <Step
        :section-title="counterLabel"
        :title="store.currentStep.label"
        :description="store.currentStep.hint"
      >
        <StepRouter />
      </Step>
    </div>

    <footer class="wizard__footer">
      <button
        type="button"
        class="wizard__back"
        :disabled="store.isFirst"
        @click="store.back"
      >
        ← Back
      </button>
      <button
        type="button"
        class="wizard__continue"
        :disabled="!store.canProceed"
        @click="store.next"
      >
        {{ continueLabel }}
      </button>
    </footer>
  </aside>
</template>

<style lang="scss" scoped>
@use "@/styles/colors" as colors;
@use "@/styles/base" as base;
@use "@/styles/media-breakpoints" as breakpoints;

.wizard {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  background: colors.$white;
  box-shadow: colors.$main-shadow;
  border-left: 1px solid colors.$gray-300;
  overflow: hidden;

  @include breakpoints.media-breakpoint-down(md) {
    border-left: none;
    border-top: 1px solid colors.$gray-300;
  }

  &__header {
    flex-shrink: 0;
    width: 100%;
    min-width: 0;
    padding: 14px 20px;
    border-bottom: 1px solid colors.$gray-300;
    background: colors.$white;
    overflow: hidden;
  }

  &__pills {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__pill {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    border: 1px solid colors.$gray-300;
    background: colors.$white;
    color: colors.$gray;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;

    @media (hover: hover) {
      &:hover:not(.wizard__pill_active) {
        border-color: colors.$gray-light;
        color: colors.$black;
      }
    }

    &_active {
      background: colors.$orange-medium;
      border-color: colors.$orange-medium;
      color: colors.$white;
    }

    &_done {
      background: rgba(255, 107, 0, 0.08);
      border-color: rgba(255, 107, 0, 0.2);
      color: colors.$orange;
    }
  }

  &__pill-num {
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    opacity: 0.85;
  }

  &__pill-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 110px;
  }

  &__body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px 0 24px;
  }

  &__footer {
    flex-shrink: 0;
    display: flex;
    gap: 10px;
    padding: 14px 20px calc(env(safe-area-inset-bottom, 0) + 14px);
    border-top: 1px solid colors.$gray-300;
    background: colors.$white;
  }

  &__back,
  &__continue {
    height: 48px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  &__back {
    flex-shrink: 0;
    padding: 0 18px;
    background: colors.$white;
    border: 1px solid colors.$gray-300;
    color: colors.$black;

    @media (hover: hover) {
      &:not(:disabled):hover {
        border-color: colors.$gray;
      }
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__continue {
    flex: 1;
    background: colors.$orange-medium;
    border: 1px solid colors.$orange-medium;
    color: colors.$white;
    padding: 0 22px;

    @media (hover: hover) {
      &:not(:disabled):hover {
        background: colors.$orange;
        border-color: colors.$orange;
      }
    }

    &:disabled {
      background: colors.$disabled;
      border-color: colors.$disabled;
      cursor: not-allowed;
    }
  }
}
</style>
