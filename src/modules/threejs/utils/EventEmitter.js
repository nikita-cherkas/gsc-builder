export default class EventEmitter {
  constructor() {
    this.collection = {}
  }

  notify(eventType, data) {
    if (!this.collection[eventType]) return

    for (const item of this.collection[eventType]) {
      item(data)
    }
  }

  subscribe(eventType, listener) {
    if (!this.collection[eventType]) {
      this.collection[eventType] = []
    }

    this.collection[eventType].push(listener)
    return () => this.unsubscribe(eventType, listener)
  }

  unsubscribe(eventType, listener) {
    if (!this.collection[eventType]) return

    const index = this.collection[eventType].findIndex(el => el === listener)
    if (index < 0) return
    this.collection[eventType].splice(index, 1)
  }

  clear(eventType) {
    if (!eventType) {
      this.collection = {}
      return
    }

    delete this.collection[eventType]
  }
}
