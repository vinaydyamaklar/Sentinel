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
  { key: 'clientId',           header: 'Client ID'  },
  { key: 'clientName',         header: 'Name'        },
  { key: 'branch',             header: 'Branch'      },
  { key: 'onboardingDate',     header: 'Date'        },
  { key: 'riskClassification', header: 'Risk'        },
  { key: 'kycStatus',          header: 'KYC Status'  },
  { key: 'recordStatus',       header: 'Record'      },
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

      default:
        return <span className='text-sm text-text'>{(client as never as Record<string, string>)[key] ?? '—'}</span>
    }
  }

  return (
    <div className='bg-card rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)]'>
      <div className='flex items-center gap-2 p-4 border-b border-neutral/20'>
        {riskOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => setRiskFilter(opt.value)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors min-h-[44px]
              ${riskFilter === opt.value
                ? 'bg-primary text-white'
                : 'bg-background text-neutral hover:bg-neutral/10'
              }`}
          >
            {opt.label}
          </button>
        ))}
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
