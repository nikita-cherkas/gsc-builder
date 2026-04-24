import type { CustomerInfo, CustomerValidation } from '@/types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateCustomer(info: CustomerInfo): CustomerValidation {
  const errors: CustomerValidation['errors'] = {}
  if (info.name.trim().length < 2) errors.name = 'Required.'
  if (!EMAIL_RE.test(info.email)) errors.email = 'Enter a valid email.'
  if (info.phone.replace(/\D/g, '').length < 7) errors.phone = 'Enter a valid phone.'
  if (info.city.trim().length < 1) errors.city = 'Required.'
  if (info.state.trim().length < 1) errors.state = 'Required.'
  return { valid: Object.keys(errors).length === 0, errors }
}
