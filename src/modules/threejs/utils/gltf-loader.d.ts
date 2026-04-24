import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

export default class ModelLoader {
  application: unknown
  loader: GLTFLoader | null
  objLoader: OBJLoader | null
  constructor(application: unknown)
  initGLTFLoader(): void
  loadModel(url: string): Promise<any>
  loadOBJModel(url: string): Promise<any>
  clearModelCache(url?: string): void
}
