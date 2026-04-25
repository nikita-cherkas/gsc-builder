<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConfiguratorStore } from '@/stores/configurator'
import { ADDON_OPTIONS } from '@/data/addons'
import { formatPrice } from '@/lib/formatters'
import SimpleToggle from '@/components/ui/SimpleToggle.vue'
import Counter from '@/components/ui/Counter.vue'
import InfoButton from '@/components/ui/InfoButton.vue'
import InfoSheet from '@/components/ui/InfoSheet.vue'

type AddonId = 'foldableFlaps' | 'shelfInsert' | 'extraShelves'

const store = useConfiguratorStore()

const infoFor = ref<AddonId | null>(null)

const activeInfo = computed(() => {
  if (!infoFor.value) return null
  const opt = ADDON_OPTIONS[infoFor.value]
  if ('info' in opt && opt.info) return { opt, label: opt.label }
  return null
})
</script>

<template>
  <InfoSheet
    v-if="activeInfo"
    :title="activeInfo.label"
    subtitle="Add-on"
    :info="activeInfo.opt.info!"
    @back="infoFor = null"
  />

  <div v-else class="step-addons">
    <SimpleToggle
      :active="store.config.foldableFlaps"
      :title="ADDON_OPTIONS.foldableFlaps.label"
      :description="ADDON_OPTIONS.foldableFlaps.description"
      :price="ADDON_OPTIONS.foldableFlaps.price"
      with-info
      @toggle="store.setFoldableFlaps(!store.config.foldableFlaps)"
      @info="infoFor = 'foldableFlaps'"
    />

    <SimpleToggle
      :active="store.config.shelfInsert"
      :title="ADDON_OPTIONS.shelfInsert.label"
      :description="ADDON_OPTIONS.shelfInsert.description"
      :price="ADDON_OPTIONS.shelfInsert.price"
      with-info
      @toggle="store.setShelfInsert(!store.config.shelfInsert)"
      @info="infoFor = 'shelfInsert'"
    />

    <div class="extra-shelves">
      <div class="extra-shelves__head">
        <span class="extra-shelves__title">
          {{ ADDON_OPTIONS.extraShelves.label }}
        </span>
        <div class="extra-shelves__head-right">
          <span class="extra-shelves__rate">
            +{{ formatPrice(ADDON_OPTIONS.extraShelves.pricePerUnit) }} each
          </span>
          <InfoButton @click="infoFor = 'extraShelves'" />
        </div>
      </div>
      <p class="extra-shelves__description">
        {{ ADDON_OPTIONS.extraShelves.description }}
      </p>
      <div class="extra-shelves__qty">
        <span class="extra-shelves__qty-label">Quantity</span>
        <Counter
          :value="store.config.extraShelves"
          :min="0"
          :max="ADDON_OPTIONS.extraShelves.max"
          @update:value="store.setExtraShelves"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colors' as colors;

.step-addons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.extra-shelves {
  border: 1px solid colors.$gray-300;
  background: colors.$white;
  border-radius: 12px;
  padding: 16px;

  &__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 4px;
  }

  &__title {
    color: colors.$black;
    font-size: 15px;
    font-weight: 600;
  }

  &__head-right {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  &__rate {
    color: colors.$gray;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &__description {
    color: colors.$gray-900;
    font-size: 12.5px;
    line-height: 1.5;
    margin-bottom: 12px;
  }

  &__qty {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__qty-label {
    color: colors.$gray;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
}
</style>
