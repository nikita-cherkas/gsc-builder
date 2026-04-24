import * as THREE from 'three'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

export default class Renderer {
  application: unknown
  canvas: HTMLCanvasElement
  sizes: unknown
  scene: THREE.Scene
  camera: unknown
  raycaster: unknown
  gui: unknown
  fps: number
  interval: number
  then: number
  lastPreviewRenderAt: number
  instance: THREE.WebGLRenderer
  cssInstance: CSS3DRenderer
  constructor(application: unknown)
  setRenderer(): void
  loadEnv(file: string): Promise<THREE.Texture | unknown>
  resize(): void
  update(): void
}
