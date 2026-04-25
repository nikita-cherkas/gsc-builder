<script setup lang="ts">
import type { EquipmentAttributes, EquipmentItem } from "@/types";
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
interface Props {
  selectedEquipment: EquipmentItem;
  attributes: EquipmentAttributes[];
}
const props = defineProps<Props>();

const descriptionText = ref<HTMLElement | null>(null);
const descriptionHeight = ref(0);
let resizeObserver: ResizeObserver | null = null;

watch(descriptionText, async () => {
  await nextTick();
  updateContentHeight();
});

function updateContentHeight() {
  const el = descriptionText.value;
  if (el) {
    descriptionHeight.value = el.scrollHeight;
  }
}

onMounted(() => {
  updateContentHeight();
  resizeObserver = new ResizeObserver(updateContentHeight);
  if (descriptionText.value) {
    resizeObserver.observe(descriptionText.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>
<template>
  <div class="equipment-popup__info-block">
    <div
      class="equipment-popup__category"
      v-if="props.selectedEquipment.categories[1].name"
    >
      {{ props.selectedEquipment.categories[1].name }}
    </div>
    <h2 class="equipment-title">{{ props.selectedEquipment.name }}</h2>
    <div
      class="equipment-popup__desc"
      v-if="props.selectedEquipment.short_description_for_3d_builder"
    >
      <div class="equipment-popup__desc-content">
        <div
          ref="descriptionText"
          v-html="props.selectedEquipment.short_description_for_3d_builder"
        />
      </div>
    </div>
    <div class="equipment-popup__specification" v-if="props.attributes">
      <div
        class="equipment-popup__specification-item"
        v-for="(item, idx) in props.attributes.slice(0, 4)"
        :key="idx"
      >
        <h3>{{ item.label }}</h3>
        <p>{{ item.value }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/media-breakpoints" as breakpoints;
$c-white: #ffffff;
$c-gray-50: #f9fafb;
$c-gray-100: #f3f4f6;
$c-gray-200: #e5e7eb;
$c-gray-500: #6b7280;
$c-gray-900: #111827;
$c-orange-50: #fff7ed;
$c-orange-500: #f97316;
$c-orange-600: #ea580c;
$c-gray-border: #e5e7eb;

$c-bg-light: #f9fafb;
$c-gray-border: #e5e7eb;
$c-text-main: #111827;
$c-text-secondary: #6b7280;
$c-orange-brand: #f97316;
$c-btn-dark: #0f172a;

.equipment-popup__info-block {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  max-height: 157px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: $c-gray-border;
    border-radius: 4px;
  }

  @include breakpoints.media-breakpoint-down(sm) {
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
  margin-bottom: 12px;
  margin-top: 0;
}

.equipment-popup__desc {
  margin-bottom: 20px;
}

.equipment-popup__desc-content {
  font-size: 14px;
  line-height: 1.6;
  color: $c-gray-500;
}

.equipment-popup__specification {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 12px;

  @media (max-width: 780px) {
    gap: 12px 8px;
  }
}
.equipment-popup__specification-item {
  background: #fafafa;
  padding: 10px 12px;
  border-radius: 0.625rem;
  font-weight: 500;
  display: grid;
  gap: 4px;
  min-width: 0;
  width: 90%;

  h3 {
    font-size: 12px;
    color: $c-text-secondary;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    font-weight: 500;
  }

  p {
    font-size: 14px;
    color: $c-text-main;
    margin: 0;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
