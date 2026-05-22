import { useAppContext } from './context/AppContext'
import { AppHeader } from './uiElements/organisms/AppHeader'
import { DashboardKPIs } from './uiElements/organisms/DashboardKPIs'
import { ClientTable } from './uiElements/organisms/ClientTable'
import { UploadPanel } from './uiElements/organisms/UploadPanel'
import { NewClientForm } from './uiElements/organisms/NewClientForm'
import { ClientDetail } from './uiElements/organisms/ClientDetail'
import { Modal } from './uiElements/atoms/Modal'
import { Button } from './uiElements/atoms/Button'

export default function App() {
  const { state, handlers } = useAppContext()
  const {
    view, clients, selectedClient, selectedBranch,
    isUploadOpen, isNewClientOpen,
  } = state
  const {
    onUploadComplete, onNewClientSaved, onClientClick,
    onNewClient, onUpload, onCloseUpload, onCloseNewClient,
    onBack, onBranchChange,
  } = handlers

  const stickyHeader = (
    <div className='sticky top-0 z-40'>
      <AppHeader selectedBranch={selectedBranch} onBranchChange={onBranchChange} />
    </div>
  )

  if (view === 'client-detail' && selectedClient)
    return (
      <div className='min-h-screen bg-background'>
        {stickyHeader}
        <ClientDetail client={selectedClient} onBack={onBack} />
      </div>
    )

  return (
    <div className='min-h-screen bg-background'>
      <div className='sticky top-0 z-40'>
        <AppHeader selectedBranch={selectedBranch} onBranchChange={onBranchChange} />

        <div className='flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-card border-b border-neutral/20'>
          <DashboardKPIs clients={clients} />
          <div className='flex items-center gap-3'>
            <Button variant='secondary' onClick={onUpload}>Upload CSV</Button>
            <Button onClick={onNewClient}>+ New Client</Button>
          </div>
        </div>
      </div>

      <main className='p-6'>
        <ClientTable clients={clients} onClientClick={onClientClick} />
      </main>

      {isUploadOpen && (
        <Modal
          title='Upload CSV'
          onClose={onCloseUpload}
          footer={
            <Button variant='secondary' onClick={onCloseUpload}>Cancel</Button>
          }
        >
          <UploadPanel onUploadComplete={onUploadComplete} />
        </Modal>
      )}

      {isNewClientOpen && (
        <Modal
          title='New Client Assessment'
          onClose={onCloseNewClient}
        >
          <NewClientForm onSaved={onNewClientSaved} onCancel={onCloseNewClient} />
        </Modal>
      )}
    </div>
  )
}
