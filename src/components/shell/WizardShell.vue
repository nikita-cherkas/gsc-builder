<script setup lang="ts">
import { useConfiguratorStore } from "@/stores/configurator";
import { CONTACT } from "@/lib/contact";
import { Button } from "@/components/ui/button";
import StepRouter from "./StepRouter.vue";
import { ArrowLeft, ArrowRight, Phone, Mail, Clock } from "lucide-vue-next";

const store = useConfiguratorStore();
</script>

<template>
  <section
    class="flex min-h-0 flex-1 flex-col bg-white lg:w-120 lg:flex-none xl:w-130"
  >
    <div
      class="hidden shrink-0 items-center justify-between gap-3 border-b border-border bg-white px-5 py-2.5 lg:flex"
    >
      <h2
        class="truncate font-sans text-base font-semibold leading-tight text-foreground"
      >
        {{ store.currentStep.label }}
      </h2>
      <span
        class="shrink-0 rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground"
      >
        Step {{ store.stepIndex + 1 }} of {{ store.steps.length }}
      </span>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      <div class="mx-auto w-full max-w-2xl min-w-0 px-3 py-3 lg:px-5 lg:py-5">
        <div class="mb-3 lg:hidden">
          <h2
            class="font-sans text-lg font-semibold leading-tight text-foreground"
          >
            {{ store.currentStep.label }}
          </h2>
          <p class="mt-0.5 text-xs text-muted-foreground">
            Step {{ store.stepIndex + 1 }} of {{ store.steps.length }}
          </p>
        </div>

        <StepRouter />
      </div>
    </div>

    <div
      class="flex shrink-0 items-center gap-2 border-t border-border bg-white px-3 py-2 lg:px-5 lg:py-3"
      :style="{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.5rem)' }"
    >
      <Button
        variant="outline"
        :disabled="store.isFirst"
        class="h-10 gap-1 bg-transparent"
        @click="store.back"
      >
        <ArrowLeft class="h-4 w-4" />
        <span class="hidden sm:inline">Back</span>
      </Button>

      <Button
        :disabled="!store.canProceed"
        class="h-10 flex-1 gap-1"
        @click="store.next"
      >
        <span>Continue</span>
        <ArrowRight class="h-4 w-4" />
      </Button>
    </div>

    <div
      class="hidden shrink-0 border-t border-border bg-muted/30 px-5 py-2.5 text-[11px] text-muted-foreground lg:flex lg:flex-wrap lg:items-center lg:gap-x-2.5 lg:gap-y-1"
    >
      <a
        :href="CONTACT.phoneHref"
        class="inline-flex items-center gap-1.5 text-muted-foreground no-underline hover:text-foreground transition"
      >
        <Phone class="h-3 w-3" />
        {{ CONTACT.phone }}
      </a>
      <a
        :href="CONTACT.emailHref"
        class="inline-flex items-center gap-1.5 text-muted-foreground no-underline hover:text-foreground transition"
      >
        <Mail class="h-3 w-3" />
        {{ CONTACT.email }}
      </a>
      <span class="inline-flex items-center gap-1.5">
        <Clock class="h-3 w-3" />
        {{ CONTACT.hours }}
      </span>
    </div>
  </section>
</template>
