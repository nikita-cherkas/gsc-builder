<script setup lang="ts">
import type { Component } from "vue";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Info } from "lucide-vue-next";

interface Props {
  label: string;
  description?: string;
  price?: number;
  highlights?: string[];
  selected: boolean;
  withInfo?: boolean;
  icon?: Component;
}

const props = withDefaults(defineProps<Props>(), {
  description: "",
  withInfo: false,
  icon: undefined,
});

const emit = defineEmits<{
  (e: "select"): void;
  (e: "info"): void;
}>();
</script>

<template>
  <div
    :class="
      cn(
        'flex items-stretch overflow-hidden rounded-lg border bg-card transition',
        selected
          ? 'border-primary'
          : 'border-border hover:border-foreground/30',
      )
    "
  >
    <div
      aria-hidden="true"
      :class="
        cn(
          'flex w-16 shrink-0 items-center justify-center border-r border-border/60 p-2 transition sm:w-20 bg-card',
          selected ? 'text-primary' : 'text-muted-foreground',
        )
      "
    >
      <slot name="icon">
        <component :is="props.icon" v-if="props.icon" class="h-6 w-6" />
      </slot>
    </div>

    <button
      type="button"
      :aria-pressed="selected"
      class="bg-white min-w-0 flex-1 p-3 text-left border-none"
      @click="emit('select')"
    >
      <div class="flex items-start gap-3">
        <span
          :class="
            cn(
              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition',
              selected
                ? 'border-primary bg-primary'
                : 'border-muted-foreground/40',
            )
          "
        >
          <span
            v-if="selected"
            class="h-1.5 w-1.5 rounded-full bg-primary-foreground"
          />
        </span>

        <div class="min-w-0 flex-1">
          <div class="flex items-baseline justify-between gap-2">
            <span class="font-medium">{{ label }}</span>
            <span
              v-if="price !== undefined"
              class="shrink-0 text-sm tabular-nums"
            >
              {{ price === 0 ? "Included" : `+${formatPrice(price)}` }}
            </span>
          </div>

          <p
            v-if="description"
            class="mt-0.5 text-sm text-muted-foreground text-pretty"
          >
            {{ description }}
          </p>

          <div
            v-if="highlights && highlights.length > 0"
            class="mt-1.5 flex flex-wrap gap-1"
          >
            <span
              v-for="h in highlights"
              :key="h"
              class="rounded-full border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {{ h }}
            </span>
          </div>

          <slot name="footer" />
        </div>
      </div>
    </button>

    <button
      v-if="withInfo"
      type="button"
      :aria-label="`More about ${label}`"
      class="bg-white flex w-10 shrink-0 items-center justify-center border-l border-r-0 border-t-0 border-b-0 border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
      @click="emit('info')"
    >
      <Info class="h-4 w-4" />
    </button>
  </div>
</template>
