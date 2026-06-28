import { Download, Maximize, Plus, Upload } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  onImport: (file: File) => void;
  onAddApplication: () => void;
  onAddIntegration: () => void;
  onAddCapability: () => void;
  onAddTechnology: () => void;
}

export function Header({ onExport, onImport, onAddApplication, onAddIntegration, onAddCapability, onAddTechnology }: HeaderProps) {
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
        <button className="primaryBtn" onClick={onAddApplication}><Plus size={18} /> Application</button>
        <button className="secondaryAction" onClick={onAddIntegration}>+ Integration</button>
        <button className="secondaryAction" onClick={onAddCapability}>+ Capability</button>
        <button className="secondaryAction" onClick={onAddTechnology}>+ Technology</button>
      </div>
    </header>
  );
}
