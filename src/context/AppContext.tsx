import { createContext, useContext, useState, useCallback } from 'react'
import { loadClients } from '../lib/storage'
import type { Client } from '../types/client'

type View = 'dashboard' | 'client-detail'

interface AppState {
  view: View
  clients: Client[]
  selectedClient: Client | null
  selectedBranch: string
  isUploadOpen: boolean
  isNewClientOpen: boolean
}

interface AppHandlers {
  onUploadComplete: () => void
  onNewClientSaved: () => void
  onClientClick: (client: Client) => void
  onNewClient: () => void
  onUpload: () => void
  onCloseUpload: () => void
  onCloseNewClient: () => void
  onBack: () => void
  onBranchChange: (branch: string) => void
}

interface AppContextValue {
  state: AppState
  handlers: AppHandlers
}

function getBranchFromURL(): string {
  return new URLSearchParams(window.location.search).get('branch') ?? ''
}

function setBranchInURL(branch: string): void {
  const params = new URLSearchParams(window.location.search)
  if (branch) {
    params.set('branch', branch)
  } else {
    params.delete('branch')
  }
  const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
  history.replaceState(null, '', newUrl)
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
  const [selectedBranch, setSelectedBranch] = useState<string>(getBranchFromURL)
  const [isUploadOpen, setIsUploadOpen]     = useState(false)
  const [isNewClientOpen, setIsNewClientOpen] = useState(false)

  const refreshClients = useCallback(() => setClients(loadClients()), [])

  const handleBranchChange = useCallback((branch: string) => {
    setSelectedBranch(branch)
    setBranchInURL(branch)
  }, [])

  const handlers: AppHandlers = {
    onUploadComplete: useCallback(() => {
      refreshClients()
      setIsUploadOpen(false)
    }, [refreshClients]),

    onNewClientSaved: useCallback(() => {
      refreshClients()
      setIsNewClientOpen(false)
    }, [refreshClients]),

    onClientClick: useCallback((client: Client) => {
      setSelectedClient(client)
      setView('client-detail')
    }, []),

    onNewClient:      useCallback(() => setIsNewClientOpen(true), []),
    onUpload:         useCallback(() => setIsUploadOpen(true), []),
    onCloseUpload:    useCallback(() => setIsUploadOpen(false), []),
    onCloseNewClient: useCallback(() => setIsNewClientOpen(false), []),

    onBack: useCallback(() => {
      setSelectedClient(null)
      setView('dashboard')
    }, []),

    onBranchChange: handleBranchChange,
  }

  const state: AppState = {
    view,
    clients: selectedBranch ? clients.filter(c => c.branch === selectedBranch) : clients,
    selectedClient,
    selectedBranch,
    isUploadOpen,
    isNewClientOpen,
  }

  return (
    <AppContext.Provider value={{ state, handlers }}>
      {children}
    </AppContext.Provider>
  )
}
