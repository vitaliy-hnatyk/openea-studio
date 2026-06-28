import React from 'react';
import ReactDOM from 'react-dom/client';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { ArchitectureCanvas } from './components/ArchitectureCanvas';
import { ApplicationDetails } from './components/ApplicationDetails';
import { ApplicationsTable } from './components/ApplicationsTable';
import { StatusDonut } from './components/StatusDonut';
import { RoadmapPanel } from './components/RoadmapPanel';
import { useArchitectureStore } from './store/useArchitectureStore';
import './styles/global.css';

function App() {
  const store = useArchitectureStore();

  return (
    <div className="appShell">
      <Sidebar />
      <main className="mainArea">
        <Header onExport={store.exportRepository} onImport={store.importRepository} onAdd={store.addDemoApplication} />
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
            />
            <div className="bottomGrid">
              <ApplicationsTable apps={store.filteredApplications} selectedId={store.selectedId} onSelect={store.setSelectedId} />
              <StatusDonut apps={store.repository.applications} />
              <RoadmapPanel items={store.repository.roadmap} />
            </div>
          </section>
          {store.selectedApplication && (
            <ApplicationDetails
              app={store.selectedApplication}
              apps={store.repository.applications}
              integrations={store.repository.integrations}
              onSelect={store.setSelectedId}
            />
          )}
        </div>
        <footer className="footer"><span>Last updated: Jun 28, 2026 10:30</span><button onClick={store.resetDemoData}>Reset demo data</button><span>v1.0.0</span></footer>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
