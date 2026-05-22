import { Label } from '../atoms/Label'
import { Input } from '../atoms/Input'
import { Select } from '../atoms/Select'
import { Dropdown } from '../atoms/Dropdown'
import { ToggleField } from '../atoms/ToggleField'
import { ComboBox } from '../atoms/ComboBox'

interface BaseProps {
  label: string
  required?: boolean
  error?: string
}

interface InputFieldProps extends BaseProps {
  type: 'input'
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
}

interface SelectFieldProps extends BaseProps {
  type: 'select'
  options: { label: string; value: string }[]
  selectProps: React.SelectHTMLAttributes<HTMLSelectElement>
}

interface DropdownFieldProps extends BaseProps {
  type: 'dropdown'
  options: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
}

interface ToggleFieldProps extends BaseProps {
  type: 'toggle'
  value: string
  onChange: (value: string) => void
}

interface ComboBoxFieldProps extends BaseProps {
  type: 'combobox'
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

type FormFieldProps = InputFieldProps | SelectFieldProps | DropdownFieldProps | ToggleFieldProps | ComboBoxFieldProps

export function FormField(props: FormFieldProps) {
  const { label, required, error } = props

  return (
    <div className='flex flex-col gap-1'>
      <Label required={required}>{label}</Label>
      {props.type === 'input' ? (
        <Input error={!!error} {...props.inputProps} />
      ) : props.type === 'dropdown' ? (
        <Dropdown
          value={props.value}
          options={props.options}
          onChange={props.onChange}
          variant='light'
          error={!!error}
        />
      ) : props.type === 'toggle' ? (
        <ToggleField value={props.value} onChange={props.onChange} error={!!error} />
      ) : props.type === 'combobox' ? (
        <ComboBox value={props.value} options={props.options} onChange={props.onChange} placeholder={props.placeholder} error={!!error} />
      ) : (
        <Select error={!!error} options={props.options} {...props.selectProps} />
      )}
      {error && <span className='text-xs text-error'>{error}</span>}
    </div>
  )
}
