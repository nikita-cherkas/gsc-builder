import * as THREE from "three";
import type CoffeeApplication from "./CoffeeApplication";

export type AnchorLike =
  | THREE.Object3D
  | THREE.Vector3
  | { x: number; y: number; z: number };

export interface EquipmentTransform {
  scale?: number;
  x?: number;
  y?: number;
  z?: number;
}

export interface PlacedEquipment {
  readonly id: string;
  readonly object: THREE.Group;
  readonly model: THREE.Object3D;
  readonly anchorParent: THREE.Object3D | null;
  readonly anchorBase: THREE.Vector3;
  transform: Required<EquipmentTransform>;
  update(next: EquipmentTransform): void;
  remove(): void;
}

function disposeObject3D(obj: THREE.Object3D): void {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      const material = child.material;
      if (Array.isArray(material)) material.forEach((m) => m?.dispose());
      else material?.dispose();
    }
  });
}

export default class EquipmentManager {
  private readonly app: CoffeeApplication;
  private readonly items = new Map<string, PlacedEquipment>();
  private idCounter = 0;

  constructor(app: CoffeeApplication) {
    this.app = app;
  }

  get list(): PlacedEquipment[] {
    return Array.from(this.items.values());
  }

  has(id: string): boolean {
    return this.items.has(id);
  }

  get(id: string): PlacedEquipment | undefined {
    return this.items.get(id);
  }

  static findAnchor(root: THREE.Object3D, name: string): THREE.Object3D | null {
    return root.getObjectByName(name) ?? null;
  }

  add(
    anchor: AnchorLike,
    model: THREE.Object3D,
    transform: EquipmentTransform = {},
  ): PlacedEquipment {
    const id = `eq-${++this.idCounter}`;

    model.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    const wrapper = new THREE.Group();
    wrapper.name = id;
    wrapper.add(model);

    const resolved: Required<EquipmentTransform> = {
      scale: transform.scale ?? 1,
      x: transform.x ?? 0,
      y: transform.y ?? 0,
      z: transform.z ?? 0,
    };

    let anchorParent: THREE.Object3D | null = null;
    const anchorBase = new THREE.Vector3(0, 0, 0);

    if (anchor instanceof THREE.Object3D) {
      anchorParent = anchor;
      anchor.add(wrapper);
    } else if (anchor instanceof THREE.Vector3) {
      anchorBase.copy(anchor);
      this.app.scene.add(wrapper);
    } else {
      anchorBase.set(anchor.x, anchor.y, anchor.z);
      this.app.scene.add(wrapper);
    }

    wrapper.scale.setScalar(resolved.scale);
    wrapper.position.set(
      anchorBase.x + resolved.x,
      anchorBase.y + resolved.y,
      anchorBase.z + resolved.z,
    );

    const item: PlacedEquipment = {
      id,
      object: wrapper,
      model,
      anchorParent,
      anchorBase,
      transform: resolved,
      update: (next) => this.update(id, next),
      remove: () => this.remove(id),
    };
    this.items.set(id, item);
    return item;
  }

  async addFromUrl(
    anchor: AnchorLike,
    url: string,
    transform: EquipmentTransform = {},
  ): Promise<PlacedEquipment | null> {
    const gltf = await this.app.modelLoader.loadModel(url);
    if (!gltf?.scene) return null;
    return this.add(anchor, gltf.scene as THREE.Object3D, transform);
  }

  async addByAnchorName(
    root: THREE.Object3D,
    anchorName: string,
    source: string | THREE.Object3D,
    transform: EquipmentTransform = {},
  ): Promise<PlacedEquipment | null> {
    const anchor = EquipmentManager.findAnchor(root, anchorName);
    if (!anchor) {
      console.warn(`[EquipmentManager] anchor "${anchorName}" not found`);
      return null;
    }
    if (typeof source === "string")
      return this.addFromUrl(anchor, source, transform);
    return this.add(anchor, source, transform);
  }

  update(id: string, next: EquipmentTransform): PlacedEquipment | null {
    const item = this.items.get(id);
    if (!item) return null;

    if (next.scale !== undefined) {
      item.transform.scale = next.scale;
      item.object.scale.setScalar(next.scale);
    }
    if (next.x !== undefined) {
      item.transform.x = next.x;
      item.object.position.x = item.anchorBase.x + next.x;
    }
    if (next.y !== undefined) {
      item.transform.y = next.y;
      item.object.position.y = item.anchorBase.y + next.y;
    }
    if (next.z !== undefined) {
      item.transform.z = next.z;
      item.object.position.z = item.anchorBase.z + next.z;
    }
    return item;
  }

  remove(id: string): boolean {
    const item = this.items.get(id);
    if (!item) return false;
    item.object.parent?.remove(item.object);
    disposeObject3D(item.object);
    this.items.delete(id);
    return true;
  }

  async replace(
    id: string,
    source: string | THREE.Object3D,
    transform?: EquipmentTransform,
  ): Promise<PlacedEquipment | null> {
    const old = this.items.get(id);
    if (!old) return null;

    const anchor: AnchorLike = old.anchorParent ?? old.anchorBase;
    const nextTransform: EquipmentTransform = transform ?? { ...old.transform };

    this.remove(id);

    if (typeof source === "string") {
      return this.addFromUrl(anchor, source, nextTransform);
    }
    return this.add(anchor, source, nextTransform);
  }

  clear(): void {
    for (const id of Array.from(this.items.keys())) {
      this.remove(id);
    }
  }
}
