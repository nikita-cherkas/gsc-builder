export type UseCase =
  | ''
  | 'cafe'
  | 'catering'
  | 'events'
  | 'office'
  | 'campus'
  | 'wholesale'
  | 'other'

export type DailyVolume = '' | '<50' | '50-100' | '100-200' | '200+'

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  company: string
  city: string
  state: string
  useCase: UseCase
  dailyVolume: DailyVolume
  neededBy: string
  notes: string
}

export interface CustomerValidation {
  valid: boolean
  errors: Partial<Record<keyof CustomerInfo, string>>
}
