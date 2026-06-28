import { Download, Maximize, Plus, Upload } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  onImport: (file: File) => void;
  onAdd: () => void;
}

export function Header({ onExport, onImport, onAdd }: HeaderProps) {
  return (
    <header className="topbar">
      <div>
        <h2>Architecture Canvas</h2>
        <p>Application Landscape</p>
      </div>
      <div className="topActions">
        <select aria-label="View selector">
          <option>Default View</option>
          <option>Critical Systems</option>
          <option>Modernization View</option>
        </select>
        <button className="iconBtn" onClick={onExport} title="Export JSON"><Download size={18} /></button>
        <label className="iconBtn" title="Import JSON">
          <Upload size={18} />
          <input type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && onImport(event.target.files[0])} />
        </label>
        <button className="iconBtn"><Maximize size={18} /></button>
        <button className="primaryBtn" onClick={onAdd}><Plus size={18} /> Add Application</button>
      </div>
    </header>
  );
}
