<script setup lang="ts">
import { computed } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'
import { BASE_COLOR_OPTIONS } from '@/data/base-color'
import { CART_TYPE_OPTIONS } from '@/data/cart-type'
import { CUTOUT_OPTIONS } from '@/data/cutout'
import { TOP_COLOR_OPTIONS } from '@/data/top-color'
import { TOP_MATERIAL_OPTIONS } from '@/data/top-material'
import { formatPrice } from '@/lib/formatters'
import { getSelectedEquipment } from '@/lib/equipment'

const store = useConfiguratorStore()

const cartType = computed(
  () => CART_TYPE_OPTIONS.find((o) => o.id === store.config.cartType)!.label,
)
const cutout = computed(() => CUTOUT_OPTIONS.find((o) => o.id === store.config.cutout)!.label)
const topMat = computed(
  () => TOP_MATERIAL_OPTIONS.find((o) => o.id === store.config.topMaterial)!.label,
)
const topColor = computed(
  () => TOP_COLOR_OPTIONS.find((o) => o.id === store.config.topColor)!.label,
)
const baseColor = computed(() =>
  store.config.baseQuality === 'premium'
    ? BASE_COLOR_OPTIONS.find((c) => c.id === store.config.baseColor)?.label ?? '—'
    : 'Natural',
)

const addonsLine = computed(() => {
  const parts = [
    store.config.foldableFlaps && 'Foldable flaps',
    store.config.shelfInsert && 'Interior shelf',
    store.config.extraShelves > 0 && `${store.config.extraShelves}× extra shelf`,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(' · ') : '—'
})

const cartRows = computed<[string, string][]>(() => [
  ['Construction', cartType.value],
  [
    'Base',
    `${store.config.baseQuality === 'premium' ? 'Premium' : 'Standard'} · ${baseColor.value}`,
  ],
  ['Top', `${cutout.value} cutouts · ${topMat.value} · ${topColor.value}`],
  ['Add-ons', addonsLine.value],
])

const selectedEquipment = computed(() =>
  getSelectedEquipment(store.equipmentData, store.config),
)
const equipmentRows = computed<[string, string][]>(() =>
  selectedEquipment.value.map((e) => [
    e.attributes?.Brand ?? e.brands ?? '',
    e.attributes?.Option ?? e.name,
  ] as [string, string]),
)
</script>

<template>
  <div class="space-y-5">
    <!-- Cart spec -->
    <div>
      <div class="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
        Cart
      </div>
      <dl class="rounded-lg border border-border bg-card divide-y divide-border overflow-hidden">
        <div
          v-for="[k, v] in cartRows"
          :key="k"
          class="flex items-baseline justify-between gap-3 px-4 py-2.5 text-[13px]"
        >
          <dt class="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            {{ k }}
          </dt>
          <dd class="text-foreground text-right">{{ v }}</dd>
        </div>
      </dl>
    </div>

    <!-- Equipment spec -->
    <div v-if="equipmentRows.length > 0">
      <div class="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
        Equipment
      </div>
      <dl class="rounded-lg border border-border bg-card divide-y divide-border overflow-hidden">
        <div
          v-for="[k, v] in equipmentRows"
          :key="`${k}-${v}`"
          class="flex items-baseline justify-between gap-3 px-4 py-2.5 text-[13px]"
        >
          <dt class="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            {{ k }}
          </dt>
          <dd class="text-foreground text-right">{{ v }}</dd>
        </div>
      </dl>
    </div>

    <!-- Price breakdown -->
    <div>
      <div class="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
        Price breakdown
      </div>
      <ul class="rounded-lg border border-border bg-card divide-y divide-border overflow-hidden">
        <li
          v-for="(l, i) in store.priceLines"
          :key="i"
          class="flex items-baseline justify-between gap-3 px-4 py-2.5 text-[13px]"
        >
          <span class="text-sub truncate">{{ l.label }}</span>
          <span class="text-foreground font-semibold tabular-nums shrink-0">
            {{ formatPrice(l.amount) }}
          </span>
        </li>
        <li class="flex items-baseline justify-between gap-3 px-4 py-3 bg-primary/8">
          <span class="text-[11px] uppercase tracking-wider text-primary font-semibold">Total</span>
          <span class="text-xl font-semibold text-foreground tabular-nums">
            {{ formatPrice(store.total) }}
          </span>
        </li>
      </ul>
      <p class="text-[11px] text-muted-foreground mt-2 leading-snug">
        Estimate only. Final quote includes freight, setup, and any local taxes.
      </p>
    </div>
  </div>
</template>
