import EventEmitter from './EventEmitter'

export default class Sizes extends EventEmitter {
  canvasContainer: HTMLElement
  width: number
  height: number
  aspect: number
  pixelRatio: number
  resizeObserver: ResizeObserver | null
  constructor(canvasContainer: HTMLElement)
  recalculateSizes(): void
  setResizeObserver(): void
  resetResizeObserver(): void
}
