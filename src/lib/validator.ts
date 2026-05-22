import type { Client, ClientType, KYCStatus, SourceOfFunds } from '../types/client'
import type { RawCSVRow } from './csvParser'
import { SOURCE_OF_FUNDS, KYC_STATUSES } from './constants'
import { assessRisk } from './riskEngine'

const VALID_CLIENT_TYPES: ClientType[] = ['INDIVIDUAL', 'ENTITY']
const VALID_BOOL = ['TRUE', 'FALSE']

function parseBoolean(value: string): boolean {
  return value.toUpperCase() === 'TRUE'
}

function isValidClientType(value: string): value is ClientType {
  return VALID_CLIENT_TYPES.includes(value as ClientType)
}

function isValidKYCStatus(value: string): value is KYCStatus {
  return (KYC_STATUSES as readonly string[]).includes(value)
}

function isValidSourceOfFunds(value: string): value is SourceOfFunds {
  return SOURCE_OF_FUNDS.includes(value as SourceOfFunds)
}

export function validateAndTransformRow(row: RawCSVRow): Client {
  const missingFields: string[] = []

  const requiredStringFields: (keyof RawCSVRow)[] = [
    'client_id',
    'branch',
    'onboarding_date',
    'client_name',
    'country_of_tax_residence',
    'relationship_manager',
  ]

  requiredStringFields.forEach(field => {
    if (!row[field]) missingFields.push(field)
  })

  if (!row['client_type'] || !isValidClientType(row['client_type']))
    missingFields.push('client_type')

  if (!row['source_of_funds'] || !isValidSourceOfFunds(row['source_of_funds']))
    missingFields.push('source_of_funds')

  if (!row['annual_income'] || isNaN(Number(row['annual_income'])))
    missingFields.push('annual_income')

  if (!row['pep_status'] || !VALID_BOOL.includes(row['pep_status'].toUpperCase()))
    missingFields.push('pep_status')

  if (!row['sanctions_screening_match'] || !VALID_BOOL.includes(row['sanctions_screening_match'].toUpperCase()))
    missingFields.push('sanctions_screening_match')

  if (!row['adverse_media_flag'] || !VALID_BOOL.includes(row['adverse_media_flag'].toUpperCase()))
    missingFields.push('adverse_media_flag')

  if (!row['kyc_status'] || !isValidKYCStatus(row['kyc_status']))
    missingFields.push('kyc_status')

  if (!row['documentation_complete'] || !VALID_BOOL.includes(row['documentation_complete'].toUpperCase()))
    missingFields.push('documentation_complete')

  const clientType = isValidClientType(row['client_type']) ? row['client_type'] : null
  const sourceOfFunds = isValidSourceOfFunds(row['source_of_funds']) ? row['source_of_funds'] : null
  const annualIncome = isNaN(Number(row['annual_income'])) ? null : Number(row['annual_income'])
  const pepStatus = parseBoolean(row['pep_status'] ?? '')
  const sanctionsScreeningMatch = parseBoolean(row['sanctions_screening_match'] ?? '')
  const adverseMediaFlag = parseBoolean(row['adverse_media_flag'] ?? '')

  const partial = {
    clientType,
    countryOfTaxResidence: row['country_of_tax_residence'] ?? '',
    annualIncome,
    sourceOfFunds,
    pepStatus,
    sanctionsScreeningMatch,
    adverseMediaFlag,
  }

  const { level, explanations } = assessRisk(partial)

  const client: Client = {
    clientId: row['client_id'] ?? '',
    branch: row['branch'] ?? '',
    onboardingDate: row['onboarding_date'] ?? '',
    clientName: row['client_name'] ?? '',
    clientType,
    countryOfTaxResidence: row['country_of_tax_residence'] ?? '',
    annualIncome,
    sourceOfFunds,
    pepStatus,
    sanctionsScreeningMatch,
    adverseMediaFlag,
    riskClassification: level,
    kycStatus: isValidKYCStatus(row['kyc_status']) ? row['kyc_status'] : null,
    idVerificationDate: row['id_verification_date'] || null,
    relationshipManager: row['relationship_manager'] ?? '',
    documentationComplete: parseBoolean(row['documentation_complete'] ?? ''),
    recordStatus: missingFields.length === 0 ? 'GOOD' : 'INCOMPLETE',
    missingFields,
    riskExplanation: explanations,
    createdAt: new Date().toISOString(),
  }

  return client
}