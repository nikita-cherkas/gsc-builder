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
  <div class="step-summary">
    <section class="step-summary__section">
      <div class="step-summary__heading">Cart</div>
      <dl class="step-summary__list">
        <div v-for="[k, v] in cartRows" :key="k" class="step-summary__row">
          <dt class="step-summary__row-label">{{ k }}</dt>
          <dd class="step-summary__row-value">{{ v }}</dd>
        </div>
      </dl>
    </section>

    <section v-if="equipmentRows.length > 0" class="step-summary__section">
      <div class="step-summary__heading">Equipment</div>
      <dl class="step-summary__list">
        <div v-for="[k, v] in equipmentRows" :key="`${k}-${v}`" class="step-summary__row">
          <dt class="step-summary__row-label">{{ k }}</dt>
          <dd class="step-summary__row-value">{{ v }}</dd>
        </div>
      </dl>
    </section>

    <section class="step-summary__section">
      <div class="step-summary__heading">Price breakdown</div>
      <ul class="step-summary__list">
        <li v-for="(l, i) in store.priceLines" :key="i" class="step-summary__row">
          <span class="step-summary__price-label">{{ l.label }}</span>
          <span class="step-summary__price-value">{{ formatPrice(l.amount) }}</span>
        </li>
        <li class="step-summary__row step-summary__row_total">
          <span class="step-summary__total-label">Total</span>
          <span class="step-summary__total-value">{{ formatPrice(store.total) }}</span>
        </li>
      </ul>
      <p class="step-summary__legal">
        Estimate only. Final quote includes freight, setup, and any local taxes.
      </p>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colors' as colors;

.step-summary {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__heading {
    color: colors.$gray;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  &__list {
    border: 1px solid colors.$gray-300;
    background: colors.$white;
    border-radius: 12px;
    overflow: hidden;
    margin: 0;
    padding: 0;

    > * + * {
      border-top: 1px solid colors.$gray-300;
    }
  }

  &__row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 16px;
    font-size: 13px;
    margin: 0;

    &_total {
      padding: 14px 16px;
      background: rgba(255, 107, 0, 0.08);
    }
  }

  &__row-label {
    color: colors.$gray;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &__row-value {
    color: colors.$black;
    text-align: right;
  }

  &__price-label {
    color: colors.$gray-900;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__price-value {
    flex-shrink: 0;
    color: colors.$black;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  &__total-label {
    color: colors.$orange-medium;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  &__total-value {
    color: colors.$black;
    font-size: 20px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__legal {
    color: colors.$gray;
    font-size: 11px;
    line-height: 1.5;
    margin-top: 4px;
  }
}
</style>
