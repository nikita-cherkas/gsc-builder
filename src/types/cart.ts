import type { CustomerInfo } from './customer'

export type CartType = 'knockdown' | 'solid'
export type BaseQuality = 'standard' | 'premium'
export type BaseColor =
  | 'natural'
  | 'white'
  | 'black'
  | 'navy'
  | 'forest'
  | 'terracotta'
  | 'sand'
export type CutoutOption = 'solid' | 'basic' | 'with-sink' | 'full' | 'cups-no-sink'
export type TopMaterial = 'laminate' | 'hardwood' | 'stainless'
export type TopColor =
  | 'oak'
  | 'walnut'
  | 'espresso'
  | 'whitewash'
  | 'slate'
  | 'jet'
  | 'steel'
export type CutoutFeature = 'sink' | 'knock-box' | 'rinser' | 'cups'

export interface CartConfig {
  cartType: CartType
  baseQuality: BaseQuality
  baseColor: BaseColor
  cutout: CutoutOption
  topMaterial: TopMaterial
  topColor: TopColor
  foldableFlaps: boolean
  shelfInsert: boolean
  extraShelves: number
  equipment: number[]
  customer: CustomerInfo
}
