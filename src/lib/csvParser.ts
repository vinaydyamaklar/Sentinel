export interface RawCSVRow {
  [key: string]: string
}

export function parseCSV(raw: string): RawCSVRow[] {
  const [headerLine, ...dataLines] = raw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)

  const headers = headerLine.split(',').map(h => h.trim())

  return dataLines.map(line => {
    const values = line.split(',').map(v => v.trim())
    return headers.reduce<RawCSVRow>((row, header, index) => {
      row[header] = values[index] ?? ''
      return row
    }, {})
  })
}