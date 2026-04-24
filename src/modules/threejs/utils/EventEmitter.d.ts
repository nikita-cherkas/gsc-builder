export default class EventEmitter {
  collection: Record<string, Array<(data?: unknown) => void>>
  notify(eventType: string, data?: unknown): void
  subscribe(eventType: string, listener: (data?: unknown) => void): () => void
  unsubscribe(eventType: string, listener: (data?: unknown) => void): void
  clear(eventType?: string): void
}
