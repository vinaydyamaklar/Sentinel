import type { Client } from '../types/client'
import { STORAGE_KEY } from './constants'

export function loadClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Client[]) : []
  } catch {
    return []
  }
}

export function saveClients(clients: Client[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
}

export function addClient(client: Client): void {
  const existing = loadClients()
  saveClients([...existing, client])
}

export function hasData(): boolean {
  return loadClients().length > 0
}