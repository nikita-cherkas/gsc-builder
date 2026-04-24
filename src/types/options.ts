import type { CutoutOption, TopColor, TopMaterial } from './cart'

export interface OptionInfo {
  paragraphs: readonly string[]
  facts?: ReadonlyArray<{ label: string; value: string }>
}

export interface PricedOption<Id extends string> {
  id: Id
  label: string
  description: string
  price: number
  highlights: string[]
  info?: OptionInfo
}

export interface SwatchOption<Id extends string> {
  id: Id
  label: string
  hex: string
}

export interface TopColorOption extends SwatchOption<TopColor> {
  materials: TopMaterial[]
}

export type CutoutShape =
  | { kind: 'rect'; x: number; y: number; w: number; h: number; label: string }
  | { kind: 'circle'; x: number; y: number; r: number; label: string }

export interface CutoutData {
  id: CutoutOption
  label: string
  description: string
  features: string[]
  price: number
  layout: CutoutShape[]
  info?: OptionInfo
}
