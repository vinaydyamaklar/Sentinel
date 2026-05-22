import { useRef } from 'react'
import { Button } from '../atoms/Button'

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  accept?: string
}

export function FileUploadZone({ onFileSelect, accept = '.csv' }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  return (
    <div
      className='border-2 border-dashed border-primary/30 rounded-lg p-12 flex flex-col items-center gap-4 bg-card cursor-pointer hover:border-primary/60 transition-colors'
      onClick={() => inputRef.current?.click()}
    >
      <p className='text-4xl'>📂</p>
      <p className='text-sm font-medium text-text'>Drop your CSV file here or click to browse</p>
      <p className='text-xs text-neutral'>Accepts .csv files only</p>
      <Button onClick={e => { e.stopPropagation(); inputRef.current?.click() }}>
        Select File
      </Button>
      <input
        ref={inputRef}
        type='file'
        accept={accept}
        className='hidden'
        onChange={handleFileChange}
      />
    </div>
  )
}
