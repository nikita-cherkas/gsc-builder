import * as THREE from "three";
import Camera from "../utils/Camera.js";
import Renderer from "../utils/Renderer.js";
import Sizes from "../utils/Sizes.js";
import Time from "../utils/Time.js";
import EventEmitter from "../utils/EventEmitter.js";
import ModelLoader from "../utils/gltf-loader.js";
import EquipmentManager from "./EquipmentManager";
import MaterialManager from "./MaterialManager";

export interface CoffeeApplicationOptions {
  container: HTMLElement;
  isPreview?: boolean;
}

export default class CoffeeApplication {
  readonly container: HTMLElement;
  readonly canvas: HTMLCanvasElement;
  readonly scene: THREE.Scene;
  readonly eventEmitter: EventEmitter;
  readonly sizes: Sizes;
  readonly time: Time;
  readonly camera: Camera;
  readonly renderer: Renderer;
  readonly modelLoader: ModelLoader;
  readonly equipment: EquipmentManager;
  readonly materials: MaterialManager;
  readonly isPreview: boolean;
  readonly gui: null = null;
  readonly raycaster: null = null;

  modelRoot: THREE.Object3D | null = null;

  private disposed = false;
  private readonly defaultCameraPosition = new THREE.Vector3();
  private readonly defaultCameraTarget = new THREE.Vector3();

  private targetToLookAt: THREE.Vector3 | null = null;
  private isAnimatingCamera = false;

  constructor(options: CoffeeApplicationOptions) {
    this.container = options.container;
    this.isPreview = options.isPreview ?? false;

    this.eventEmitter = new EventEmitter();
    this.scene = new THREE.Scene();

    this.canvas = document.createElement("canvas");
    this.canvas.style.display = "block";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.container.appendChild(this.canvas);

    this.sizes = new Sizes(this.container);
    this.sizes.setResizeObserver();
    this.sizes.subscribe("resize", () => this.resize());

    this.modelLoader = new ModelLoader(this);
    this.modelLoader.initGLTFLoader();

    this.camera = new Camera(this);
    this.renderer = new Renderer(this);

    this.equipment = new EquipmentManager(this);
    this.materials = new MaterialManager(this);

    this.defaultCameraPosition.copy(this.camera.instance.position);
    this.defaultCameraTarget.copy(this.camera.controls.target);

    this.time = new Time();
    this.time.subscribe("tick", () => this.tick());
    this.camera.controls.autoRotateSpeed = 0.5;

    this.resize();
    requestAnimationFrame(() => this.resize());

    this.initFloor();
  }

  resize(): void {
    if (this.disposed) return;

    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    if (width <= 0 || height <= 0) return;

    this.sizes.width = width;
    this.sizes.height = height;
    this.sizes.aspect = width / height;
    this.sizes.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    this.camera?.resize();
    this.renderer?.resize();

    if (this.modelRoot && isFinite(this.sizes.aspect)) {
      this.fitCameraToObject(this.modelRoot);
    }

    if (this.renderer?.instance && this.camera?.instance) {
      this.renderer.instance.render(this.scene, this.camera.instance);
    }
  }

  private tick(): void {
    if (this.disposed) return;

    if (
      this.isAnimatingCamera &&
      this.targetToLookAt &&
      this.camera?.controls
    ) {
      this.camera.controls.target.lerp(this.targetToLookAt, 0.05);

      if (this.camera.controls.target.distanceTo(this.targetToLookAt) < 0.01) {
        this.camera.controls.target.copy(this.targetToLookAt);
        this.isAnimatingCamera = false;
      }
    }

    this.camera.update();
    this.renderer.update();
  }

  update(): void {
    this.camera.update();
  }

  setAutoRotate(enabled: boolean): void {
    if (this.camera?.controls) {
      this.camera.controls.autoRotate = enabled;
    }
  }

  setModelRoot(object: THREE.Object3D | null): void {
    this.modelRoot = object;
    if (object) this.fitCameraToObject(object);
  }

  fitCameraToObject(object: THREE.Object3D, padding = 1.4): void {
    if (!this.camera?.instance || !this.camera?.controls) return;
    object.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (!isFinite(maxDim) || maxDim <= 0) return;

    const fov = this.camera.instance.fov * (Math.PI / 180);
    const distance = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * padding;

    this.camera.instance.position.set(
      center.x + distance * 0.6,
      center.y + distance * 0.8,
      center.z + distance,
    );
    this.camera.instance.lookAt(center);
    this.camera.controls.target.copy(center);
    this.camera.controls.minDistance = distance * 0.4;
    this.camera.controls.maxDistance = distance * 4;
    this.camera.controls.update();
  }

  resetCamera(): void {
    if (!this.camera?.instance || !this.camera?.controls) return;
    this.camera.instance.position.copy(this.defaultCameraPosition);
    this.camera.controls.target.copy(this.defaultCameraTarget);
    this.camera.controls.update();
    if (this.modelRoot) this.fitCameraToObject(this.modelRoot);
  }

  lookAtMesh(mesh: THREE.Object3D): void {
    if (!this.camera?.instance || !this.camera?.controls) return;

    mesh.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(mesh);
    this.targetToLookAt = box.getCenter(new THREE.Vector3());
    this.isAnimatingCamera = true;
  }

  private initFloor(): void {
    const textureLoader = new THREE.TextureLoader();
    const path = "/threejs/textures/floor/";

    const mapColor = textureLoader.load(`${path}laminate_floor_02_diff_2k.jpg`);
    const mapRoughness = textureLoader.load(
      `${path}laminate_floor_02_rough_2k.jpg`,
    );
    const mapNormal = textureLoader.load(
      `${path}laminate_floor_02_nor_gl_2k.jpg`,
    );

    mapColor.colorSpace = THREE.SRGBColorSpace;
    mapRoughness.colorSpace = THREE.NoColorSpace;
    mapNormal.colorSpace = THREE.NoColorSpace;

    const repeat = 10;
    [mapColor, mapRoughness, mapNormal].forEach((t) => {
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeat, repeat);

      t.anisotropy = this.renderer.instance.capabilities.getMaxAnisotropy();
    });

    const floorMat = new THREE.MeshStandardMaterial({
      map: mapColor,
      roughnessMap: mapRoughness,
      normalMap: mapNormal,
      normalScale: new THREE.Vector2(0.6, 0.6),
      roughness: 1.0,
    });

    const floorGeo = new THREE.PlaneGeometry(150, 150);
    const floor = new THREE.Mesh(floorGeo, floorMat);

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    this.time?.stop();
    this.sizes?.resetResizeObserver();
    this.eventEmitter?.clear();
    this.equipment?.clear();
    this.materials?.clear();

    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry?.dispose();
        const material = object.material;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      }
    });

    this.scene.environment?.dispose();
    this.camera.controls?.dispose();
    this.renderer.instance?.dispose();
    this.renderer.instance?.forceContextLoss();

    if (this.canvas?.parentElement === this.container) {
      this.container.removeChild(this.canvas);
    }
  }
}
