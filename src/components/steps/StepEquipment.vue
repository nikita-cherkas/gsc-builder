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
import { cn } from "@/lib/utils";
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
  <div class="space-y-3">
    <p class="text-[12.5px] text-muted-foreground leading-snug">
      Tap a category to browse models, filter by brand, and pick your equipment.
    </p>

    <div
      v-for="category in categories"
      :key="category.name"
      :class="
        cn(
          'flex items-stretch overflow-hidden rounded-lg border bg-card transition w-full',
          previewFor(category).length > 0
            ? 'border-primary'
            : 'border-border hover:border-foreground/30',
        )
      "
    >
      <button
        type="button"
        class="flex items-stretch flex-1 min-w-0 text-left"
        :title="
          previewFor(category).length > 0
            ? 'Click to remove selection'
            : 'Click to browse models'
        "
        @click="onCategoryClick(category)"
      >
        <div
          :class="
            cn(
              'flex w-16 sm:w-20 shrink-0 items-center justify-center border-r border-border/60 p-2',
              previewFor(category).length > 0
                ? 'text-primary'
                : 'text-muted-foreground',
            )
          "
        >
          <img
            v-if="category.icon"
            :src="category.icon"
            :alt="category.name"
            class="h-10 w-10 object-contain"
            loading="lazy"
            onerror="this.style.display = 'none'"
          />
        </div>

        <div class="min-w-0 flex-1 p-3">
          <div class="flex items-start gap-3">
            <span
              :class="
                cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition',
                  previewFor(category).length > 0
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/40',
                )
              "
            >
              <Check v-if="previewFor(category).length > 0" class="h-3 w-3" />
            </span>

            <div class="min-w-0 flex-1">
              <div class="flex items-baseline justify-between gap-2">
                <span class="font-medium">{{ category.name }}</span>
                <span
                  v-if="previewFor(category).length > 0"
                  class="shrink-0 text-sm tabular-nums"
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
                <span
                  v-else
                  class="shrink-0 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold"
                >
                  {{ totalOptions(category) }} option{{
                    totalOptions(category) === 1 ? "" : "s"
                  }}
                </span>
              </div>
              <p
                v-if="previewFor(category).length > 0"
                class="mt-0.5 text-sm text-muted-foreground truncate"
              >
                {{
                  previewFor(category)
                    .map((i) => i.attributes?.Option || i.name)
                    .join(", ")
                }}
              </p>
              <p
                v-else-if="category.description"
                class="mt-0.5 text-sm text-muted-foreground line-clamp-2"
                v-html="category.description"
              />
            </div>
          </div>
        </div>
      </button>

      <button
        v-if="previewFor(category).length > 0"
        type="button"
        class="flex w-10 shrink-0 items-center justify-center border-l border-border text-muted-foreground hover:bg-muted hover:text-foreground transition"
        :title="`Change ${category.name.toLowerCase()}`"
        @click="onCategoryEdit(category, $event)"
      >
        <Pencil class="h-4 w-4" />
      </button>
      <div
        v-else
        class="flex w-10 shrink-0 items-center justify-center border-l border-border text-muted-foreground"
      >
        <ChevronRight class="h-4 w-4" />
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
