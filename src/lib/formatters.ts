import type { CutoutFeature } from '@/types'

export function formatFeature(f: CutoutFeature): string {
  switch (f) {
    case 'knock-box':
      return 'knock box'
    case 'cups':
      return 'cup dispensers'
    default:
      return f
  }
}

export function formatPrice(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}
