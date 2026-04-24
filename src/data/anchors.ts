import type { EquipmentTransform } from "@/modules/threejs/classes";
import type { EquipmentItem } from "@/types";

export interface AnchorBinding {
  anchor: string;
  transform?: EquipmentTransform;
}

export const ANCHOR_BY_CATEGORY_SLUG: Record<string, AnchorBinding> = {
  espresso: { anchor: "coffee-point" },
};

export const ANCHOR_OVERRIDE_BY_ITEM_ID: Record<number, AnchorBinding> = {};

export function resolveAnchor(item: EquipmentItem): AnchorBinding | null {
  const byId = ANCHOR_OVERRIDE_BY_ITEM_ID[item.id];
  if (byId) return byId;

  for (const cat of item.categories ?? []) {
    const binding = ANCHOR_BY_CATEGORY_SLUG[cat.slug];
    if (binding) return binding;
  }
  return null;
}
