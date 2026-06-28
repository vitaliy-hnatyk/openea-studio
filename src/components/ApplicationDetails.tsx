import { X } from 'lucide-react';
import { Application, Integration } from '../types/architecture';
import { appName, criticalityColor, incoming, outgoing } from '../utils/graph';

interface ApplicationDetailsProps {
  app: Application;
  apps: Application[];
  integrations: Integration[];
  onSelect: (id: string) => void;
}

export function ApplicationDetails({ app, apps, integrations, onSelect }: ApplicationDetailsProps) {
  const inItems = incoming(app.id, integrations);
  const outItems = outgoing(app.id, integrations);
  const connected = [...inItems.map((item) => ({ ...item, direction: 'incoming' })), ...outItems.map((item) => ({ ...item, direction: 'outgoing' }))];

  return (
    <aside className="detailsPanel">
      <div className="panelTitle"><h3>Application Details</h3><X size={18} /></div>
      <div className="detailsHeader">
        <div className="bigIcon">◇</div>
        <div><h2>{app.name}</h2><p>{app.domain}</p></div>
        <span className="statusPill">{app.status}</span>
      </div>
      <div className="tabs"><button className="active">Overview</button><button>Dependencies</button><button>Properties</button><button>History</button></div>

      <div className="descriptionCard"><strong>Description</strong><p>{app.description}</p></div>

      <div className="metricGrid">
        <div><span>Owner</span><strong>{app.owner}</strong></div>
        <div><span>Criticality</span><strong><i style={{ background: criticalityColor(app.criticality) }} />{app.criticality}</strong></div>
        <div><span>Lifecycle</span><strong>{app.lifecycle}</strong></div>
        <div><span>Technology</span><strong>{app.technologies.join(', ')}</strong></div>
        <div><span>Cost Annual</span><strong>${app.annualCost.toLocaleString()}</strong></div>
        <div><span>Status</span><strong><i className="greenDot" />{app.status}</strong></div>
      </div>

      <div className="dependenciesTitle"><h3>Dependencies</h3><button>View all</button></div>
      <div className="dependencyCounters">
        <div><strong>{inItems.length}</strong><span>Incoming</span></div>
        <div><strong>{outItems.length}</strong><span>Outgoing</span></div>
      </div>

      <div className="connectedList">
        <h4>Connected To</h4>
        {connected.map((item) => {
          const targetId = item.direction === 'incoming' ? item.sourceId : item.targetId;
          return (
            <button key={`${item.id}-${item.direction}`} onClick={() => onSelect(targetId)}>
              <span>{appName(apps, targetId)}</span>
              <small>{item.type}</small>
              <em className={item.direction}>{item.direction}</em>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
