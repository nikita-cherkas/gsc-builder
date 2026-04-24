<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import type { EquipmentItem } from '@/types'

interface Attr {
  label: string
  value: string
}

interface Props {
  selectedEquipment: EquipmentItem
  attributes: Attr[]
}

const props = defineProps<Props>()

const descriptionText = ref<HTMLElement | null>(null)
const descriptionHeight = ref(0)
let resizeObserver: ResizeObserver | null = null

watch(descriptionText, async () => {
  await nextTick()
  updateContentHeight()
})

function updateContentHeight() {
  const el = descriptionText.value
  if (el) descriptionHeight.value = el.scrollHeight
}

onMounted(() => {
  updateContentHeight()
  resizeObserver = new ResizeObserver(updateContentHeight)
  if (descriptionText.value) resizeObserver.observe(descriptionText.value)
})

onUnmounted(() => resizeObserver?.disconnect())
</script>

<template>
  <div class="equipment-popup__info-block">
    <div
      v-if="props.selectedEquipment.categories[1]?.name"
      class="equipment-popup__category"
    >
      {{ props.selectedEquipment.categories[1].name }}
    </div>
    <h2 class="equipment-title">{{ props.selectedEquipment.name }}</h2>
    <div
      v-if="props.selectedEquipment.short_description_for_3d_builder"
      class="equipment-popup__desc"
    >
      <div class="equipment-popup__desc-content">
        <div
          ref="descriptionText"
          v-html="props.selectedEquipment.short_description_for_3d_builder"
        />
      </div>
    </div>
    <div v-if="props.attributes.length" class="equipment-popup__specification">
      <div
        v-for="(item, idx) in props.attributes.slice(0, 4)"
        :key="idx"
        class="equipment-popup__specification-item"
      >
        <h3>{{ item.label }}</h3>
        <p>{{ item.value }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$c-white: #ffffff;
$c-gray-border: #e5e7eb;
$c-gray-500: #6b7280;
$c-text-main: #111827;
$c-orange-600: #ea580c;
$bp-sm: 575px;

.equipment-popup__info-block {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: $c-gray-border;
    border-radius: 4px;
  }

  @media (max-width: $bp-sm) {
    display: none;
  }
}

.equipment-popup__category {
  font-size: 12px;
  font-weight: 700;
  color: $c-orange-600;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.equipment-title {
  font-size: 20px;
  font-weight: 700;
  color: $c-text-main;
  margin: 0 0 12px 0;
}

.equipment-popup__desc {
  margin-bottom: 20px;
}

.equipment-popup__desc-content {
  font-size: 14px;
  line-height: 1.6;
  color: $c-gray-500;

  :deep(p) {
    margin: 0 0 8px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.equipment-popup__specification {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.equipment-popup__specification-item {
  background: #fafafa;
  padding: 10px;
  border-radius: 0.625rem;
  font-weight: 500;
  display: grid;
  gap: 4px;
  min-width: 0;

  h3 {
    font-size: 12px;
    color: #6b7280;
    margin: 0;
    font-weight: 500;
    overflow-wrap: break-word;
  }

  p {
    font-size: 14px;
    color: #000;
    margin: 0;
    overflow-wrap: break-word;
  }
}
</style>
