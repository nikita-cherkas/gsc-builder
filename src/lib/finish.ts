import type { CartConfig } from '@/types'
import { BASE_COLOR_OPTIONS } from '@/data/base-color'
import { TOP_COLOR_OPTIONS } from '@/data/top-color'

export function getBaseColorHex(config: CartConfig): string {
  if (config.baseQuality === 'standard') return '#b08a5d'
  return BASE_COLOR_OPTIONS.find((c) => c.id === config.baseColor)?.hex ?? '#b08a5d'
}

export function getTopColorHex(config: CartConfig): string {
  return TOP_COLOR_OPTIONS.find((c) => c.id === config.topColor)?.hex ?? '#75461f'
}

export function getTopFinishProps(config: CartConfig): {
  roughness: number
  metalness: number
  envIntensity: number
} {
  switch (config.topMaterial) {
    case 'stainless':
      return { roughness: 0.18, metalness: 0.95, envIntensity: 2.4 }
    case 'hardwood':
      return { roughness: 0.5, metalness: 0, envIntensity: 0.4 }
    default:
      return { roughness: 0.42, metalness: 0, envIntensity: 0.6 }
  }
}

export function getBaseFinishProps(config: CartConfig): {
  roughness: number
  envIntensity: number
} {
  if (config.baseQuality === 'premium') return { roughness: 0.35, envIntensity: 0.8 }
  return { roughness: 0.6, envIntensity: 0.3 }
}
