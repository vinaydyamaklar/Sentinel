import { Select } from '../atoms/Select'

interface FilterDropdownProps {
  label: string
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
}

export function FilterDropdown({ label, value, options, onChange }: FilterDropdownProps) {
  const allOptions = [{ label: `All ${label}`, value: '' }, ...options]

  return (
    <Select
      value={value}
      options={allOptions}
      onChange={e => onChange(e.target.value)}
    />
  )
}
