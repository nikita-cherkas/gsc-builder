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

  <div v-else class="space-y-3">
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

    <div class="rounded-lg border border-border bg-card p-4">
      <div class="flex items-start justify-between gap-3 mb-1">
        <span class="font-medium text-[15px] text-foreground">
          {{ ADDON_OPTIONS.extraShelves.label }}
        </span>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            +{{ formatPrice(ADDON_OPTIONS.extraShelves.pricePerUnit) }} each
          </span>
          <InfoButton @click="infoFor = 'extraShelves'" />
        </div>
      </div>
      <p class="text-[12.5px] text-muted-foreground leading-snug mb-3">
        {{ ADDON_OPTIONS.extraShelves.description }}
      </p>
      <div class="flex items-center justify-between">
        <span class="text-[11px] uppercase tracking-wider text-sub font-semibold">Quantity</span>
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
