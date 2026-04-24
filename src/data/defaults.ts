import type { CartConfig } from '@/types'

export const BASE_PRICE = 2499

export const CART_DIMENSIONS = { widthIn: 48, depthIn: 24, heightIn: 36 } as const

export const DEFAULT_CONFIG: CartConfig = {
  cartType: 'knockdown',
  baseQuality: 'standard',
  baseColor: 'natural',
  cutout: 'solid',
  topMaterial: 'laminate',
  topColor: 'oak',
  foldableFlaps: false,
  shelfInsert: false,
  extraShelves: 0,
  equipment: [],
  customer: {
    name: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    state: '',
    useCase: '',
    dailyVolume: '',
    neededBy: '',
    notes: '',
  },
}
