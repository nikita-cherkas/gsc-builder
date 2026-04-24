import type { CartConfig, ConfigStep, StepId } from '@/types'
import { STEP_CATALOG } from '@/data/steps'

export function getSteps(config: CartConfig): ConfigStep[] {
  const ids: StepId[] = ['cart-type', 'base-quality']
  if (config.baseQuality === 'premium') ids.push('base-color')
  ids.push('cutout', 'top-material', 'top-color', 'addons', 'equipment', 'summary', 'customer')
  return ids.map((id) => ({ id, ...STEP_CATALOG[id] }))
}
