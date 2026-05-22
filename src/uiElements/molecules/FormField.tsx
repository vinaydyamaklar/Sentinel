import { Label } from '../atoms/Label'
import { Input } from '../atoms/Input'
import { Select } from '../atoms/Select'

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

type FormFieldProps = InputFieldProps | SelectFieldProps

export function FormField(props: FormFieldProps) {
  const { label, required, error } = props

  return (
    <div className='flex flex-col gap-1'>
      <Label required={required}>{label}</Label>
      {props.type === 'input' ? (
        <Input error={!!error} {...props.inputProps} />
      ) : (
        <Select error={!!error} options={props.options} {...props.selectProps} />
      )}
      {error && <span className='text-xs text-error'>{error}</span>}
    </div>
  )
}
