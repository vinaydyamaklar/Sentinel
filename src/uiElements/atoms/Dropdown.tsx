import { useState, useRef, useEffect } from 'react'

interface DropdownProps {
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
  variant?: 'dark' | 'light'
  error?: boolean
  className?: string
}

export function Dropdown({ value, options, onChange, variant = 'dark', error = false, className = '' }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref             = useRef<HTMLDivElement>(null)
  const selected        = options.find(o => o.value === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const chevronClass = variant === 'dark' ? 'text-white/60' : 'text-neutral'

  if (variant === 'dark') {
    return (
      <div ref={ref} className={`relative ${className}`}>
        <button
          type='button'
          onClick={() => setOpen(o => !o)}
          className='w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 transition-colors min-h-[40px] text-sm text-white'
        >
          <span className='truncate'>{selected?.label ?? options[0]?.label}</span>
          <svg
            className={`w-4 h-4 shrink-0 text-white/60 transition-transform ${open ? 'rotate-180' : ''}`}
            fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
          </svg>
        </button>

        {open && (
          <div className='absolute right-0 top-full mt-1.5 w-full min-w-[160px] bg-card border border-neutral/20 rounded-lg shadow-xl z-50 py-1 overflow-hidden'>
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                  ${opt.value === value
                    ? 'text-primary font-semibold bg-primary/8'
                    : 'text-text hover:bg-background'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 min-h-[44px] rounded border bg-card cursor-pointer text-sm
          ${error ? 'border-error' : 'border-neutral/40'}`}
      >
        <span className={`truncate ${!selected ? 'text-neutral' : 'text-text'}`}>
          {selected?.label ?? 'Select...'}
        </span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform ${chevronClass} ${open ? 'rotate-180' : ''}`}
          fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
        </svg>
      </div>

      {open && (
        <div className='absolute right-0 top-full mt-1.5 w-full min-w-[160px] bg-card border border-neutral/20 rounded-lg shadow-xl z-50 py-1 overflow-hidden'>
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                ${opt.value === value
                  ? 'text-primary font-semibold bg-primary/8'
                  : 'text-text hover:bg-background'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
