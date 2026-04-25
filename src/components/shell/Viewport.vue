<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import * as THREE from "three";
import { useConfiguratorStore } from "@/stores/configurator";
import { useSceneBuilderStore } from "@/stores/sceneBuilder";

const store = useConfiguratorStore();
const sceneBuilder = useSceneBuilderStore();
const containerRef = ref<HTMLDivElement | null>(null);
const isLoading = ref(true);

async function loadCartModel(): Promise<THREE.Object3D | null> {
  const gltf = await sceneBuilder.loadModel("/threejs/models/Summit.glb");
  if (!gltf?.scene) return null;

  const cart = gltf.scene as THREE.Object3D;
  cart.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });
  return cart;
}

function registerWoodMaterials(cart: THREE.Object3D): void {
  const wanted = new Set(["light_wood", "dark_wood"]);
  const found = new Map<string, THREE.Material>();

  cart.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh) || !obj.material) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const m of mats) {
      if (m?.name && wanted.has(m.name) && !found.has(m.name)) {
        found.set(m.name, m);
      }
    }
  });

  for (const [name, mat] of found) sceneBuilder.registerMaterial(name, mat);
}

function buildSoftShadow(radius = 2.2, opacity = 0.35): THREE.Mesh {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, `rgba(0, 0, 0, ${opacity})`);
  gradient.addColorStop(0.55, `rgba(0, 0, 0, ${opacity * 0.35})`);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(radius * 2, radius * 2),
    material,
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.001;
  mesh.renderOrder = -1;
  return mesh;
}

onMounted(async () => {
  if (!containerRef.value) return;

  sceneBuilder.setEngine({
    container: containerRef.value,
    isPreview: false,
  });

  const [cart] = await Promise.all([
    loadCartModel(),
    sceneBuilder.engine?.floorReady,
  ]);

  if (cart) {
    sceneBuilder.addToScene(cart);
    sceneBuilder.fitCameraToObject(cart, 2);

    const bbox = new THREE.Box3().setFromObject(cart);
    const size = bbox.getSize(new THREE.Vector3());
    const center = bbox.getCenter(new THREE.Vector3());
    const shadowRadius = Math.max(size.x, size.z) * 0.7;
    const shadow = buildSoftShadow(shadowRadius);
    shadow.position.set(center.x, bbox.min.y + 0.001, center.z);
    sceneBuilder.addToScene(shadow);

    const controls = sceneBuilder.engine?.camera.controls;
    if (controls) {
      controls.maxDistance = controls.minDistance * 4;
      controls.update();
    }

    registerWoodMaterials(cart);
    sceneBuilder.setTableWoodVariant(sceneBuilder.tableWoodVariant);
    sceneBuilder.setCartRoot(cart);
  }

  sceneBuilder.setAutoRotate(store.autoRotate);
  isLoading.value = false;
});

onBeforeUnmount(() => {
  sceneBuilder.disposeEngine();
});

watch(
  () => store.autoRotate,
  (v) => sceneBuilder.setAutoRotate(v),
);

watch(
  () => store.viewportResetTick,
  () => sceneBuilder.resetCamera(),
);
</script>

<template>
  <div class="viewport">
    <div ref="containerRef" id="builder" class="viewport__canvas" />

    <Transition name="viewport-loader">
      <div v-if="isLoading" class="viewport__loader">
        <div class="viewport__spinner" />
        <span class="viewport__loader-text">Loading scene…</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/colors" as colors;

.viewport {
  position: relative;
  height: 100%;
  width: 100%;
  touch-action: none;
  user-select: none;
}

.viewport__canvas {
  position: absolute;
  inset: 0;
  cursor: grab;
}

.viewport__loader {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: colors.$canvas;
  pointer-events: auto;
}

.viewport__spinner {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 3px solid rgba(0, 0, 0, 0.08);
  border-top-color: colors.$orange-medium;
  animation: viewport-spin 0.9s linear infinite;
}

.viewport__loader-text {
  color: colors.$gray;
  font-size: 13px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-weight: 600;
}

@keyframes viewport-spin {
  to {
    transform: rotate(360deg);
  }
}

.viewport-loader-leave-active {
  transition: opacity 0.3s ease;
}

.viewport-loader-leave-to {
  opacity: 0;
}
</style>
