import { useState } from 'react'
import { Pagination } from '../molecules/Pagination'
import { DEFAULT_PAGE_SIZE } from '../../lib/constants'

interface Column {
  key: string
  header: string
}

interface DataGridProps<T> {
  data: T[]
  columns: Column[]
  renderCell: (key: string, row: T) => React.ReactNode
  onRowClick: (row: T) => void
  rowKey: keyof T
}

export function DataGrid<T>({ data, columns, renderCell, onRowClick, rowKey }: DataGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize]       = useState(DEFAULT_PAGE_SIZE)

  const start   = (currentPage - 1) * pageSize
  const end     = start + pageSize
  const visible = data.slice(start, end)

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  if (data.length === 0) {
    return (
      <div className='py-16 text-center text-neutral text-sm'>
        No records found.
      </div>
    )
  }

  return (
    <div className='flex flex-col'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='sticky top-0 z-10'>
            <tr className='bg-background border-b border-neutral/20'>
              {columns.map(col => (
                <th
                  key={col.key}
                  className='px-4 py-3 text-left text-xs font-medium text-neutral uppercase tracking-wide'
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      <div className='overflow-y-auto max-h-[520px]'>
        <table className='w-full'>
          <tbody>
            {visible.map((row, i) => (
              <tr
                key={String(row[rowKey])}
                onClick={() => onRowClick(row)}
                className={`border-b border-neutral/10 cursor-pointer hover:bg-background transition-colors
                  ${i % 2 === 0 ? 'bg-card' : 'bg-background/50'}`}
              >
                {columns.map(col => (
                  <td key={col.key} className='px-4 py-3'>
                    {renderCell(col.key, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalItems={data.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}
