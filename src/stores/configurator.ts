import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type {
  BaseColor,
  BaseQuality,
  CartConfig,
  CartType,
  CustomerInfo,
  CutoutOption,
  EquipmentGroupsResponse,
  StepId,
  TopColor,
  TopMaterial,
} from "@/types";
import { DEFAULT_CONFIG } from "@/data/defaults";
import { getSteps } from "@/lib/steps";
import { calculateTotal, priceBreakdown } from "@/lib/pricing";
import { validateCustomer } from "@/lib/validation";
import { EQUIPMENT_GROUPS } from "@/data/equipment";

interface SubmittedSnapshot {
  name: string;
  total: number;
}

export const useConfiguratorStore = defineStore("configurator", () => {
  const config = ref<CartConfig>(structuredClone(DEFAULT_CONFIG));
  const currentStepId = ref<StepId>("cart-type");
  const autoRotate = ref(true);
  const contactOpen = ref(false);
  const successOpen = ref(false);
  const attemptedSubmit = ref(false);
  const submittedSnapshot = ref<SubmittedSnapshot | null>(null);
  const equipmentData = ref<EquipmentGroupsResponse>(EQUIPMENT_GROUPS);
  const viewportResetTick = ref(0);

  const steps = computed(() => getSteps(config.value));

  const effectiveStepId = computed<StepId>(() => {
    const list = steps.value;
    return list.some((s) => s.id === currentStepId.value)
      ? currentStepId.value
      : list[0].id;
  });

  const stepIndex = computed(() => {
    const idx = steps.value.findIndex((s) => s.id === effectiveStepId.value);
    return idx >= 0 ? idx : 0;
  });

  const currentStep = computed(() => steps.value[stepIndex.value]);
  const isFirst = computed(() => stepIndex.value === 0);
  const isLast = computed(() => stepIndex.value === steps.value.length - 1);
  const total = computed(() => calculateTotal(config.value, equipmentData.value));
  const priceLines = computed(() =>
    priceBreakdown(config.value, equipmentData.value),
  );
  const customerValid = computed(
    () => validateCustomer(config.value.customer).valid,
  );
  const canProceed = computed(() =>
    effectiveStepId.value === "customer" ? customerValid.value : true,
  );

  const nextLabel = computed(() => {
    switch (effectiveStepId.value) {
      case "summary":
        return "Looks good →";
      case "customer":
        return "Send quote →";
      default:
        return "Continue →";
    }
  });

  function setEquipmentData(data: EquipmentGroupsResponse | null | undefined) {
    equipmentData.value = data ?? EQUIPMENT_GROUPS;
  }

  function submit() {
    attemptedSubmit.value = true;
    if (!customerValid.value) return;
    submittedSnapshot.value = {
      name: config.value.customer.name,
      total: total.value,
    };
    successOpen.value = true;
  }

  function next() {
    if (isLast.value) {
      submit();
      return;
    }
    const list = steps.value;
    const idx = list.findIndex((s) => s.id === effectiveStepId.value);
    currentStepId.value = list[Math.min(idx + 1, list.length - 1)].id;
  }

  function back() {
    const list = steps.value;
    const idx = list.findIndex((s) => s.id === effectiveStepId.value);
    currentStepId.value = list[Math.max(idx - 1, 0)].id;
  }

  function goTo(id: StepId) {
    if (steps.value.some((s) => s.id === id)) {
      currentStepId.value = id;
    }
  }

  function reset() {
    config.value = structuredClone(DEFAULT_CONFIG);
    currentStepId.value = "cart-type";
    attemptedSubmit.value = false;
    submittedSnapshot.value = null;
  }

  function setCartType(id: CartType) {
    config.value.cartType = id;
  }

  function setBaseQuality(id: BaseQuality) {
    config.value.baseQuality = id;
    if (id === "standard") {
      config.value.baseColor = "natural";
    }
  }

  function setBaseColor(id: BaseColor) {
    config.value.baseColor = id;
  }

  function setCutout(id: CutoutOption) {
    config.value.cutout = id;
  }

  function setTopMaterial(id: TopMaterial) {
    config.value.topMaterial = id;
  }

  function setTopColor(id: TopColor) {
    config.value.topColor = id;
  }

  function setFoldableFlaps(v: boolean) {
    config.value.foldableFlaps = v;
  }

  function setShelfInsert(v: boolean) {
    config.value.shelfInsert = v;
  }

  function setExtraShelves(n: number) {
    config.value.extraShelves = Math.max(0, Math.min(3, Math.floor(n)));
  }

  function addEquipment(id: number) {
    if (!config.value.equipment.includes(id)) {
      config.value.equipment.push(id);
    }
  }

  function removeEquipment(id: number) {
    config.value.equipment = config.value.equipment.filter((x) => x !== id);
  }

  function toggleEquipment(id: number) {
    if (config.value.equipment.includes(id)) {
      removeEquipment(id);
    } else {
      addEquipment(id);
    }
  }

  function replaceEquipmentInGroup(oldIds: number[], newId: number) {
    const kept = config.value.equipment.filter((x) => !oldIds.includes(x));
    if (!kept.includes(newId)) kept.push(newId);
    config.value.equipment = kept;
  }

  function setEquipment(ids: number[]) {
    config.value.equipment = ids;
  }

  function updateCustomer(patch: Partial<CustomerInfo>) {
    config.value.customer = { ...config.value.customer, ...patch };
  }

  function toggleAutoRotate() {
    autoRotate.value = !autoRotate.value;
  }

  function openContact() {
    contactOpen.value = true;
  }

  function closeContact() {
    contactOpen.value = false;
  }

  function resetViewport() {
    viewportResetTick.value += 1;
  }

  return {
    config,
    currentStepId,
    autoRotate,
    contactOpen,
    successOpen,
    viewportResetTick,
    attemptedSubmit,
    submittedSnapshot,

    steps,
    effectiveStepId,
    stepIndex,
    currentStep,
    isFirst,
    isLast,
    total,
    priceLines,
    customerValid,
    canProceed,
    nextLabel,
    equipmentData,

    submit,
    next,
    back,
    goTo,
    reset,
    setCartType,
    setBaseQuality,
    setBaseColor,
    setCutout,
    setTopMaterial,
    setTopColor,
    setFoldableFlaps,
    setShelfInsert,
    setExtraShelves,
    addEquipment,
    removeEquipment,
    toggleEquipment,
    replaceEquipmentInGroup,
    setEquipment,
    updateCustomer,
    toggleAutoRotate,
    openContact,
    closeContact,
    setEquipmentData,
    resetViewport,
  };
});
