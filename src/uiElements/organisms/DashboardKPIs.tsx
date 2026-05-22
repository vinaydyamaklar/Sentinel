import { useMemo } from 'react'
import { StatCard } from '../molecules/StatCard'
import type { Client } from '../../types/client'

interface DashboardKPIsProps {
  clients: Client[]
}

export function DashboardKPIs({ clients }: DashboardKPIsProps) {
  const stats = useMemo(() => ({
    total:  clients.length,
    high:   clients.filter(c => c.riskClassification === 'HIGH').length,
    medium: clients.filter(c => c.riskClassification === 'MEDIUM').length,
    low:    clients.filter(c => c.riskClassification === 'LOW').length,
  }), [clients])

  return (
    <div className='grid grid-cols-4 gap-4'>
      <StatCard label='Total Clients' value={stats.total}  variant='default' />
      <StatCard label='High Risk'     value={stats.high}   variant='error'   />
      <StatCard label='Medium Risk'   value={stats.medium} variant='warning' />
      <StatCard label='Low Risk'      value={stats.low}    variant='success' />
    </div>
  )
}
