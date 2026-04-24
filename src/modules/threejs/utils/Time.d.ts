import EventEmitter from './EventEmitter'

export default class Time extends EventEmitter {
  start: number
  current: number
  elapsed: number
  delta: number
  rafId: number | null
  constructor()
  tick(): void
  stop(): void
}
