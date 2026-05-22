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
    <span
      title={label}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium max-w-[110px] truncate ${variants[variant]}`}
    >
      {label}
    </span>
  )
}
