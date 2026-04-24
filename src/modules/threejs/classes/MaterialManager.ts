import * as THREE from "three";
import type CoffeeApplication from "./CoffeeApplication";

export type MeshTarget = THREE.Object3D | string;
export type HexColor = string | number;

interface MaterialWithColor extends THREE.Material {
  color: THREE.Color;
}

function hasColor(material: THREE.Material): material is MaterialWithColor {
  return (
    "color" in material &&
    (material as MaterialWithColor).color instanceof THREE.Color
  );
}

function toMaterialArray(
  material: THREE.Material | THREE.Material[],
): THREE.Material[] {
  return Array.isArray(material) ? material : [material];
}

export default class MaterialManager {
  private readonly app: CoffeeApplication;
  private readonly library = new Map<string, THREE.Material>();
  private readonly clonedMeshes = new WeakSet<THREE.Mesh>();

  constructor(app: CoffeeApplication) {
    this.app = app;
  }

  register(name: string, material: THREE.Material): void {
    this.library.set(name, material);
  }

  unregister(name: string): void {
    const mat = this.library.get(name);
    mat?.dispose();
    this.library.delete(name);
  }

  getMaterial(name: string): THREE.Material | undefined {
    return this.library.get(name);
  }

  listMaterials(): string[] {
    return Array.from(this.library.keys());
  }

  setColor(target: MeshTarget, hex: HexColor): void {
    const meshes = this.resolveMeshes(target);
    for (const mesh of meshes) {
      this.ensureOwnMaterial(mesh);
      for (const m of toMaterialArray(mesh.material)) {
        if (hasColor(m)) {
          m.color.set(hex as THREE.ColorRepresentation);
          m.needsUpdate = true;
        }
      }
    }
  }

  applyMaterial(
    target: MeshTarget,
    materialOrName: string | THREE.Material,
  ): boolean {
    const material =
      typeof materialOrName === "string"
        ? this.library.get(materialOrName)
        : materialOrName;

    if (!material) {
      console.warn(
        `[MaterialManager] material "${materialOrName}" not found in library`,
      );
      return false;
    }

    const meshes = this.resolveMeshes(target);
    if (meshes.length === 0) return false;

    for (const mesh of meshes) {
      mesh.material = material;
      this.clonedMeshes.delete(mesh);
    }
    return true;
  }

  private ensureOwnMaterial(mesh: THREE.Mesh): void {
    if (this.clonedMeshes.has(mesh)) return;

    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map((m) => m.clone());
    } else {
      mesh.material = mesh.material.clone();
    }
    this.clonedMeshes.add(mesh);
  }

  private resolveMeshes(target: MeshTarget): THREE.Mesh[] {
    const root =
      typeof target === "string"
        ? this.app.scene.getObjectByName(target)
        : target;

    if (!root) {
      console.warn(`[MaterialManager] target not found:`, target);
      return [];
    }

    const meshes: THREE.Mesh[] = [];
    if (root instanceof THREE.Mesh) meshes.push(root);
    root.traverse((child) => {
      if (child !== root && child instanceof THREE.Mesh) meshes.push(child);
    });
    return meshes;
  }

  clear(): void {
    for (const material of this.library.values()) material.dispose();
    this.library.clear();
  }
}
