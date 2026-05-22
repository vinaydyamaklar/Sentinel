import type { Client, RiskLevel, RiskExplanation } from '../types/client'
import {
  HIGH_RISK_COUNTRIES,
  MEDIUM_RISK_COUNTRIES,
  MEDIUM_INCOME_THRESHOLD,
  MEDIUM_RISK_FUND_SOURCES,
} from './constants'

interface RiskResult {
  level: RiskLevel
  explanations: RiskExplanation[]
}

function assessHighRisk(client: Partial<Client>): RiskExplanation[] {
  const explanations: RiskExplanation[] = []

  if (client.pepStatus === true)
    explanations.push({ rule: 'Automatic HIGH', field: 'pepStatus', value: 'true' })

  if (client.sanctionsScreeningMatch === true)
    explanations.push({ rule: 'Automatic HIGH', field: 'sanctionsScreeningMatch', value: 'true' })

  if (client.adverseMediaFlag === true)
    explanations.push({ rule: 'Automatic HIGH', field: 'adverseMediaFlag', value: 'true' })

  if (
    client.countryOfTaxResidence &&
    (HIGH_RISK_COUNTRIES as readonly string[]).includes(client.countryOfTaxResidence)
  )
    explanations.push({
      rule: 'Automatic HIGH',
      field: 'countryOfTaxResidence',
      value: client.countryOfTaxResidence,
    })

  return explanations
}

function assessMediumRisk(client: Partial<Client>): RiskExplanation[] {
  const explanations: RiskExplanation[] = []

  if (client.clientType === 'ENTITY')
    explanations.push({ rule: 'MEDIUM', field: 'clientType', value: 'ENTITY' })

  if (
    client.countryOfTaxResidence &&
    (MEDIUM_RISK_COUNTRIES as readonly string[]).includes(client.countryOfTaxResidence)
  )
    explanations.push({
      rule: 'MEDIUM',
      field: 'countryOfTaxResidence',
      value: client.countryOfTaxResidence,
    })

  if (
    client.annualIncome != null &&
    client.annualIncome > MEDIUM_INCOME_THRESHOLD &&
    client.sourceOfFunds != null &&
    MEDIUM_RISK_FUND_SOURCES.includes(client.sourceOfFunds)
  )
    explanations.push({
      rule: 'MEDIUM',
      field: 'annualIncome + sourceOfFunds',
      value: `£${client.annualIncome.toLocaleString()} / ${client.sourceOfFunds}`,
    })

  return explanations
}

export function assessRisk(client: Partial<Client>): RiskResult {
  const highExplanations = assessHighRisk(client)
  if (highExplanations.length > 0)
    return { level: 'HIGH', explanations: highExplanations }

  const mediumExplanations = assessMediumRisk(client)
  if (mediumExplanations.length > 0)
    return { level: 'MEDIUM', explanations: mediumExplanations }

  return { level: 'LOW', explanations: [] }
}