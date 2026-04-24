import { defineStore } from "pinia";
import { shallowRef, markRaw, ref } from "vue";
import type { Material, Object3D } from "three";

export type TableWoodVariant = "light" | "dark";

const TABLE_MESH_NAME = "table";
const WOOD_MATERIAL_BY_VARIANT: Record<TableWoodVariant, string> = {
  light: "light_wood",
  dark: "dark_wood",
};
import {
  CoffeeApplication,
  type CoffeeApplicationOptions,
  type EquipmentTransform,
  type PlacedEquipment,
  type MeshTarget,
  type HexColor,
} from "@/modules/threejs/classes";

export const useSceneBuilderStore = defineStore("sceneBuilder", () => {
  const engine = shallowRef<CoffeeApplication | null>(null);

  function setEngine(options: CoffeeApplicationOptions): CoffeeApplication {
    disposeEngine();
    const instance = markRaw(new CoffeeApplication(options));
    engine.value = instance;
    return instance;
  }

  function disposeEngine(): void {
    engine.value?.dispose();
    engine.value = null;
  }

  function setAutoRotate(enabled: boolean): void {
    engine.value?.setAutoRotate(enabled);
  }

  function resetCamera(): void {
    engine.value?.resetCamera();
  }

  function addToScene(object: Object3D): void {
    engine.value?.scene.add(object);
  }

  function removeFromScene(object: Object3D): void {
    engine.value?.scene.remove(object);
  }

  function fitCameraToObject(object: Object3D, padding?: number): void {
    engine.value?.fitCameraToObject(object, padding);
  }

  async function loadModel(url: string) {
    if (!engine.value) return null;
    return engine.value.modelLoader.loadModel(url);
  }

  async function placeEquipmentByAnchorName(
    root: Object3D,
    anchorName: string,
    source: string | Object3D,
    transform?: EquipmentTransform,
  ): Promise<PlacedEquipment | null> {
    if (!engine.value) return null;
    return engine.value.equipment.addByAnchorName(
      root,
      anchorName,
      source,
      transform,
    );
  }

  function updateEquipment(
    id: string,
    transform: EquipmentTransform,
  ): PlacedEquipment | null {
    if (!engine.value) return null;
    return engine.value.equipment.update(id, transform);
  }

  async function replaceEquipment(
    id: string,
    source: string | Object3D,
    transform?: EquipmentTransform,
  ): Promise<PlacedEquipment | null> {
    if (!engine.value) return null;
    return engine.value.equipment.replace(id, source, transform);
  }

  function removeEquipment(id: string): boolean {
    if (!engine.value) return false;
    return engine.value.equipment.remove(id);
  }

  function clearEquipment(): void {
    engine.value?.equipment.clear();
  }

  function getEquipment(id: string): PlacedEquipment | undefined {
    return engine.value?.equipment.get(id);
  }

  function registerMaterial(name: string, material: Material): void {
    engine.value?.materials.register(name, material);
  }

  function unregisterMaterial(name: string): void {
    engine.value?.materials.unregister(name);
  }

  function getMaterial(name: string): Material | undefined {
    return engine.value?.materials.getMaterial(name);
  }

  function setMeshColor(target: MeshTarget, hex: HexColor): void {
    engine.value?.materials.setColor(target, hex);
  }

  function applyMeshMaterial(
    target: MeshTarget,
    materialOrName: string | Material,
  ): boolean {
    return engine.value?.materials.applyMaterial(target, materialOrName) ?? false;
  }

  const tableWoodVariant = ref<TableWoodVariant>("light");

  function setTableWoodVariant(variant: TableWoodVariant): boolean {
    const matName = WOOD_MATERIAL_BY_VARIANT[variant];
    const ok = applyMeshMaterial(TABLE_MESH_NAME, matName);
    if (ok) tableWoodVariant.value = variant;
    return ok;
  }

  const cartRoot = shallowRef<Object3D | null>(null);
  const placementByAnchor = new Map<string, string>();

  function setCartRoot(root: Object3D | null): void {
    cartRoot.value = root ? markRaw(root) : null;
  }

  async function placeAtAnchor(
    anchorName: string,
    modelUrl: string,
    transform?: EquipmentTransform,
  ): Promise<PlacedEquipment | null> {
    if (!engine.value || !cartRoot.value) return null;

    const existingId = placementByAnchor.get(anchorName);
    if (existingId && engine.value.equipment.has(existingId)) {
      const next = await engine.value.equipment.replace(
        existingId,
        modelUrl,
        transform,
      );
      if (next) placementByAnchor.set(anchorName, next.id);
      else placementByAnchor.delete(anchorName);
      return next;
    }

    const item = await engine.value.equipment.addByAnchorName(
      cartRoot.value,
      anchorName,
      modelUrl,
      transform,
    );
    if (item) placementByAnchor.set(anchorName, item.id);
    return item;
  }

  function clearAnchor(anchorName: string): boolean {
    const id = placementByAnchor.get(anchorName);
    if (!id) return false;
    const ok = engine.value?.equipment.remove(id) ?? false;
    placementByAnchor.delete(anchorName);
    return ok;
  }

  function updateAtAnchor(
    anchorName: string,
    transform: EquipmentTransform,
  ): PlacedEquipment | null {
    const id = placementByAnchor.get(anchorName);
    if (!id) return null;
    return engine.value?.equipment.update(id, transform) ?? null;
  }

  function getEquipmentAtAnchor(anchorName: string): PlacedEquipment | undefined {
    const id = placementByAnchor.get(anchorName);
    return id ? engine.value?.equipment.get(id) : undefined;
  }

  return {
    engine,
    setEngine,
    disposeEngine,

    setAutoRotate,
    resetCamera,
    addToScene,
    removeFromScene,
    fitCameraToObject,
    loadModel,

    placeEquipmentByAnchorName,
    updateEquipment,
    replaceEquipment,
    removeEquipment,
    clearEquipment,
    getEquipment,

    registerMaterial,
    unregisterMaterial,
    getMaterial,
    setMeshColor,
    applyMeshMaterial,

    tableWoodVariant,
    setTableWoodVariant,

    cartRoot,
    setCartRoot,
    placeAtAnchor,
    clearAnchor,
    updateAtAnchor,
    getEquipmentAtAnchor,
  };
});
