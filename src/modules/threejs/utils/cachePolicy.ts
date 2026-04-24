export const S3_SIGNED_URL_TTL_MS = 300_000
export const S3_SIGNED_URL_SAFETY_WINDOW_MS = 15_000

export const CACHE_POLICY = {
  mediaUrl: {
    ttlMs: S3_SIGNED_URL_TTL_MS - S3_SIGNED_URL_SAFETY_WINDOW_MS,
    maxEntries: 240,
  },
  gltf: {
    ttlMs: 10 * 60_000,
    maxEntries: 12,
  },
  hdr: {
    ttlMs: 30 * 60_000,
    maxEntries: 4,
  },
} as const

export const withTtl = (ttlMs: number) => Date.now() + ttlMs
