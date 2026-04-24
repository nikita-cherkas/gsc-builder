import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
  application: unknown
  sizes: unknown
  scene: THREE.Scene
  canvas: HTMLCanvasElement
  instance: THREE.PerspectiveCamera
  controls: OrbitControls
  constructor(application: unknown)
  setInstance(): void
  setOrbitControls(): void
  resize(): void
  update(): void
}
