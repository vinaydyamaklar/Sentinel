import { Badge } from '../atoms/Badge'
import { Button } from '../atoms/Button'
import type { Client, RiskLevel, KYCStatus } from '../../types/client'

interface ClientDetailProps {
  client: Client
  onBack: () => void
}

const riskVariant: Record<RiskLevel, 'error' | 'warning' | 'success'> = {
  HIGH: 'error', MEDIUM: 'warning', LOW: 'success',
}

const kycVariant: Record<KYCStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
  APPROVED:               'success',
  PENDING:                'warning',
  REJECTED:               'error',
  ENHANCED_DUE_DILIGENCE: 'neutral',
}

interface FieldRowProps {
  label: string
  value: React.ReactNode
}

function FieldRow({ label, value }: FieldRowProps) {
  return (
    <div className='flex flex-col gap-0.5 py-3 border-b border-neutral/10 last:border-0'>
      <span className='text-xs font-medium text-neutral uppercase tracking-wide'>{label}</span>
      <span className='text-sm text-text'>{value ?? '—'}</span>
    </div>
  )
}

export function ClientDetail({ client, onBack }: ClientDetailProps) {
  return (
    <div className='p-6'>
      <div className='max-w-3xl mx-auto flex flex-col gap-6'>

        <div className='flex items-center justify-between'>
          <h2 className='text-[26px] font-bold text-primary'>{client.clientName}</h2>
          <Button variant='secondary' onClick={onBack}>← Back</Button>
        </div>

        <div className='bg-card rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex items-center gap-4 flex-wrap'>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-medium text-neutral uppercase'>Risk</span>
            {client.riskClassification
              ? <Badge label={client.riskClassification} variant={riskVariant[client.riskClassification]} />
              : <span className='text-neutral text-xs'>—</span>}
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-medium text-neutral uppercase'>KYC</span>
            {client.kycStatus
              ? <Badge label={client.kycStatus.replace(/_/g, ' ')} variant={kycVariant[client.kycStatus]} />
              : <span className='text-neutral text-xs'>—</span>}
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-xs font-medium text-neutral uppercase'>Record</span>
            <Badge
              label={client.recordStatus}
              variant={client.recordStatus === 'GOOD' ? 'success' : 'warning'}
            />
          </div>
          <div className='ml-auto text-xs text-neutral'>
            Assessed: {new Date(client.createdAt).toLocaleString()}
          </div>
        </div>

        <div className='bg-card rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]'>
          <h3 className='text-[18px] font-semibold text-text mb-2'>Client Information</h3>
          <FieldRow label='Client ID'                value={client.clientId} />
          <FieldRow label='Full Name'                value={client.clientName} />
          <FieldRow label='Client Type'              value={client.clientType} />
          <FieldRow label='Branch'                   value={client.branch} />
          <FieldRow label='Onboarding Date'          value={client.onboardingDate} />
          <FieldRow label='Relationship Manager'     value={client.relationshipManager} />
          <FieldRow label='Country of Tax Residence' value={client.countryOfTaxResidence} />
          <FieldRow label='Annual Income'            value={client.annualIncome != null ? `£${client.annualIncome.toLocaleString()}` : null} />
          <FieldRow label='Source of Funds'          value={client.sourceOfFunds} />
          <FieldRow label='ID Verification Date'     value={client.idVerificationDate} />
          <FieldRow label='Documentation Complete'   value={client.documentationComplete ? 'Yes' : 'No'} />
        </div>

        <div className='bg-card rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]'>
          <h3 className='text-[18px] font-semibold text-text mb-2'>Screening Results</h3>
          <FieldRow label='PEP Status'          value={client.pepStatus ? 'Yes' : 'No'} />
          <FieldRow label='Sanctions Match'     value={client.sanctionsScreeningMatch ? 'Yes' : 'No'} />
          <FieldRow label='Adverse Media Flag'  value={client.adverseMediaFlag ? 'Yes' : 'No'} />
        </div>

        <div className='bg-card rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]'>
          <h3 className='text-[18px] font-semibold text-text mb-2'>Risk Audit Trail</h3>
          {client.riskExplanation.length === 0 ? (
            <p className='text-sm text-neutral'>No risk triggers — classified LOW by default.</p>
          ) : (
            <div className='flex flex-col gap-2'>
              {client.riskExplanation.map((exp, i) => (
                <div key={i} className='flex items-center gap-3 text-sm'>
                  <Badge label={exp.rule} variant={exp.rule === 'Automatic HIGH' ? 'error' : 'warning'} />
                  <span className='text-neutral font-medium'>{exp.field}</span>
                  <span className='text-text'>= {exp.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {client.missingFields.length > 0 && (
          <div className='bg-card rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-warning/30'>
            <h3 className='text-[18px] font-semibold text-warning mb-2'>Missing Fields</h3>
            <div className='flex flex-wrap gap-2'>
              {client.missingFields.map(field => (
                <span key={field} className='text-xs bg-error/10 text-error px-2 py-1 rounded'>
                  {field}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
