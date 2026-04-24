import type {
  CartConfig,
  EquipmentGroupData,
  EquipmentGroupsResponse,
  EquipmentItem,
  EquipmentsData,
} from '@/types'

export function getAllEquipmentItems(
  groups: EquipmentGroupsResponse,
): EquipmentItem[] {
  const items: EquipmentItem[] = []
  for (const group of Object.values(groups)) {
    if (group.children) {
      for (const child of group.children) items.push(...child.equipment)
    } else if (group.equipment) {
      items.push(...group.equipment)
    }
  }
  return items
}

export function findEquipmentById(
  groups: EquipmentGroupsResponse,
  id: number,
): EquipmentItem | null {
  for (const group of Object.values(groups)) {
    if (group.children) {
      for (const child of group.children) {
        const item = child.equipment.find((e) => e.id === id)
        if (item) return item
      }
    } else if (group.equipment) {
      const item = group.equipment.find((e) => e.id === id)
      if (item) return item
    }
  }
  return null
}

export function findGroupContainingItem(
  groups: EquipmentGroupsResponse,
  id: number,
): { group: EquipmentGroupData; sub?: EquipmentsData } | null {
  for (const group of Object.values(groups)) {
    if (group.children) {
      const sub = group.children.find((c) => c.equipment.some((e) => e.id === id))
      if (sub) return { group, sub }
    } else if (group.equipment?.some((e) => e.id === id)) {
      return { group }
    }
  }
  return null
}

export function getSelectedEquipment(
  groups: EquipmentGroupsResponse,
  config: CartConfig,
): EquipmentItem[] {
  const out: EquipmentItem[] = []
  for (const id of config.equipment) {
    const item = findEquipmentById(groups, id)
    if (item) out.push(item)
  }
  return out
}

export function getSelectedInSubgroup(
  config: CartConfig,
  sub: EquipmentsData,
): EquipmentItem | null {
  for (const item of sub.equipment) {
    if (config.equipment.includes(item.id)) return item
  }
  return null
}

export function getCategoryItems(group: EquipmentGroupData): EquipmentItem[] {
  if (group.children) return group.children.flatMap((c) => c.equipment)
  return group.equipment ?? []
}

export function getSelectedInCategory(
  config: CartConfig,
  group: EquipmentGroupData,
): EquipmentItem[] {
  const all = getCategoryItems(group)
  return all.filter((item) => config.equipment.includes(item.id))
}
