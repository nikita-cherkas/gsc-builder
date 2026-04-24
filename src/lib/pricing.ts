import type { CartConfig, EquipmentGroupsResponse, PriceLine } from '@/types'
import { BASE_PRICE } from '@/data/defaults'
import { CART_TYPE_OPTIONS } from '@/data/cart-type'
import { BASE_QUALITY_OPTIONS } from '@/data/base-quality'
import { CUTOUT_OPTIONS } from '@/data/cutout'
import { TOP_MATERIAL_OPTIONS } from '@/data/top-material'
import { ADDON_OPTIONS } from '@/data/addons'
import { getSelectedEquipment } from './equipment'

export function priceBreakdown(
  config: CartConfig,
  equipmentGroups: EquipmentGroupsResponse,
): PriceLine[] {
  const lines: PriceLine[] = [{ label: 'Economy Coffee Cart — base', amount: BASE_PRICE }]

  const ct = CART_TYPE_OPTIONS.find((o) => o.id === config.cartType)
  if (ct && ct.price > 0) lines.push({ label: ct.label, amount: ct.price })

  const bq = BASE_QUALITY_OPTIONS.find((o) => o.id === config.baseQuality)
  if (bq && bq.price > 0) lines.push({ label: bq.label, amount: bq.price })

  const co = CUTOUT_OPTIONS.find((o) => o.id === config.cutout)
  if (co && co.price > 0) lines.push({ label: `${co.label} cutouts`, amount: co.price })

  const tm = TOP_MATERIAL_OPTIONS.find((o) => o.id === config.topMaterial)
  if (tm && tm.price > 0) lines.push({ label: tm.label, amount: tm.price })

  if (config.foldableFlaps)
    lines.push({
      label: ADDON_OPTIONS.foldableFlaps.label,
      amount: ADDON_OPTIONS.foldableFlaps.price,
    })
  if (config.shelfInsert)
    lines.push({
      label: ADDON_OPTIONS.shelfInsert.label,
      amount: ADDON_OPTIONS.shelfInsert.price,
    })
  if (config.extraShelves > 0)
    lines.push({
      label: `${config.extraShelves}× extra shelf`,
      amount: config.extraShelves * ADDON_OPTIONS.extraShelves.pricePerUnit,
    })

  for (const item of getSelectedEquipment(equipmentGroups, config)) {
    const brand = item.attributes?.Brand || item.brands || ''
    const label = brand ? `${brand} ${item.name}` : item.name
    lines.push({ label, amount: item.price ?? 0 })
  }
  return lines
}

export function calculateTotal(
  config: CartConfig,
  equipmentGroups: EquipmentGroupsResponse,
): number {
  return priceBreakdown(config, equipmentGroups).reduce((sum, l) => sum + l.amount, 0)
}
