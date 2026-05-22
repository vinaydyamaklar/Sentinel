interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  options: { label: string; value: string }[]
}

export function Select({ error = false, options, className = '', ...props }: SelectProps) {
  return (
    <select
      className={`w-full rounded border px-3 py-2.5 text-sm text-text bg-card focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]
        ${error ? 'border-error' : 'border-neutral/40'}
        ${className}`}
      {...props}
    >
      <option value=''>Select...</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
