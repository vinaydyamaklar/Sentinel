export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export type KYCStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'ENHANCED_DUE_DILIGENCE'

export type ClientType = 'INDIVIDUAL' | 'ENTITY'

export type RecordStatus = 'GOOD' | 'INCOMPLETE'

export type SourceOfFunds =
  | 'Employment'
  | 'Business Income'
  | 'Investment Returns'
  | 'Inheritance'
  | 'Property Sale'
  | 'Pension'
  | 'Gift'
  | 'Other'

export interface RiskExplanation {
  rule: string
  field: string
  value: string
}

export interface Client {
  clientId: string
  branch: string
  onboardingDate: string
  clientName: string
  clientType: ClientType | null
  countryOfTaxResidence: string
  annualIncome: number | null
  sourceOfFunds: SourceOfFunds | null
  pepStatus: boolean
  sanctionsScreeningMatch: boolean
  adverseMediaFlag: boolean
  riskClassification: RiskLevel | null
  kycStatus: KYCStatus | null
  idVerificationDate: string | null
  relationshipManager: string
  documentationComplete: boolean
  recordStatus: RecordStatus
  missingFields: string[]
  riskExplanation: RiskExplanation[]
  createdAt: string
}