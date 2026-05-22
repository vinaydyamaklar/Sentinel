interface ModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Modal({ title, onClose, children, footer }: ModalProps) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-text/40 backdrop-blur-sm' />
      <div className='relative z-10 bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col mx-4'>

        <div className='flex items-center justify-between px-6 py-4 border-b border-neutral/20'>
          <h2 className='text-[18px] font-semibold text-text'>{title}</h2>
          <button
            onClick={onClose}
            className='text-neutral hover:text-text transition-colors text-xl leading-none min-h-[44px] min-w-[44px] flex items-center justify-center'
          >
            ✕
          </button>
        </div>

        <div className='flex-1 overflow-y-auto px-6 py-4'>
          {children}
        </div>

        {footer && (
          <div className='px-6 py-4 border-t border-neutral/20 flex justify-end gap-3'>
            {footer}
          </div>
        )}

      </div>
    </div>
  )
}
