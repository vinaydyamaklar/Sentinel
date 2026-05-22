import { useState, useMemo } from 'react'
import { Badge } from '../atoms/Badge'
import { DataGrid } from './DataGrid'
import type { Client, RiskLevel, KYCStatus } from '../../types/client'

interface ClientTableProps {
  clients: Client[]
  onClientClick: (client: Client) => void
}

const riskVariant: Record<RiskLevel, 'error' | 'warning' | 'success'> = {
  HIGH:   'error',
  MEDIUM: 'warning',
  LOW:    'success',
}

const kycVariant: Record<KYCStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
  APPROVED:               'success',
  PENDING:                'warning',
  REJECTED:               'error',
  ENHANCED_DUE_DILIGENCE: 'neutral',
}

const riskOptions = [
  { label: 'All',    value: ''       },
  { label: 'High',   value: 'HIGH'   },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low',    value: 'LOW'    },
]

const columns = [
  { key: 'clientId',           header: 'Client ID',  width: '110px' },
  { key: 'clientName',         header: 'Name',        width: '170px' },
  { key: 'branch',             header: 'Branch',      width: '130px' },
  { key: 'onboardingDate',     header: 'Date',        width: '120px' },
  { key: 'riskClassification', header: 'Risk',        width: '100px' },
  { key: 'kycStatus',          header: 'KYC Status',  width: '150px' },
  { key: 'recordStatus',       header: 'Record',      width: '110px' },
]

export function ClientTable({ clients, onClientClick }: ClientTableProps) {
  const [riskFilter, setRiskFilter] = useState('')

  const filtered = useMemo(() =>
    riskFilter ? clients.filter(c => c.riskClassification === riskFilter) : clients
  , [clients, riskFilter])

  const renderCell = (key: string, client: Client) => {
    switch (key) {
      case 'riskClassification':
        return client.riskClassification
          ? <Badge label={client.riskClassification} variant={riskVariant[client.riskClassification]} />
          : <span className='text-neutral text-xs'>—</span>

      case 'kycStatus':
        return client.kycStatus
          ? <Badge label={client.kycStatus.replace(/_/g, ' ')} variant={kycVariant[client.kycStatus]} />
          : <span className='text-neutral text-xs'>—</span>

      case 'recordStatus':
        return (
          <Badge
            label={client.recordStatus}
            variant={client.recordStatus === 'GOOD' ? 'success' : 'warning'}
          />
        )

      default: {
        const val = (client as never as Record<string, string>)[key] ?? '—'
        return (
          <span title={val} className='text-sm text-text block max-w-[120px] truncate'>
            {val}
          </span>
        )
      }
    }
  }

  return (
    <div className='bg-card rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)]'>
      <div className='flex flex-col items-start gap-1.5 p-4 border-b border-neutral/20'>
        <span className='text-xs text-neutral font-medium uppercase tracking-wide'>Filter by Risk</span>
        <div className='flex items-center bg-neutral/15 rounded-lg p-1 gap-0.5'>
          {riskOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setRiskFilter(opt.value)}
              className={`px-4 py-1 rounded-md text-xs font-medium transition-all
                ${riskFilter === opt.value
                  ? 'bg-primary text-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                  : 'text-neutral hover:text-text'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <DataGrid
        data={filtered}
        columns={columns}
        renderCell={renderCell}
        onRowClick={onClientClick}
        rowKey='clientId'
      />
    </div>
  )
}
