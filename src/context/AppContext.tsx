import { createContext, useContext, useState, useCallback } from 'react'
import { loadClients } from '../lib/storage'
import type { Client } from '../types/client'

type View = 'upload' | 'dashboard' | 'new-client' | 'client-detail'

interface AppState {
  view: View
  clients: Client[]
  selectedClient: Client | null
  selectedBranch: string
}

interface AppHandlers {
  onUploadComplete: () => void
  onNewClientSaved: () => void
  onClientClick: (client: Client) => void
  onNewClient: () => void
  onUpload: () => void
  onBack: () => void
  onBranchChange: (branch: string) => void
}

interface AppContextValue {
  state: AppState
  handlers: AppHandlers
}

const AppContext = createContext<AppContextValue | null>(null)

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [view, setView]                     = useState<View>('dashboard')
  const [clients, setClients]               = useState<Client[]>(loadClients)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedBranch, setSelectedBranch] = useState('')

  const refreshClients = useCallback(() => setClients(loadClients()), [])

  const handlers: AppHandlers = {
    onUploadComplete: useCallback(() => {
      refreshClients()
      setView('dashboard')
    }, [refreshClients]),

    onNewClientSaved: useCallback(() => {
      refreshClients()
      setView('dashboard')
    }, [refreshClients]),

    onClientClick: useCallback((client: Client) => {
      setSelectedClient(client)
      setView('client-detail')
    }, []),

    onNewClient: useCallback(() => setView('new-client'), []),
    onUpload:    useCallback(() => setView('upload'), []),

    onBack: useCallback(() => {
      setSelectedClient(null)
      setView('dashboard')
    }, []),

    onBranchChange: useCallback((branch: string) => setSelectedBranch(branch), []),
  }

  const state: AppState = {
    view,
    clients: selectedBranch ? clients.filter(c => c.branch === selectedBranch) : clients,
    selectedClient,
    selectedBranch,
  }

  return (
    <AppContext.Provider value={{ state, handlers }}>
      {children}
    </AppContext.Provider>
  )
}
