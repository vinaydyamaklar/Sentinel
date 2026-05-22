import { useMemo } from 'react'
import { Badge } from '../atoms/Badge'
import { Button } from '../atoms/Button'
import type { Client } from '../../types/client'

interface ValidationSummaryProps {
  clients: Client[]
  onContinue: () => void
}

export function ValidationSummary({ clients, onContinue }: ValidationSummaryProps) {
  const { good, incomplete } = useMemo(() => ({
    good:       clients.filter(c => c.recordStatus === 'GOOD'),
    incomplete: clients.filter(c => c.recordStatus === 'INCOMPLETE'),
  }), [clients])

  return (
    <div className='bg-card rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 flex flex-col gap-6'>
      <h2 className='text-[18px] font-semibold text-text'>Upload Summary</h2>

      <div className='flex gap-6'>
        <div className='flex items-center gap-2'>
          <Badge label={String(good.length)} variant='success' />
          <span className='text-sm text-text'>Records imported successfully</span>
        </div>
        <div className='flex items-center gap-2'>
          <Badge label={String(incomplete.length)} variant='warning' />
          <span className='text-sm text-text'>Records flagged as INCOMPLETE</span>
        </div>
      </div>

      {incomplete.length > 0 && (
        <div className='border border-warning/30 rounded-lg overflow-hidden'>
          <div className='bg-warning/10 px-4 py-2 border-b border-warning/20'>
            <p className='text-xs font-medium text-text'>Incomplete Records — Missing Fields</p>
          </div>
          <div className='divide-y divide-neutral/10 max-h-64 overflow-y-auto'>
            {incomplete.map(c => (
              <div key={c.clientId} className='px-4 py-3 flex items-start gap-4'>
                <span className='text-xs font-medium text-text w-24 shrink-0'>{c.clientId || '—'}</span>
                <span className='text-xs text-neutral'>{c.clientName || 'Unknown'}</span>
                <div className='flex flex-wrap gap-1 ml-auto'>
                  {c.missingFields.map(field => (
                    <span key={field} className='text-xs bg-error/10 text-error px-2 py-0.5 rounded'>
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='flex justify-end'>
        <Button onClick={onContinue}>Continue to Dashboard →</Button>
      </div>
    </div>
  )
}
