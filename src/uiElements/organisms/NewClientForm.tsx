import { useState, useMemo } from 'react'
import { FormField } from '../molecules/FormField'
import { Button } from '../atoms/Button'
import { Badge } from '../atoms/Badge'
import { assessRisk } from '../../lib/riskEngine'
import { addClient, loadClients } from '../../lib/storage'
import { BRANCHES, SOURCE_OF_FUNDS, KYC_STATUSES, COUNTRIES } from '../../lib/constants'
import type { Client, ClientType, KYCStatus, SourceOfFunds, RiskLevel } from '../../types/client'

interface NewClientFormProps {
  onSaved: () => void
  onCancel: () => void
  defaultBranch?: string
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


export function NewClientForm({ onSaved, onCancel, defaultBranch = '' }: NewClientFormProps) {
  const [form, setForm]     = useState<FormState>({ ...initialState, branch: defaultBranch })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [rmManual, setRmManual] = useState(false)

  const rmOptions = useMemo(() => {
    if (!form.branch) return []
    const names = Array.from(
      new Set(
        loadClients()
          .filter(c => c.branch === form.branch && c.relationshipManager)
          .map(c => c.relationshipManager)
      )
    )
    return names.map(n => ({ label: n, value: n }))
  }, [form.branch])

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleBranchChange = (branch: string) => {
    setForm(prev => ({ ...prev, branch, relationshipManager: '' }))
    setRmManual(false)
  }

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
    <div className='flex flex-col gap-4'>

      <div className='bg-neutral/10 rounded-lg p-3 flex items-center gap-4'>
        <span className='text-sm font-medium text-text'>Live Risk:</span>
        <Badge label={level} variant={riskVariant[level]} />
        {explanations.length > 0 && (
          <span className='text-xs text-neutral'>
            {explanations.map(e => e.field).join(', ')}
          </span>
        )}
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

        <FormField type='input' label='Client ID' required
          inputProps={{ value: form.clientId, onChange: set('clientId') }}
          error={errors.clientId} />

        <FormField type='input' label='Full Name' required
          inputProps={{ value: form.clientName, onChange: set('clientName') }}
          error={errors.clientName} />

        <FormField type='dropdown' label='Branch' required
          options={BRANCHES.map(b => ({ label: b, value: b }))}
          value={form.branch}
          onChange={handleBranchChange}
          error={errors.branch} />

        <FormField type='input' label='Onboarding Date' required
          inputProps={{ type: 'date', value: form.onboardingDate, onChange: set('onboardingDate') }}
          error={errors.onboardingDate} />

        {rmOptions.length > 0 && !rmManual ? (
          <div className='flex flex-col gap-1'>
            <FormField type='dropdown' label='Relationship Manager' required
              options={[...rmOptions, { label: 'Other…', value: '__other__' }]}
              value={form.relationshipManager}
              onChange={v => {
                if (v === '__other__') {
                  setRmManual(true)
                  setForm(prev => ({ ...prev, relationshipManager: '' }))
                } else {
                  setForm(prev => ({ ...prev, relationshipManager: v }))
                }
              }}
              error={errors.relationshipManager} />
          </div>
        ) : (
          <div className='flex flex-col gap-1'>
            <FormField type='input' label='Relationship Manager' required
              inputProps={{ value: form.relationshipManager, onChange: set('relationshipManager'), placeholder: 'Enter name' }}
              error={errors.relationshipManager} />
            {rmOptions.length > 0 && (
              <button
                type='button'
                onClick={() => { setRmManual(false); setForm(prev => ({ ...prev, relationshipManager: '' })) }}
                className='text-xs text-primary hover:underline text-left'
              >
                ← Pick from existing
              </button>
            )}
          </div>
        )}

        <FormField type='dropdown' label='Client Type' required
          options={[{ label: 'Individual', value: 'INDIVIDUAL' }, { label: 'Entity', value: 'ENTITY' }]}
          value={form.clientType}
          onChange={v => setForm(prev => ({ ...prev, clientType: v }))}
          error={errors.clientType} />

        <FormField type='combobox' label='Country of Tax Residence' required
          options={COUNTRIES}
          value={form.countryOfTaxResidence}
          onChange={v => setForm(prev => ({ ...prev, countryOfTaxResidence: v }))}
          placeholder='Search country...'
          error={errors.countryOfTaxResidence} />

        <FormField type='input' label='Annual Income (£)' required
          inputProps={{ type: 'number', value: form.annualIncome, onChange: set('annualIncome') }}
          error={errors.annualIncome} />

        <FormField type='dropdown' label='Source of Funds' required
          options={SOURCE_OF_FUNDS.map(s => ({ label: s, value: s }))}
          value={form.sourceOfFunds}
          onChange={v => setForm(prev => ({ ...prev, sourceOfFunds: v }))}
          error={errors.sourceOfFunds} />

        <FormField type='toggle' label='PEP Status' required
          value={form.pepStatus}
          onChange={v => setForm(prev => ({ ...prev, pepStatus: v }))}
          error={errors.pepStatus} />

        <FormField type='toggle' label='Sanctions Screening Match' required
          value={form.sanctionsScreeningMatch}
          onChange={v => setForm(prev => ({ ...prev, sanctionsScreeningMatch: v }))}
          error={errors.sanctionsScreeningMatch} />

        <FormField type='toggle' label='Adverse Media Flag' required
          value={form.adverseMediaFlag}
          onChange={v => setForm(prev => ({ ...prev, adverseMediaFlag: v }))}
          error={errors.adverseMediaFlag} />

        <FormField type='dropdown' label='KYC Status' required
          options={KYC_STATUSES.map(s => ({ label: s.replace(/_/g, ' '), value: s }))}
          value={form.kycStatus}
          onChange={v => setForm(prev => ({ ...prev, kycStatus: v }))}
          error={errors.kycStatus} />

        <FormField type='input' label='ID Verification Date'
          inputProps={{ type: 'date', value: form.idVerificationDate, onChange: set('idVerificationDate') }}
          error={errors.idVerificationDate} />

        <FormField type='toggle' label='Documentation Complete' required
          value={form.documentationComplete}
          onChange={v => setForm(prev => ({ ...prev, documentationComplete: v }))}
          error={errors.documentationComplete} />

      </div>

      <div className='flex justify-end'>
        <Button onClick={handleSubmit}>Save Assessment</Button>
      </div>

    </div>
  )
}
