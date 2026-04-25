import * as THREE from "three";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { CACHE_POLICY, withTtl } from "./cachePolicy";

THREE.Cache.enabled = true;

const hdrCache = new Map();

const ensureHdrCacheLimit = () => {
  while (hdrCache.size > CACHE_POLICY.hdr.maxEntries) {
    const oldestKey = hdrCache.keys().next().value;
    if (!oldestKey) break;
    const stale = hdrCache.get(oldestKey);
    stale?.texture?.dispose?.();
    hdrCache.delete(oldestKey);
  }
};

export default class Renderer {
  constructor(application) {
    this.application = application;
    this.canvas = application.canvas;
    this.sizes = application.sizes;
    this.scene = application.scene;
    this.camera = application.camera;
    this.raycaster = application.raycaster;
    this.gui = application.gui;
    this.fps = 50;
    this.interval = 1000 / this.fps;
    this.then = Date.now();
    this.lastPreviewRenderAt = 0;

    this.setRenderer();
  }
  ё;
  setRenderer() {
    this.instance = new THREE.WebGLRenderer({
      alpha: true,
      canvas: this.canvas,
      antialias: !this.application.isPreview,
      powerPreference: "high-performance",
      preserveDrawingBuffer: !this.application.isPreview,
    });
    this.instance.shadowMap.enabled = !this.application.isPreview;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.shadowMap.needsUpdate = true;
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1;
    this.instance.autoClear = true;
    this.instance.setClearColor(0x000000, 0);
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    const BACKGROUND_COLOR = 0xf5f1ea;
    this.scene.background = new THREE.Color(BACKGROUND_COLOR);
    this.scene.fog = new THREE.Fog(BACKGROUND_COLOR, 15, 40);
    this.scene.background.colorSpace = THREE.SRGBColorSpace;
    this.loadEnv(
      `${import.meta.env.BASE_URL || "/"}threejs/textures/env-map-6.hdr`,
    );

    this.cssInstance = new CSS3DRenderer();
    this.cssInstance.setSize(this.sizes.width, this.sizes.height);

    this.cssInstance.domElement.style.position = "absolute";
    this.cssInstance.domElement.style.top = "0px";
    this.cssInstance.domElement.style.left = "0px";
    this.cssInstance.domElement.style.width = "100%";
    this.cssInstance.domElement.style.height = "100%";
    this.cssInstance.domElement.style.pointerEvents = "none";
    this.cssInstance.domElement.style.zIndex = "1";

    const container = this.application.container || this.canvas.parentElement;
    if (container) {
      container.style.position = "absolute";
      container.appendChild(this.cssInstance.domElement);
    }
  }

  loadEnv(file) {
    const cached = hdrCache.get(file);
    if (cached && cached.expiresAt > Date.now()) {
      this.scene.environment = cached.texture;
      return Promise.resolve(cached.texture);
    }

    if (cached) {
      cached.texture?.dispose?.();
      hdrCache.delete(file);
    }

    const loader = new HDRLoader();
    loader.setDataType(THREE.HalfFloatType);

    return new Promise((resolve, reject) => {
      loader.load(
        file,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          texture.userData.__hdrCacheKey = file;
          hdrCache.set(file, {
            texture,
            expiresAt: withTtl(CACHE_POLICY.hdr.ttlMs),
          });
          ensureHdrCacheLimit();
          this.scene.environment = texture;
          resolve(texture);
        },
        undefined,
        (error) => reject(error),
      );
    });
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height, false);
    this.cssInstance.setSize(this.sizes.width, this.sizes.height);

    const pr = this.application.isPreview
      ? 1
      : window.innerWidth < 1024
        ? 1.5
        : 1.2;
    this.instance.setPixelRatio(pr);
  }

  update() {
    if (this.application.isPreview) {
      const now = Date.now();
      if (now - this.lastPreviewRenderAt < 1000 / 24) return;
      this.lastPreviewRenderAt = now;
    }

    this.instance.render(this.scene, this.camera.instance);
    this.cssInstance.render(this.scene, this.camera.instance);
  }
}
