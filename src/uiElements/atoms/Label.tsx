interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export function Label({ required = false, children, className = '', ...props }: LabelProps) {
  return (
    <label className={`block text-xs font-medium text-text mb-1 ${className}`} {...props}>
      {children}
      {required && <span className='text-error ml-0.5'>*</span>}
    </label>
  )
}
