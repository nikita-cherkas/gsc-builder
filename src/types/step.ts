export type StepId =
  | 'cart-type'
  | 'base-quality'
  | 'base-color'
  | 'cutout'
  | 'top-material'
  | 'top-color'
  | 'addons'
  | 'equipment'
  | 'summary'
  | 'customer'

export interface ConfigStep {
  id: StepId
  label: string
  shortLabel: string
  hint: string
}
