import { useMemo } from 'react'
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
    <div className='flex items-center gap-3'>
      <Chip label='Total'  value={stats.total}  color='text-primary' />
      <Chip label='High'   value={stats.high}   color='text-error'   />
      <Chip label='Medium' value={stats.medium} color='text-warning' />
      <Chip label='Low'    value={stats.low}    color='text-success' />
    </div>
  )
}

function Chip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className='flex items-center gap-1.5 bg-card border border-neutral/20 rounded-md px-3 py-1 shadow-[0_1px_3px_rgba(0,0,0,0.08)]'>
      <span className='text-xs text-neutral'>{label}:</span>
      <span className={`text-xs font-bold ${color}`}>{value}</span>
    </div>
  )
}
