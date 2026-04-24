import type { ConfigStep, StepId } from '@/types'

export const STEP_CATALOG: Record<StepId, Omit<ConfigStep, 'id'>> = {
  'cart-type': { label: 'Cart construction', shortLabel: 'Cart', hint: 'How it ships and assembles.' },
  'base-quality': { label: 'Base material', shortLabel: 'Base', hint: 'Cabinet build quality.' },
  'base-color': { label: 'Base color', shortLabel: 'Color', hint: 'Pick your wrap finish.' },
  cutout: { label: 'Top cutouts', shortLabel: 'Cutouts', hint: 'Service workflow.' },
  'top-material': { label: 'Top material', shortLabel: 'Material', hint: 'Worktop surface.' },
  'top-color': { label: 'Top finish', shortLabel: 'Finish', hint: 'Worktop tone.' },
  addons: { label: 'Add-ons', shortLabel: 'Extras', hint: 'Flaps, shelves.' },
  equipment: { label: 'Equipment', shortLabel: 'Gear', hint: 'Espresso, grinder, more.' },
  summary: { label: 'Review build', shortLabel: 'Review', hint: 'Confirm everything.' },
  customer: { label: 'Your details', shortLabel: 'You', hint: 'Where to send the quote.' },
}
