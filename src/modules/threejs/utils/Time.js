import EventEmitter from './EventEmitter'

export default class Time extends EventEmitter {
  constructor() {
    super()

    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16
    this.rafId = null

    this.rafId = window.requestAnimationFrame(() => {
      this.tick()
    })
  }

  tick() {
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start

    this.notify('tick')

    this.rafId = window.requestAnimationFrame(() => {
      this.tick()
    })
  }

  stop() {
    if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    this.unsubscribe('tick')
  }
}
