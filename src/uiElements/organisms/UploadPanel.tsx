import { useState } from 'react'
import { FileUploadZone } from '../molecules/FileUploadZone'
import { ValidationSummary } from './ValidationSummary'
import { Spinner } from '../atoms/Spinner'
import { parseCSV } from '../../lib/csvParser'
import { validateAndTransformRow } from '../../lib/validator'
import { saveClients } from '../../lib/storage'
import type { Client } from '../../types/client'

interface UploadPanelProps {
  onUploadComplete: () => void
}

export function UploadPanel({ onUploadComplete }: UploadPanelProps) {
  const [status, setStatus]   = useState<'idle' | 'parsing' | 'done'>('idle')
  const [clients, setClients] = useState<Client[]>([])
  const [error, setError]     = useState<string | null>(null)

  const handleFileSelect = (file: File) => {
    setError(null)
    setStatus('parsing')

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const raw    = e.target?.result as string
        const rows   = parseCSV(raw)
        const parsed = rows.map(validateAndTransformRow)
        saveClients(parsed)
        setClients(parsed)
        setStatus('done')
      } catch {
        setError('Failed to parse the CSV file. Please check the format and try again.')
        setStatus('idle')
      }
    }

    reader.onerror = () => {
      setError('Could not read the file. Please try again.')
      setStatus('idle')
    }

    reader.readAsText(file)
  }

  return (
    <div className='flex flex-col gap-4'>
      {status === 'idle' && (
        <>
          <FileUploadZone onFileSelect={handleFileSelect} />
          {error && <p className='text-sm text-error text-center'>{error}</p>}
        </>
      )}
      {status === 'parsing' && <Spinner />}
      {status === 'done' && (
        <ValidationSummary clients={clients} onContinue={onUploadComplete} />
      )}
    </div>
  )
}
