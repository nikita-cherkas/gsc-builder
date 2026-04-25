<script setup lang="ts">
import { computed, ref } from "vue";
import { useConfiguratorStore } from "@/stores/configurator";
import { useSceneBuilderStore } from "@/stores/sceneBuilder";
import { formatPrice } from "@/lib/formatters";
import {
  getAllEquipmentItems,
  getCategoryItems,
  getSelectedInCategory,
} from "@/lib/equipment";
import { resolveAnchor } from "@/data/anchors";
import EquipmentModal from "@/components/modals/equipment/EquipmentModal.vue";
import { Check, ChevronRight, Pencil } from "lucide-vue-next";
import type { EquipmentGroupData, EquipmentItem } from "@/types";

const store = useConfiguratorStore();
const sceneBuilder = useSceneBuilderStore();

function findItemById(id: number): EquipmentItem | undefined {
  return getAllEquipmentItems(store.equipmentData).find((i) => i.id === id);
}

function syncPlacement(item: EquipmentItem): void {
  const binding = resolveAnchor(item);
  if (!binding) return;
  const url = item.model_full?.url;
  if (!url) return;
  sceneBuilder.placeAtAnchor(binding.anchor, url, binding.transform);
}

function clearPlacement(item: EquipmentItem): void {
  const binding = resolveAnchor(item);
  if (!binding) return;
  sceneBuilder.clearAnchor(binding.anchor);
}

const modalOpen = ref(false);
const modalCategory = ref<EquipmentGroupData | null>(null);

const categories = computed(() => Object.values(store.equipmentData));

const modalSelectedIds = computed(() => {
  if (!modalCategory.value) return [];
  return getSelectedInCategory(store.config, modalCategory.value).map(
    (i) => i.id,
  );
});

function openModal(category: EquipmentGroupData) {
  modalCategory.value = category;
  modalOpen.value = true;
}

function onCategoryClick(category: EquipmentGroupData) {
  const selected = getSelectedInCategory(store.config, category);
  if (selected.length > 0) {
    for (const item of selected) {
      store.removeEquipment(item.id);
      clearPlacement(item);
    }
    return;
  }
  openModal(category);
}

function onCategoryEdit(category: EquipmentGroupData, event: MouseEvent) {
  event.stopPropagation();
  openModal(category);
}

function handleAdd(item: EquipmentItem) {
  store.addEquipment(item.id);
  syncPlacement(item);
}

function handleReplace({ oldIds, newId }: { oldIds: number[]; newId: number }) {
  store.replaceEquipmentInGroup(oldIds, newId);
  const next = findItemById(newId);
  if (next) syncPlacement(next);
}

function handleRemove(id: number) {
  store.removeEquipment(id);
  const item = findItemById(id);
  if (item) clearPlacement(item);
}

function previewFor(category: EquipmentGroupData): EquipmentItem[] {
  return getSelectedInCategory(store.config, category);
}

function totalOptions(category: EquipmentGroupData): number {
  return getCategoryItems(category).length;
}
</script>

<template>
  <div class="step-equipment">
    <p class="step-equipment__hint">
      Tap a category to browse models, filter by brand, and pick your equipment.
    </p>

    <div
      v-for="category in categories"
      :key="category.name"
      :class="[
        'eq-row',
        { 'eq-row_active': previewFor(category).length > 0 },
      ]"
    >
      <button
        type="button"
        class="eq-row__main"
        :title="
          previewFor(category).length > 0
            ? 'Click to remove selection'
            : 'Click to browse models'
        "
        @click="onCategoryClick(category)"
      >
        <div class="eq-row__icon-cell">
          <img
            v-if="category.icon"
            :src="category.icon"
            :alt="category.name"
            class="eq-row__icon"
            loading="lazy"
            onerror="this.style.display = 'none'"
          />
        </div>

        <div class="eq-row__body">
          <span :class="['eq-row__check', { 'eq-row__check_on': previewFor(category).length > 0 }]">
            <Check v-if="previewFor(category).length > 0" />
          </span>

          <div class="eq-row__content">
            <div class="eq-row__heading">
              <span class="eq-row__name">{{ category.name }}</span>
              <span
                v-if="previewFor(category).length > 0"
                class="eq-row__price"
              >
                +{{
                  formatPrice(
                    previewFor(category).reduce(
                      (s, i) => s + (i.price ?? 0),
                      0,
                    ),
                  )
                }}
              </span>
              <span v-else class="eq-row__count">
                {{ totalOptions(category) }} option{{
                  totalOptions(category) === 1 ? "" : "s"
                }}
              </span>
            </div>
            <p
              v-if="previewFor(category).length > 0"
              class="eq-row__chosen"
            >
              {{
                previewFor(category)
                  .map((i) => i.attributes?.Option || i.name)
                  .join(", ")
              }}
            </p>
            <p
              v-else-if="category.description"
              class="eq-row__description"
              v-html="category.description"
            />
          </div>
        </div>
      </button>

      <button
        v-if="previewFor(category).length > 0"
        type="button"
        class="eq-row__edit"
        :title="`Change ${category.name.toLowerCase()}`"
        @click="onCategoryEdit(category, $event)"
      >
        <Pencil />
      </button>
      <div v-else class="eq-row__chevron">
        <ChevronRight />
      </div>
    </div>

    <EquipmentModal
      v-model:open="modalOpen"
      :category="modalCategory"
      :selected-ids="modalSelectedIds"
      @add="handleAdd"
      @replace="handleReplace"
      @remove="handleRemove"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/colors' as colors;
@use '@/styles/media-breakpoints' as breakpoints;

.step-equipment {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__hint {
    color: colors.$gray;
    font-size: 12.5px;
    line-height: 1.5;
  }
}

.eq-row {
  display: flex;
  align-items: stretch;
  width: 100%;
  border: 1px solid colors.$gray-300;
  background: colors.$white;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &_active {
    border-color: colors.$orange-medium;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.08);
  }

  @media (hover: hover) {
    &:not(.eq-row_active):hover {
      border-color: colors.$gray-light;
    }
  }

  &__main {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: stretch;
    text-align: left;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
  }

  &__icon-cell {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    padding: 8px;
    border-right: 1px solid colors.$gray-300;
    background: colors.$gray-5;

    @include breakpoints.media-breakpoint-up(xs) {
      width: 80px;
    }
  }

  &__icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
  }

  &__check {
    flex-shrink: 0;
    margin-top: 2px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid colors.$gray-light;
    background: colors.$white;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: colors.$white;
    transition: border-color 0.2s ease, background 0.2s ease;

    svg {
      width: 12px;
      height: 12px;
    }

    &_on {
      border-color: colors.$orange-medium;
      background: colors.$orange-medium;
    }
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }

  &__name {
    color: colors.$black;
    font-size: 14px;
    font-weight: 600;
  }

  .eq-row_active &__name {
    color: colors.$orange-medium;
  }

  &__price {
    flex-shrink: 0;
    color: colors.$gray;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
  }

  &__count {
    flex-shrink: 0;
    color: colors.$gray;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &__chosen {
    margin-top: 2px;
    color: colors.$gray-900;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__description {
    margin-top: 2px;
    color: colors.$gray-900;
    font-size: 13px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__edit,
  &__chevron {
    flex-shrink: 0;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-left: 1px solid colors.$gray-300;
    background: colors.$white;
    color: colors.$gray;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &__edit {
    @media (hover: hover) {
      &:hover {
        background: colors.$gray-10;
        color: colors.$black;
      }
    }
  }

  &__chevron {
    cursor: default;
  }
}
</style>
