import { Input } from '../atoms/Input'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Search clients...' }: SearchBarProps) {
  return (
    <div className='relative'>
      <span className='absolute left-3 top-1/2 -translate-y-1/2 text-neutral text-sm'>⌕</span>
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className='pl-8'
      />
    </div>
  )
}
