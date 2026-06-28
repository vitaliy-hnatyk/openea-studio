import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { ArchitectureCanvas } from './components/ArchitectureCanvas';
import { ApplicationDetails } from './components/ApplicationDetails';
import { ApplicationsTable } from './components/ApplicationsTable';
import { StatusDonut } from './components/StatusDonut';
import { RoadmapPanel } from './components/RoadmapPanel';
import { CrudManager, ModalState } from './components/CrudManager';
import { useArchitectureStore } from './store/useArchitectureStore';
import '@xyflow/react/dist/style.css';
import './styles/global.css';

function App() {
  const store = useArchitectureStore();
  const [modal, setModal] = useState<ModalState | null>(null);

  return (
    <div className="appShell">
      <Sidebar />
      <main className="mainArea">
        <Header
          onExport={store.exportRepository}
          onImport={store.importRepository}
          onAddApplication={() => setModal({ entity: 'application', mode: 'create' })}
          onAddIntegration={() => setModal({ entity: 'integration', mode: 'create' })}
          onAddCapability={() => setModal({ entity: 'capability', mode: 'create' })}
          onAddTechnology={() => setModal({ entity: 'technology', mode: 'create' })}
        />
        <div className="workspace">
          <section className="leftWorkspace">
            <Toolbar
              domains={store.domains}
              domainFilter={store.domainFilter}
              statusFilter={store.statusFilter}
              onDomainChange={store.setDomainFilter}
              onStatusChange={store.setStatusFilter}
            />
            <ArchitectureCanvas
              applications={store.filteredApplications}
              allApplications={store.repository.applications}
              integrations={store.repository.integrations}
              selectedId={store.selectedId}
              onSelect={store.setSelectedId}
              onMoveApplication={store.moveApplication}
              onCreateConnection={store.createConnection}
              onDeleteIntegration={store.deleteIntegration}
              onAutoLayout={store.autoLayoutApplications}
            />
            <div className="bottomGrid">
              <ApplicationsTable
                apps={store.filteredApplications}
                selectedId={store.selectedId}
                onSelect={store.setSelectedId}
                onEdit={(id) => setModal({ entity: 'application', mode: 'edit', id })}
                onDelete={store.deleteApplication}
              />
              <StatusDonut apps={store.repository.applications} />
              <RoadmapPanel items={store.repository.roadmap} />
            </div>
            <CrudManager
              applications={store.repository.applications}
              integrations={store.repository.integrations}
              capabilities={store.repository.capabilities}
              technologies={store.repository.technologies}
              modal={modal}
              onOpen={setModal}
              onClose={() => setModal(null)}
              onSelectApplication={store.setSelectedId}
              createApplication={store.createApplication}
              updateApplication={store.updateApplication}
              deleteApplication={store.deleteApplication}
              createIntegration={store.createIntegration}
              updateIntegration={store.updateIntegration}
              deleteIntegration={store.deleteIntegration}
              createCapability={store.createCapability}
              updateCapability={store.updateCapability}
              deleteCapability={store.deleteCapability}
              createTechnology={store.createTechnology}
              updateTechnology={store.updateTechnology}
              deleteTechnology={store.deleteTechnology}
            />
          </section>
          {store.selectedApplication && (
            <ApplicationDetails
              app={store.selectedApplication}
              apps={store.repository.applications}
              integrations={store.repository.integrations}
              onSelect={store.setSelectedId}
              onEdit={() => setModal({ entity: 'application', mode: 'edit', id: store.selectedApplication.id })}
              onDelete={() => store.deleteApplication(store.selectedApplication.id)}
            />
          )}
        </div>
        <footer className="footer"><span>Storage: {store.storageStatus === 'indexeddb' ? 'IndexedDB' : store.storageStatus}</span><button onClick={store.resetDemoData}>Reset demo data</button><span>v1.3.0</span></footer>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
