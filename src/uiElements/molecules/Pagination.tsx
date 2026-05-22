import { Button } from '../atoms/Button'
import { DEFAULT_PAGE_SIZE } from '../../lib/constants'

interface PaginationProps {
  totalItems: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function Pagination({ totalItems, currentPage, pageSize, onPageChange, onPageSizeChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize)
  const pageSizeOptions = [
    { label: '25', value: '25' },
    { label: '50', value: String(DEFAULT_PAGE_SIZE) },
    { label: '100', value: '100' },
  ]

  if (totalItems === 0) return null

  return (
    <div className='flex items-center justify-between px-4 py-3 border-t border-neutral/20'>
      <div className='flex items-center gap-2 text-sm text-neutral'>
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={e => { onPageSizeChange(Number(e.target.value)); onPageChange(1) }}
          className='border border-neutral/40 rounded px-2 py-1 text-sm bg-card text-text min-h-[44px]'
        >
          {pageSizeOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
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
