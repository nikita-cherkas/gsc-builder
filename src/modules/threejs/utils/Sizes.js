import EventEmitter from './EventEmitter'

export default class Sizes extends EventEmitter {
  constructor(canvasContainer) {
    super()
    this.canvasContainer = canvasContainer
    this.width = canvasContainer.offsetWidth
    this.height = canvasContainer.offsetHeight
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    this.aspect = this.width / this.height
    this.resizeObserver = null
    this.resizeRaf = null
    this.boundRecalculateSizes = this.recalculateSizes.bind(this)
  }

  recalculateSizes() {
    const newWidth = this.canvasContainer.offsetWidth
    const newHeight = this.canvasContainer.offsetHeight

    if (
      newWidth === 0
      || newHeight === 0
      || (newWidth === this.width && newHeight === this.height)
    ) {
      return
    }

    this.width = newWidth
    this.height = newHeight
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
    this.aspect = this.width / this.height

    this.notify('resize')
  }

  setResizeObserver() {
    if (this.resizeObserver) return

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.recalculateSizes()
      })
      this.resizeObserver.observe(this.canvasContainer)
      return
    }

    window.addEventListener('resize', this.boundRecalculateSizes)
  }

  resetResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
      return
    }

    window.removeEventListener('resize', this.boundRecalculateSizes)
  }
}
