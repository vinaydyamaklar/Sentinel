import { useAppContext } from './context/AppContext'
import { AppHeader } from './uiElements/organisms/AppHeader'
import { DashboardKPIs } from './uiElements/organisms/DashboardKPIs'
import { ClientTable } from './uiElements/organisms/ClientTable'
import { UploadPanel } from './uiElements/organisms/UploadPanel'
import { NewClientForm } from './uiElements/organisms/NewClientForm'
import { ClientDetail } from './uiElements/organisms/ClientDetail'
import { Button } from './uiElements/atoms/Button'

export default function App() {
  const { state, handlers } = useAppContext()
  const { view, clients, selectedClient, selectedBranch } = state
  const { onUploadComplete, onNewClientSaved, onClientClick, onNewClient, onUpload, onBack, onBranchChange } = handlers

  if (view === 'upload')
    return <UploadPanel onUploadComplete={onUploadComplete} />

  if (view === 'new-client')
    return <NewClientForm onSaved={onNewClientSaved} onCancel={onBack} />

  if (view === 'client-detail' && selectedClient)
    return <ClientDetail client={selectedClient} onBack={onBack} />

  return (
    <div className='min-h-screen bg-background'>
      <AppHeader
        selectedBranch={selectedBranch}
        onBranchChange={onBranchChange}
      />
      <div className='flex items-center justify-between px-6 py-3 bg-card border-b border-neutral/20'>
        <DashboardKPIs clients={clients} />
        <div className='flex items-center gap-3'>
          <Button variant='secondary' onClick={onUpload}>Upload CSV</Button>
          <Button onClick={onNewClient}>+ New Client</Button>
        </div>
      </div>
      <main className='p-6'>
        <ClientTable clients={clients} onClientClick={onClientClick} />
      </main>
    </div>
  )
}
