interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md'
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const base = 'rounded font-medium transition-colors focus:outline-none min-h-[44px] min-w-[44px]'

  const variants = {
    primary:   'bg-primary text-white hover:bg-primary-light',
    secondary: 'bg-white text-primary border border-primary hover:bg-background',
    danger:    'bg-error text-white hover:opacity-90',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}
