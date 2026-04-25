<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted, onUnmounted, watch, toRefs, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

interface Props {
  modelUrl: string
}

const props = defineProps<Props>()
const { modelUrl } = toRefs(props)

const containerRef = ref<HTMLElement | null>(null)
const isLoading = ref(true)
const hasError = ref(false)

let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let controls: OrbitControls | null = null
let animationId: number | null = null
let currentModel: THREE.Object3D | null = null
const isEngineReady = ref(false)
let loadingCounter = 0
let hdrPromise: Promise<THREE.Texture> | null = null

const initEngine = () => {
  if (!containerRef.value) return
  const w = containerRef.value.clientWidth
  const h = containerRef.value.clientHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf9fafb)

  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000)
  camera.position.set(2, 2, 5)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2

  containerRef.value.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)

  controls.enableDamping = true
  controls.autoRotate = true
  controls.addEventListener('start', () => {
    controls.autoRotate = false
  })

  const ambient = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambient)

  isEngineReady.value = true
  animate()
}

const getEnvironment = () => {
  if (hdrPromise) return hdrPromise

  hdrPromise = new Promise(async (resolve, reject) => {
    if (!renderer) return reject()
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    try {
      const loader = new RGBELoader()
      const texture = await loader.loadAsync(
        '/threejs/textures/env-map-2-2.hdr'
      )
      const envMap = pmremGenerator.fromEquirectangular(texture).texture

      scene.environment = envMap

      texture.dispose()
      pmremGenerator.dispose()
      resolve(envMap)
    } catch (err) {
      reject(err)
    }
  })
  return hdrPromise
}

const loadEnvironment = async () => {
  if (!renderer || !scene) return
  const pmremGenerator = new THREE.PMREMGenerator(renderer)

  try {
    const loader = new RGBELoader()
    const texture = await loader.loadAsync('/threejs/textures/env-map-2-2.hdr')
    const envMap = pmremGenerator.fromEquirectangular(texture).texture
    scene.environment = envMap
    renderer.toneMappingExposure = 1.55
    texture.dispose()
    pmremGenerator.dispose()
  } catch (err) {
    console.warn('Environment map failed, staying with ambient light')
  }
}

const loadModel = async (url: string) => {
  if (!isEngineReady.value || !url) return

  const loadId = ++loadingCounter
  isLoading.value = true
  hasError.value = false

  try {
    const [_, gltf] = await Promise.all([
      getEnvironment(),
      new GLTFLoader()
        .setDRACOLoader(
          new DRACOLoader().setDecoderPath(import.meta.env.BASE_URL + 'draco/')
        )
        .loadAsync(url),
    ])

    if (loadId !== loadingCounter) return

    disposeModel()
    currentModel = gltf.scene

    currentModel.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          child.material.needsUpdate = true
        }
      }
    })

    scene?.add(currentModel)
    refreshDimensions()
    fitCameraToSelection(currentModel)

    isLoading.value = false
  } catch (error) {
    if (loadId === loadingCounter) {
      console.error('3D Load Error:', error)
      hasError.value = true
      isLoading.value = false
    }
  }
}

const refreshDimensions = () => {
  if (!containerRef.value || !renderer || !camera) return
  const w = containerRef.value.clientWidth
  const h = containerRef.value.clientHeight
  if (w === 0 || h === 0) return

  renderer.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}

const fitCameraToSelection = (object: THREE.Object3D) => {
  if (!camera || !controls) return

  object.updateMatrixWorld(true)

  const box = new THREE.Box3().setFromObject(object)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  object.position.sub(center)

  const maxDim = Math.max(size.x, size.y, size.z)
  const fov = camera.fov * (Math.PI / 180)
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.4

  camera.position.set(-cameraZ * 0.5, cameraZ * 0.1, cameraZ)
  camera.lookAt(0, 0, 0)
  camera.updateProjectionMatrix()

  controls.target.set(0, 0, 0)
  controls.minDistance = cameraZ * 0.7
  controls.maxDistance = cameraZ * 3
  controls.update()
}

const animate = () => {
  if (!renderer || !scene || !camera || !controls) return
  animationId = requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

const disposeModel = () => {
  if (currentModel && scene) {
    scene.remove(currentModel)
    currentModel.traverse((child: any) => {
      if (child.isMesh) {
        child.geometry.dispose()
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material]
        materials.forEach((m) => m.dispose())
      }
    })
    currentModel = null
  }
}

const disposeScene = () => {
  if (animationId) cancelAnimationFrame(animationId)
  disposeModel()
  renderer?.dispose()
  renderer?.forceContextLoss()
  scene?.environment?.dispose()
  controls?.dispose()
}

watch(modelUrl, (newUrl) => {
  if (newUrl) loadModel(newUrl)
})

onMounted(async () => {
  await nextTick()
  initEngine()
  loadEnvironment()
  if (props.modelUrl) loadModel(props.modelUrl)

  const ro = new ResizeObserver(() => {
    refreshDimensions()
  })
  if (containerRef.value) ro.observe(containerRef.value)
})

onUnmounted(() => disposeScene())
</script>
<template>
  <div
    class="viewer-3d-container"
    ref="containerRef"
    @pointerdown="handleUserInteraction"
  >
    <div v-if="isLoading" class="loader-overlay">
      <div class="spinner"></div>
    </div>

    <div v-if="hasError" class="error-overlay">
      <div class="error-content">
        <div class="error-icon">!</div>
        <h3>Oops! 3D scene couldn't load</h3>
        <button @click="reloadScene" class="retry-btn">Try Again</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error-overlay {
  position: absolute;
  inset: 0;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 30;
  text-align: center;
  padding: 20px;

  .error-content {
    max-width: 280px;
    h3 {
      color: #111827;
      margin: 12px 0 8px;
      font-size: 18px;
    }
    p {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 20px;
    }
  }

  .error-icon {
    font-size: 40px;
  }

  .retry-btn {
    background: #f97316;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
      background: #ea580c;
    }
  }
}

.viewer-3d-container {
  width: 100%;
  height: 100%;
  min-height: 100%;
  position: relative;
  background: #f9fafb;
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 780px) {
    min-height: 250px;
    height: 100%;
    border-radius: 8px;
  }
}
.viewer-3d-container :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
  outline: none;
}
.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #f97316;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
