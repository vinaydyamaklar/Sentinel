import { useState, useRef, useEffect } from 'react'

interface ComboBoxProps {
  value: string
  options: string[]
  onChange: (value: string) => void
  placeholder?: string
  error?: boolean
}

export function ComboBox({ value, options, onChange, placeholder = 'Search...', error = false }: ComboBoxProps) {
  const [query, setQuery]   = useState(value)
  const [open, setOpen]     = useState(false)
  const ref                 = useRef<HTMLDivElement>(null)

  const filtered = query.length === 0
    ? options
    : options.filter(o => o.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        if (!options.includes(query)) {
          setQuery(value)
        }
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [query, value, options])

  const handleSelect = (option: string) => {
    onChange(option)
    setQuery(option)
    setOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setOpen(true)
    if (!e.target.value) onChange('')
  }

  return (
    <div ref={ref} className='relative'>
      <div className={`flex items-center border rounded bg-card ${error ? 'border-error' : 'border-neutral/40'}`}>
        <input
          type='text'
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className='w-full px-3 py-2.5 text-sm text-text bg-transparent focus:outline-none min-h-[44px] placeholder:text-neutral'
        />
        {query && (
          <button
            type='button'
            onClick={() => { onChange(''); setQuery(''); setOpen(false) }}
            className='px-3 text-neutral hover:text-text text-sm'
          >
            ✕
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className='absolute top-full mt-1.5 w-full bg-card border border-neutral/20 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto py-1'>
          {filtered.map(opt => (
            <button
              key={opt}
              type='button'
              onMouseDown={e => e.preventDefault()}
              onClick={() => handleSelect(opt)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors
                ${opt === value
                  ? 'text-primary font-semibold bg-primary/8'
                  : 'text-text hover:bg-background'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
