export interface EquipmentAttributes {
  [key: string]: string
}

export interface EquipmentCategoryRef {
  id: number
  name: string
  slug: string
}

export interface EquipmentModelFull {
  ID: number
  id: number
  title: string
  filename: string
  filesize: number
  url: string
  link: string
  alt: string
  author: string
  description: string
  caption: string
  name: string
  status: string
  uploaded_to: number
  date: string
  modified: string
  menu_order: number
  mime_type: string
  type: string
  subtype: string
  icon: string
}

export interface EquipmentDimensions {
  length?: number
  width?: number
  height?: number
  weight?: number
}

export interface EquipmentItem {
  id: number
  name: string
  sku: string
  brands: string | null
  categories: EquipmentCategoryRef[]
  tags: string[] | null
  description: string
  link: string
  image: string
  model_full?: EquipmentModelFull | null
  auto_mountable: boolean
  cabinet: string
  inst_other: boolean
  requires_hood: boolean
  blocks_hood: boolean
  cooking_equipment_category: string[]
  default_position: string
  default_position_number: string
  above_counter: boolean
  dimensions: EquipmentDimensions
  type: string
  attributes: EquipmentAttributes
  title_for_3d_builder: string
  short_description_for_3d_builder: string
  icon_thumbnail: string
  main_image_for_3d_builder: string
  additional_image_for_3d_builder: string | false
  price?: number
}

export interface EquipmentsData {
  term_id?: number
  name: string
  description: string
  image: string
  icon: string
  options_name?: string
  equipment: EquipmentItem[]
  count?: number
}

export interface EquipmentGroupData {
  term_id?: number
  name: string
  description: string
  image: string
  icon: string
  options_name?: string
  selection?: 'single' | 'multi'
  children?: EquipmentsData[]
  equipment?: EquipmentItem[]
}

export type EquipmentGroupsResponse = Record<string, EquipmentGroupData>
