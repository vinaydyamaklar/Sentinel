interface StatCardProps {
  label: string
  value: number
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export function StatCard({ label, value, variant = 'default' }: StatCardProps) {
  const valueColors = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    error:   'text-error',
  }

  return (
    <div className='bg-card rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]'>
      <p className='text-xs font-medium text-neutral uppercase tracking-wide'>{label}</p>
      <p className={`text-[32px] font-bold mt-1 ${valueColors[variant]}`}>{value}</p>
    </div>
  )
}
