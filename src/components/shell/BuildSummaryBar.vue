<script setup lang="ts">
import { computed } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'
import { cn } from '@/lib/utils'
import { Info } from 'lucide-vue-next'
import type { BaseQuality, CartType } from '@/types'

const store = useConfiguratorStore()

const cartTypes: { id: CartType; label: string }[] = [
  { id: 'knockdown', label: 'Knockdown' },
  { id: 'solid', label: 'One-piece' },
]

const baseQualities: { id: BaseQuality; label: string }[] = [
  { id: 'standard', label: 'Standard' },
  { id: 'premium', label: 'Premium' },
]

const cartIndex = computed(() =>
  Math.max(0, cartTypes.findIndex((t) => t.id === store.config.cartType)),
)
const qualityIndex = computed(() =>
  Math.max(0, baseQualities.findIndex((q) => q.id === store.config.baseQuality)),
)
</script>

<template>
  <div class="pointer-events-auto">
    <div
      class="flex items-center gap-2 rounded-2xl border border-border/80 bg-card/95 p-1.5 shadow-xl backdrop-blur-md sm:gap-3 sm:p-2"
    >
      <span class="shrink-0 pl-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Your build
      </span>

      <span aria-hidden="true" class="h-6 w-px shrink-0 bg-border" />

      <div class="flex min-w-0 items-center gap-2">
        <span class="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Construction
        </span>
        <div class="w-37.5 shrink-0 xl:w-42.5">
          <div
            role="radiogroup"
            aria-label="Construction"
            class="relative flex items-center rounded-full border border-border bg-white p-0.5"
          >
            <div
              aria-hidden="true"
              class="absolute inset-y-0.5 left-0.5 rounded-full bg-foreground shadow-sm transition-transform duration-300 ease-out"
              :style="{
                width: 'calc(50% - 2px)',
                transform: `translateX(${cartIndex * 100}%)`,
              }"
            />
            <button
              v-for="t in cartTypes"
              :key="t.id"
              type="button"
              role="radio"
              :aria-checked="store.config.cartType === t.id"
              :class="cn(
                'relative z-10 h-7 min-w-0 flex-1 truncate rounded-full text-[11px] font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                store.config.cartType === t.id
                  ? 'text-background'
                  : 'text-muted-foreground hover:text-foreground',
              )"
              @click="store.setCartType(t.id)"
            >
              {{ t.label }}
            </button>
          </div>
        </div>
        <button
          type="button"
          aria-label="About cart construction"
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Info class="h-3.5 w-3.5" />
        </button>
      </div>

      <span aria-hidden="true" class="h-6 w-px shrink-0 bg-border" />

      <div class="flex min-w-0 items-center gap-2">
        <span class="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Material
        </span>
        <div class="w-37.5 shrink-0 xl:w-42.5">
          <div
            role="radiogroup"
            aria-label="Material"
            class="relative flex items-center rounded-full border border-border bg-white p-0.5"
          >
            <div
              aria-hidden="true"
              class="absolute inset-y-0.5 left-0.5 rounded-full bg-primary shadow-sm transition-transform duration-300 ease-out"
              :style="{
                width: 'calc(50% - 2px)',
                transform: `translateX(${qualityIndex * 100}%)`,
              }"
            />
            <button
              v-for="q in baseQualities"
              :key="q.id"
              type="button"
              role="radio"
              :aria-checked="store.config.baseQuality === q.id"
              :class="cn(
                'relative z-10 h-7 min-w-0 flex-1 truncate rounded-full text-[11px] font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                store.config.baseQuality === q.id
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )"
              @click="store.setBaseQuality(q.id)"
            >
              {{ q.label }}
            </button>
          </div>
        </div>
        <button
          type="button"
          aria-label="About base material"
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Info class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>
