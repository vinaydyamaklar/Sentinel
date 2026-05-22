interface ToggleFieldProps {
  value: string
  onChange: (value: string) => void
  error?: boolean
}

export function ToggleField({ value, onChange, error = false }: ToggleFieldProps) {
  return (
    <div className='self-start'>
      <div className={`inline-flex items-center bg-neutral/15 rounded-lg p-1 gap-0.5 ${error ? 'ring-1 ring-error' : ''}`}>
        {[{ label: 'Yes', value: 'TRUE' }, { label: 'No', value: 'FALSE' }].map(opt => (
          <button
            key={opt.value}
            type='button'
            onClick={() => onChange(opt.value)}
            className={`min-w-[64px] py-1 rounded-md text-xs font-medium transition-all
              ${value === opt.value
                ? 'bg-primary text-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                : 'text-neutral hover:text-text'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
