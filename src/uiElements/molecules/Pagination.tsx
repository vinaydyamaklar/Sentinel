import { Button } from '../atoms/Button'

interface PaginationProps {
  totalItems: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function Pagination({ totalItems, currentPage, pageSize, onPageChange, onPageSizeChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize)

  if (totalItems === 0) return null

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Math.max(1, Number(e.target.value)), totalItems)
    if (!isNaN(val)) {
      onPageSizeChange(val)
      onPageChange(1)
    }
  }

  return (
    <div className='flex items-center justify-between px-4 py-3 border-t border-neutral/20'>
      <div className='flex items-center gap-2 text-sm text-neutral'>
        <span>Rows per page:</span>
        <input
          type='number'
          min={1}
          max={totalItems}
          value={pageSize}
          onChange={handleSizeChange}
          className='w-16 border border-neutral/40 rounded px-2 py-1 text-sm bg-card text-text text-center focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]'
        />
        <span>{totalItems} total</span>
      </div>

      <div className='flex items-center gap-2'>
        <Button
          variant='secondary'
          size='sm'
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ←
        </Button>
        <span className='text-sm text-text font-medium'>
          {currentPage} / {totalPages}
        </span>
        <Button
          variant='secondary'
          size='sm'
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          →
        </Button>
      </div>
    </div>
  )
}
