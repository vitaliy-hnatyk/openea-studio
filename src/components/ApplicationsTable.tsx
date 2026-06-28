import { Application } from '../types/architecture';
import { criticalityColor } from '../utils/graph';

interface ApplicationsTableProps {
  apps: Application[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ApplicationsTable({ apps, selectedId, onSelect }: ApplicationsTableProps) {
  return (
    <section className="bottomCard applicationsCard">
      <div className="cardHeader"><h3>Applications <span>({apps.length})</span></h3><button>View all</button></div>
      <table>
        <thead><tr><th>Name</th><th>Domain</th><th>Status</th><th>Criticality</th></tr></thead>
        <tbody>
          {apps.slice(0, 6).map((app) => (
            <tr key={app.id} className={selectedId === app.id ? 'selectedRow' : ''} onClick={() => onSelect(app.id)}>
              <td>{app.name}</td>
              <td>{app.domain}</td>
              <td><span className="statusText">{app.status}</span></td>
              <td><i style={{ background: criticalityColor(app.criticality) }} /> {app.criticality}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="textLink">View all applications →</button>
    </section>
  );
}
