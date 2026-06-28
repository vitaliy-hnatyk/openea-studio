import { Edit2, Trash2 } from 'lucide-react';
import { Application } from '../types/architecture';
import { criticalityColor } from '../utils/graph';

interface ApplicationsTableProps {
  apps: Application[];
  selectedId: string;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ApplicationsTable({ apps, selectedId, onSelect, onEdit, onDelete }: ApplicationsTableProps) {
  return (
    <section className="bottomCard applicationsCard">
      <div className="cardHeader"><h3>Applications <span>({apps.length})</span></h3><button>View all</button></div>
      <table>
        <thead><tr><th>Name</th><th>Domain</th><th>Status</th><th>Criticality</th><th>Actions</th></tr></thead>
        <tbody>
          {apps.slice(0, 6).map((app) => (
            <tr key={app.id} className={selectedId === app.id ? 'selectedRow' : ''} onClick={() => onSelect(app.id)}>
              <td>{app.name}</td>
              <td>{app.domain}</td>
              <td><span className="statusText">{app.status}</span></td>
              <td><i style={{ background: criticalityColor(app.criticality) }} /> {app.criticality}</td>
              <td className="rowActions" onClick={(event) => event.stopPropagation()}>
                <button onClick={() => onEdit(app.id)} title="Edit"><Edit2 size={14} /></button>
                <button onClick={() => confirm('Delete this application and its integrations?') && onDelete(app.id)} title="Delete"><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="textLink">View all applications →</button>
    </section>
  );
}
