interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ error = false, className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded border px-3 py-2.5 text-sm text-text bg-card focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]
        ${error ? 'border-error' : 'border-neutral/40'}
        ${className}`}
      {...props}
    />
  )
}
