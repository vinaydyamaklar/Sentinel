import { useState } from 'react'
import { FormField } from '../molecules/FormField'
import { Button } from '../atoms/Button'
import { Badge } from '../atoms/Badge'
import { assessRisk } from '../../lib/riskEngine'
import { addClient } from '../../lib/storage'
import { BRANCHES, SOURCE_OF_FUNDS, KYC_STATUSES } from '../../lib/constants'
import type { Client, ClientType, KYCStatus, SourceOfFunds, RiskLevel } from '../../types/client'

interface NewClientFormProps {
  onSaved: () => void
  onCancel: () => void
}

type FormState = {
  clientId: string
  clientName: string
  branch: string
  onboardingDate: string
  relationshipManager: string
  clientType: string
  countryOfTaxResidence: string
  annualIncome: string
  sourceOfFunds: string
  pepStatus: string
  sanctionsScreeningMatch: string
  adverseMediaFlag: string
  kycStatus: string
  idVerificationDate: string
  documentationComplete: string
}

const initialState: FormState = {
  clientId: '',
  clientName: '',
  branch: '',
  onboardingDate: new Date().toISOString().split('T')[0],
  relationshipManager: '',
  clientType: '',
  countryOfTaxResidence: '',
  annualIncome: '',
  sourceOfFunds: '',
  pepStatus: '',
  sanctionsScreeningMatch: '',
  adverseMediaFlag: '',
  kycStatus: '',
  idVerificationDate: '',
  documentationComplete: '',
}

const riskVariant: Record<RiskLevel, 'error' | 'warning' | 'success'> = {
  HIGH: 'error', MEDIUM: 'warning', LOW: 'success',
}

const boolOptions = [
  { label: 'Yes', value: 'TRUE'  },
  { label: 'No',  value: 'FALSE' },
]

export function NewClientForm({ onSaved, onCancel }: NewClientFormProps) {
  const [form, setForm]     = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<FormState>>({})

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const validate = (): boolean => {
    const e: Partial<FormState> = {}
    if (!form.clientId)                e.clientId                = 'Required'
    if (!form.clientName)              e.clientName              = 'Required'
    if (!form.branch)                  e.branch                  = 'Required'
    if (!form.onboardingDate)          e.onboardingDate          = 'Required'
    if (!form.relationshipManager)     e.relationshipManager     = 'Required'
    if (!form.clientType)              e.clientType              = 'Required'
    if (!form.countryOfTaxResidence)   e.countryOfTaxResidence   = 'Required'
    if (!form.annualIncome)            e.annualIncome            = 'Required'
    if (!form.sourceOfFunds)           e.sourceOfFunds           = 'Required'
    if (!form.pepStatus)               e.pepStatus               = 'Required'
    if (!form.sanctionsScreeningMatch) e.sanctionsScreeningMatch = 'Required'
    if (!form.adverseMediaFlag)        e.adverseMediaFlag        = 'Required'
    if (!form.kycStatus)               e.kycStatus               = 'Required'
    if (!form.documentationComplete)   e.documentationComplete   = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const partial = {
    clientType:              form.clientType as ClientType || null,
    countryOfTaxResidence:   form.countryOfTaxResidence,
    annualIncome:            form.annualIncome ? Number(form.annualIncome) : null,
    sourceOfFunds:           form.sourceOfFunds as SourceOfFunds || null,
    pepStatus:               form.pepStatus === 'TRUE',
    sanctionsScreeningMatch: form.sanctionsScreeningMatch === 'TRUE',
    adverseMediaFlag:        form.adverseMediaFlag === 'TRUE',
  }

  const { level, explanations } = assessRisk(partial)

  const handleSubmit = () => {
    if (!validate()) return

    const client: Client = {
      ...partial,
      clientId:             form.clientId,
      clientName:           form.clientName,
      branch:               form.branch,
      onboardingDate:       form.onboardingDate,
      relationshipManager:  form.relationshipManager,
      kycStatus:            form.kycStatus as KYCStatus,
      idVerificationDate:   form.idVerificationDate || null,
      documentationComplete: form.documentationComplete === 'TRUE',
      riskClassification:   level,
      riskExplanation:      explanations,
      recordStatus:         'GOOD',
      missingFields:        [],
      createdAt:            new Date().toISOString(),
    }

    addClient(client)
    onSaved()
  }

  return (
    <div className='min-h-screen bg-background p-6'>
      <div className='max-w-3xl mx-auto flex flex-col gap-6'>

        <div className='flex items-center justify-between'>
          <h2 className='text-[26px] font-bold text-primary'>New Client Assessment</h2>
          <Button variant='secondary' onClick={onCancel}>Cancel</Button>
        </div>

        <div className='bg-card rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex items-center gap-4'>
          <span className='text-sm font-medium text-text'>Live Risk Classification:</span>
          <Badge label={level} variant={riskVariant[level]} />
          {explanations.length > 0 && (
            <span className='text-xs text-neutral'>
              {explanations.map(e => e.field).join(', ')}
            </span>
          )}
        </div>

        <div className='bg-card rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] grid grid-cols-2 gap-4'>

          <FormField type='input' label='Client ID' required
            inputProps={{ value: form.clientId, onChange: set('clientId') }}
            error={errors.clientId} />

          <FormField type='input' label='Full Name' required
            inputProps={{ value: form.clientName, onChange: set('clientName') }}
            error={errors.clientName} />

          <FormField type='select' label='Branch' required
            options={BRANCHES.map(b => ({ label: b, value: b }))}
            selectProps={{ value: form.branch, onChange: set('branch') }}
            error={errors.branch} />

          <FormField type='input' label='Onboarding Date' required
            inputProps={{ type: 'date', value: form.onboardingDate, onChange: set('onboardingDate') }}
            error={errors.onboardingDate} />

          <FormField type='input' label='Relationship Manager' required
            inputProps={{ value: form.relationshipManager, onChange: set('relationshipManager') }}
            error={errors.relationshipManager} />

          <FormField type='select' label='Client Type' required
            options={[{ label: 'Individual', value: 'INDIVIDUAL' }, { label: 'Entity', value: 'ENTITY' }]}
            selectProps={{ value: form.clientType, onChange: set('clientType') }}
            error={errors.clientType} />

          <FormField type='input' label='Country of Tax Residence' required
            inputProps={{ value: form.countryOfTaxResidence, onChange: set('countryOfTaxResidence') }}
            error={errors.countryOfTaxResidence} />

          <FormField type='input' label='Annual Income (£)' required
            inputProps={{ type: 'number', value: form.annualIncome, onChange: set('annualIncome') }}
            error={errors.annualIncome} />

          <FormField type='select' label='Source of Funds' required
            options={SOURCE_OF_FUNDS.map(s => ({ label: s, value: s }))}
            selectProps={{ value: form.sourceOfFunds, onChange: set('sourceOfFunds') }}
            error={errors.sourceOfFunds} />

          <FormField type='select' label='PEP Status' required
            options={boolOptions}
            selectProps={{ value: form.pepStatus, onChange: set('pepStatus') }}
            error={errors.pepStatus} />

          <FormField type='select' label='Sanctions Screening Match' required
            options={boolOptions}
            selectProps={{ value: form.sanctionsScreeningMatch, onChange: set('sanctionsScreeningMatch') }}
            error={errors.sanctionsScreeningMatch} />

          <FormField type='select' label='Adverse Media Flag' required
            options={boolOptions}
            selectProps={{ value: form.adverseMediaFlag, onChange: set('adverseMediaFlag') }}
            error={errors.adverseMediaFlag} />

          <FormField type='select' label='KYC Status' required
            options={KYC_STATUSES.map(s => ({ label: s.replace(/_/g, ' '), value: s }))}
            selectProps={{ value: form.kycStatus, onChange: set('kycStatus') }}
            error={errors.kycStatus} />

          <FormField type='input' label='ID Verification Date'
            inputProps={{ type: 'date', value: form.idVerificationDate, onChange: set('idVerificationDate') }}
            error={errors.idVerificationDate} />

          <FormField type='select' label='Documentation Complete' required
            options={boolOptions}
            selectProps={{ value: form.documentationComplete, onChange: set('documentationComplete') }}
            error={errors.documentationComplete} />

        </div>

        <div className='flex justify-end gap-3'>
          <Button variant='secondary' onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Assessment</Button>
        </div>

      </div>
    </div>
  )
}
