import { useState, useMemo } from 'react'
import { Badge } from '../atoms/Badge'
import { SearchBar } from '../molecules/SearchBar'
import { FilterDropdown } from '../molecules/FilterDropdown'
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
  { label: 'High',   value: 'HIGH'   },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low',    value: 'LOW'    },
]

const statusOptions = [
  { label: 'Approved',              value: 'APPROVED'               },
  { label: 'Pending',               value: 'PENDING'                },
  { label: 'Rejected',              value: 'REJECTED'               },
  { label: 'Enhanced Due Diligence', value: 'ENHANCED_DUE_DILIGENCE' },
]

export function ClientTable({ clients, onClientClick }: ClientTableProps) {
  const [search, setSearch]         = useState('')
  const [riskFilter, setRiskFilter] = useState('')
  const [kycFilter, setKycFilter]   = useState('')

  const filtered = useMemo(() => {
    return clients.filter(c => {
      const matchesSearch = search === '' ||
        c.clientName.toLowerCase().includes(search.toLowerCase()) ||
        c.clientId.toLowerCase().includes(search.toLowerCase()) ||
        c.relationshipManager.toLowerCase().includes(search.toLowerCase())

      const matchesRisk = riskFilter === '' || c.riskClassification === riskFilter
      const matchesKyc  = kycFilter  === '' || c.kycStatus === kycFilter

      return matchesSearch && matchesRisk && matchesKyc
    })
  }, [clients, search, riskFilter, kycFilter])

  const columns = [
    { key: 'clientId',           header: 'Client ID'  },
    { key: 'clientName',         header: 'Name'        },
    { key: 'branch',             header: 'Branch'      },
    { key: 'onboardingDate',     header: 'Date'        },
    { key: 'riskClassification', header: 'Risk'        },
    { key: 'kycStatus',          header: 'KYC Status'  },
    { key: 'recordStatus',       header: 'Record'      },
  ]

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
      <div className='flex items-center gap-4 p-4 border-b border-neutral/20'>
        <div className='flex-1'>
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <FilterDropdown label='Risk'   value={riskFilter} options={riskOptions}   onChange={setRiskFilter} />
        <FilterDropdown label='Status' value={kycFilter}  options={statusOptions} onChange={setKycFilter}  />
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
