<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/formatters";
import { getCategoryItems } from "@/lib/equipment";
import {
  Image as ImageIcon,
  Box,
  List,
  Info,
  Check,
  X,
  Search,
  ArrowDownUp,
} from "lucide-vue-next";
import type { EquipmentGroupData, EquipmentItem } from "@/types";
import GalleryBlock from "./GalleryBlock.vue";
import InfoBlock from "./InfoBlock.vue";
import Equipment3DViewer from "./Equipment3DViewer.vue";

interface Props {
  open: boolean;
  category: EquipmentGroupData | null;
  selectedIds?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  selectedIds: () => [],
});

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "add", item: EquipmentItem): void;
  (e: "replace", payload: { oldIds: number[]; newId: number }): void;
  (e: "remove", id: number): void;
}>();

type TabKey = "photos" | "3d" | "specs" | "info";
type SortKey = "popular" | "price-asc" | "price-desc";

const activeTab = ref<TabKey>("photos");
const selectedEquipment = ref<EquipmentItem | null>(null);
const search = ref("");
const brandFilter = ref<string | null>(null);
const sort = ref<SortKey>("popular");

const allItems = computed(() =>
  props.category ? getCategoryItems(props.category) : [],
);

const currentModelUrl = computed(
  () => selectedEquipment.value?.model_full?.url ?? "",
);

const equipmentAttributes = computed(() => {
  if (!selectedEquipment.value) return [];
  const attrs = selectedEquipment.value.attributes || {};
  const rows = Object.entries(attrs)
    .filter(([k]) => k.toLowerCase() !== "brand")
    .map(([label, value]) => ({ label, value: String(value) }));

  const dimensionLabels: Record<string, string> = {
    height: "Height",
    length: "Length",
    weight: "Weight",
    width: "Width",
  };
  for (const [k, label] of Object.entries(dimensionLabels)) {
    const v =
      selectedEquipment.value.dimensions?.[
        k as keyof typeof selectedEquipment.value.dimensions
      ];
    if (v !== undefined && v !== null) {
      rows.push({ label, value: k === "weight" ? `${v} lbs` : `${v}”` });
    }
  }
  return rows;
});

const brands = computed(() => {
  const map = new Map<string, number>();
  for (const item of allItems.value) {
    const b = item.attributes?.Brand ?? item.brands ?? "";
    if (!b) continue;
    map.set(b, (map.get(b) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
});

const filteredItems = computed(() => {
  const q = search.value.trim().toLowerCase();
  let out = allItems.value.filter((item) => {
    const brand = item.attributes?.Brand ?? item.brands ?? "";
    if (brandFilter.value && brand !== brandFilter.value) return false;
    if (!q) return true;
    const hay =
      `${brand} ${item.name} ${item.sku} ${item.description}`.toLowerCase();
    return hay.includes(q);
  });
  switch (sort.value) {
    case "price-asc":
      out = [...out].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      break;
    case "price-desc":
      out = [...out].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      break;
    default:
      out = [...out].sort(
        (a, b) =>
          Number(props.selectedIds.includes(b.id)) -
          Number(props.selectedIds.includes(a.id)),
      );
  }
  return out;
});

watch(
  () =>
    [props.open, props.category?.name, props.selectedIds.join(",")] as const,
  ([isOpen]) => {
    if (!isOpen || !props.category) return;
    const all = allItems.value;
    const pickedId = props.selectedIds.find((id) =>
      all.some((i) => i.id === id),
    );
    selectedEquipment.value =
      (pickedId ? all.find((i) => i.id === pickedId) : undefined) ??
      all[0] ??
      null;
    activeTab.value = "photos";
    search.value = "";
    brandFilter.value = null;
    sort.value = "popular";
  },
  { immediate: true },
);

const tabs: { key: TabKey; label: string; icon: typeof ImageIcon }[] = [
  { key: "photos", label: "Photos", icon: ImageIcon },
  { key: "3d", label: "3D View", icon: Box },
  { key: "specs", label: "Specs", icon: List },
  { key: "info", label: "Info", icon: Info },
];

const visibleTabs = computed(() =>
  tabs.filter((t) => {
    if (t.key === "specs") return equipmentAttributes.value.length > 0;
    if (t.key === "3d") return !!currentModelUrl.value;
    if (t.key === "info") return !!selectedEquipment.value?.description;
    return true;
  }),
);

const isMulti = computed(() => props.category?.selection === "multi");
const isInBuild = computed(
  () =>
    !!selectedEquipment.value &&
    props.selectedIds.includes(selectedEquipment.value.id),
);

const submitLabel = computed(() => {
  if (!selectedEquipment.value) return "Add";
  if (isMulti.value) return isInBuild.value ? "Remove" : "Add";
  return props.selectedIds.length > 0 ? "Change" : "Add";
});

const submitDisabled = computed(() => {
  if (isMulti.value) return false;
  return isInBuild.value;
});

const SORT_CYCLE: { k: SortKey; label: string }[] = [
  { k: "popular", label: "Popular" },
  { k: "price-asc", label: "Price ↑" },
  { k: "price-desc", label: "Price ↓" },
];

const currentSort = computed(
  () => SORT_CYCLE.find((s) => s.k === sort.value) ?? SORT_CYCLE[0],
);

function cycleSort() {
  const idx = SORT_CYCLE.findIndex((s) => s.k === sort.value);
  const next = SORT_CYCLE[(idx + 1) % SORT_CYCLE.length];
  sort.value = next.k;
}

function setTab(key: TabKey) {
  activeTab.value = key;
}

function closeModal() {
  emit("update:open", false);
}

function pickEquipment(item: EquipmentItem) {
  selectedEquipment.value = item;
}

function toggleEquipmentAction() {
  if (!selectedEquipment.value) return;
  const id = selectedEquipment.value.id;
  if (isMulti.value) {
    if (isInBuild.value) emit("remove", id);
    else emit("add", selectedEquipment.value);
    return;
  }
  emit("replace", { oldIds: [...props.selectedIds], newId: id });
  closeModal();
}
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent class="equipment-popup-override" hide-close>
      <DialogTitle class="sr-only">
        {{ props.category?.name ?? "Equipment" }}
      </DialogTitle>
      <DialogDescription class="sr-only">
        Pick equipment from the {{ props.category?.name ?? "" }} category.
      </DialogDescription>

      <div class="equipment-popup__wrapper">
        <template v-if="props.category && selectedEquipment">
          <div class="equipment-popup__mobile-header">
            <div class="header-text">
              <h2 class="header-title">{{ props.category.name }}</h2>
              <span class="header-subtitle">
                {{
                  selectedEquipment.categories[1]?.name ??
                  selectedEquipment.categories[0]?.name ??
                  ""
                }}
              </span>
            </div>
            <button
              type="button"
              class="equipment-popup__mobile-close"
              @click="closeModal"
            >
              <X />
            </button>
          </div>

          <div class="equipment-popup__body">
            <section class="equipment-popup__left">
              <nav class="equipment-popup__tabs-nav">
                <button
                  v-for="tab in visibleTabs"
                  :key="tab.key"
                  type="button"
                  :class="[
                    'equipment-popup__tab-btn',
                    { 'is-active': activeTab === tab.key },
                  ]"
                  @click="setTab(tab.key)"
                >
                  <span class="equipment-popup__tabs-wrapp">
                    <component :is="tab.icon" />
                  </span>
                  {{ tab.label }}
                </button>
              </nav>

              <div class="equipment-popup__content-area">
                <div
                  v-if="activeTab === 'photos' || activeTab === '3d'"
                  class="equipment-popup__tab-photos"
                >
                  <div class="equipment-popup__visual-area">
                    <div class="equipment-popup__visual-area-main">
                      <GalleryBlock
                        v-if="activeTab === 'photos'"
                        :selected-equipment="selectedEquipment"
                      />
                      <Equipment3DViewer
                        v-else-if="currentModelUrl"
                        :model-url="currentModelUrl"
                      />
                    </div>
                  </div>
                  <InfoBlock
                    :selected-equipment="selectedEquipment"
                    :attributes="equipmentAttributes"
                  />
                </div>

                <div v-else-if="activeTab === 'specs'" class="tab-specs">
                  <h3 class="tab-specs__title">Technical Specifications</h3>
                  <dl class="tab-specs__grid">
                    <div
                      v-for="(spec, idx) in equipmentAttributes"
                      :key="idx"
                      class="tab-specs__card"
                    >
                      <dt class="tab-specs__label">{{ spec.label }}</dt>
                      <dd class="tab-specs__value">{{ spec.value }}</dd>
                    </div>
                  </dl>
                </div>

                <article v-else-if="activeTab === 'info'" class="tab-info">
                  <div
                    class="tab-info__description"
                    v-html="selectedEquipment.description"
                  />
                </article>
              </div>
            </section>

            <aside class="equipment-popup__right">
              <div class="equipment-popup__list-header">
                <div class="header-top-row">
                  <h3 class="header-title">Size & Configuration</h3>
                  <button
                    type="button"
                    class="equipment-popup__close-btn-inline"
                    @click="closeModal"
                  >
                    <X />
                  </button>
                </div>
                <span class="header-count">
                  {{ filteredItems.length }} options available
                </span>
              </div>

              <div class="equipment-popup__controls">
                <div class="search-row">
                  <div class="search-wrap">
                    <Search />
                    <input
                      v-model="search"
                      type="search"
                      :placeholder="`Search ${props.category.name.toLowerCase()}…`"
                    />
                    <button
                      v-if="search"
                      type="button"
                      class="clear"
                      aria-label="Clear search"
                      @click="search = ''"
                    >
                      <X />
                    </button>
                  </div>

                  <button
                    type="button"
                    class="sort-cycle"
                    :title="`Sort: ${currentSort.label}`"
                    @click="cycleSort"
                  >
                    <ArrowDownUp />
                    {{ currentSort.label }}
                  </button>
                </div>

                <div v-if="brands.length > 1" class="brand-chips">
                  <button
                    type="button"
                    :class="['chip', { 'is-active': brandFilter === null }]"
                    @click="brandFilter = null"
                  >
                    All
                    <span class="count">{{ allItems.length }}</span>
                  </button>
                  <button
                    v-for="b in brands"
                    :key="b.name"
                    type="button"
                    :class="['chip', { 'is-active': brandFilter === b.name }]"
                    @click="brandFilter = b.name"
                  >
                    {{ b.name }}
                    <span class="count">{{ b.count }}</span>
                  </button>
                </div>
              </div>

              <ul class="equipment-popup__list">
                <li
                  v-if="filteredItems.length === 0"
                  class="equipment-popup__empty"
                >
                  No matches.
                  <button
                    type="button"
                    @click="
                      () => {
                        search = '';
                        brandFilter = null;
                      }
                    "
                  >
                    Clear filters
                  </button>
                </li>
                <li
                  v-for="item in filteredItems"
                  :key="item.id"
                  :class="[
                    'equipment-popup__item-wrapper',
                    { 'is-active': item.id === selectedEquipment.id },
                  ]"
                >
                  <button
                    type="button"
                    :class="[
                      'equipment-popup__item',
                      { 'is-active': item.id === selectedEquipment.id },
                    ]"
                    @click="pickEquipment(item)"
                  >
                    <div class="item-radio">
                      <div
                        v-if="item.id === selectedEquipment.id"
                        class="item-radio-inner"
                      >
                        <Check />
                      </div>
                    </div>
                    <div class="item-info">
                      <span class="item-name">
                        {{ item.attributes?.Option || item.name }}
                      </span>
                      <span
                        v-if="item.attributes?.Drawers"
                        class="item-subtext"
                      >
                        {{ item.attributes.Drawers }}
                      </span>
                      <span v-if="item.price != null" class="item-price">
                        {{ formatPrice(item.price) }}
                      </span>
                      <span
                        v-if="props.selectedIds.includes(item.id)"
                        class="item-in-build"
                      >
                        In build
                      </span>
                    </div>
                  </button>
                </li>
              </ul>
            </aside>
          </div>

          <footer class="equipment-popup__footer">
            <div class="footer-content">
              <div class="selection-summary">
                <span class="label">Selected:</span>
                <span class="value">
                  {{
                    selectedEquipment.attributes?.Option ||
                    selectedEquipment.name
                  }}
                </span>
                <span
                  v-if="selectedEquipment.attributes?.Drawers"
                  class="sub-value"
                >
                  ({{ selectedEquipment.attributes.Drawers }})
                </span>
              </div>
              <div class="footer-buttons">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="closeModal"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  :disabled="submitDisabled"
                  @click="toggleEquipmentAction"
                >
                  {{ submitLabel }}
                </button>
              </div>
            </div>
          </footer>
        </template>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style lang="scss">
@use "./EquipmentModal.scss";
</style>
