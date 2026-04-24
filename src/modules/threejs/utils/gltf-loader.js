import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { LoadingManager } from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { MeshoptDecoder } from 'meshoptimizer'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import { CACHE_POLICY, withTtl } from './cachePolicy'

// const manager = new LoadingManager();
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
dracoLoader.setDecoderConfig({ type: 'js' })

const gltfCache = new Map()

const isTransientModelUrl = (url = '') =>
  typeof url === 'string' && (url.startsWith('blob:') || url.startsWith('data:'))

const resolveAssetUrl = (url = '') => {
  if (!url || typeof url !== 'string') return url
  if (/^(https?:|blob:|data:)/.test(url)) return url
  const base = import.meta.env.BASE_URL || '/'
  if (url.startsWith(base)) return url
  const clean = url.startsWith('/') ? url.slice(1) : url
  return base + clean
}

const ensureCacheLimit = () => {
  while (gltfCache.size > CACHE_POLICY.gltf.maxEntries) {
    const oldestKey = gltfCache.keys().next().value
    if (!oldestKey) break
    gltfCache.delete(oldestKey)
  }
}

export default class ModelLoader {
  constructor(application) {
    this.application = application
    this.loader = null
    this.objLoader = null
  }

  initGLTFLoader() {
    const loadingManager = new LoadingManager(
      () => {},

      // progress
      (item, loaded, total) => {
        if (!this.application) return
        const progress = loaded / total
        this.application.eventEmitter.notify('loadedProgress', progress)
      },
    )
    this.loader = new GLTFLoader(loadingManager)
    this.loader.setDRACOLoader(dracoLoader)
    this.loader.setMeshoptDecoder(MeshoptDecoder)
    this.objLoader = new OBJLoader(loadingManager)
  }

  async loadModel(urlInput) {
    if (!urlInput) {
      throw new Error('Model URL is required')
    }
    const url = resolveAssetUrl(urlInput)

    try {
      const cachedEntry = gltfCache.get(url)
      let cached = cachedEntry?.promise

      if (cachedEntry && cachedEntry.expiresAt <= Date.now()) {
        gltfCache.delete(url)
        cached = null
      }

      if (!cached) {
        cached = this.loader.loadAsync(url)
        gltfCache.set(url, {
          promise: cached,
          expiresAt: withTtl(CACHE_POLICY.gltf.ttlMs),
        })
        ensureCacheLimit()
      }
      const obj = await cached
      if (!obj?.scene) return obj

      const clonedScene = SkeletonUtils.clone(obj.scene)

      clonedScene.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material = child.material.map(m => m.clone())
          }
          else {
            child.material = child.material.clone()
          }
        }
      })

      if (isTransientModelUrl(url)) {
        gltfCache.delete(url)
      }

      return { ...obj, scene: clonedScene, scenes: [clonedScene] }
    }
    catch (e) {
      gltfCache.delete(url)
      console.error(e?.message || e)
      throw e
    }
  }

  async loadOBJModel(urlInput) {
    try {
      const obj = await this.objLoader.loadAsync(resolveAssetUrl(urlInput))
      if (this.application) {
        this.application.eventEmitter.notify('setLoadingFinished')
      }
      return obj
    }
    catch (e) {
      console.error(e.message)
      throw e
    }
  }

  clearModelCache(url) {
    if (url) {
      gltfCache.delete(url)
      return
    }
    gltfCache.clear()
  }
}
