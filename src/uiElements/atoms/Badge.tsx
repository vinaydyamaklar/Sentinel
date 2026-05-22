interface BadgeProps {
  label: string
  variant: 'success' | 'warning' | 'error' | 'neutral'
}

export function Badge({ label, variant }: BadgeProps) {
  const variants = {
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error:   'bg-error text-white',
    neutral: 'bg-neutral text-white',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {label}
    </span>
  )
}
