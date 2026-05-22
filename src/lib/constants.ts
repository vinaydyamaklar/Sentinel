import type { SourceOfFunds } from '../types/client'

export const BRANCHES = [
  'Mayfair',
  'Edinburgh',
  'Manchester',
  'Canary Wharf',
] as const

export const SOURCE_OF_FUNDS: SourceOfFunds[] = [
  'Employment',
  'Business Income',
  'Investment Returns',
  'Inheritance',
  'Property Sale',
  'Pension',
  'Gift',
  'Other',
]

export const KYC_STATUSES = [
  'APPROVED',
  'PENDING',
  'REJECTED',
  'ENHANCED_DUE_DILIGENCE',
] as const

// HIGH risk country list
export const HIGH_RISK_COUNTRIES = [
  'Russia',
  'Belarus',
  'Venezuela',
] as const

// MEDIUM risk country list
export const MEDIUM_RISK_COUNTRIES = [
  'Brazil',
  'Turkey',
  'South Africa',
  'Mexico',
  'UAE',
  'China',
] as const

// MEDIUM risk: income threshold
export const MEDIUM_INCOME_THRESHOLD = 500_000

// MEDIUM risk: source of funds that trigger when income > threshold
export const MEDIUM_RISK_FUND_SOURCES: SourceOfFunds[] = [
  'Inheritance',
  'Gift',
  'Other',
]

export const STORAGE_KEY = 'sentinel_clients'

export const DEFAULT_PAGE_SIZE = 15