import { Hand, MousePointer2, Search, ZoomIn, ZoomOut } from 'lucide-react';

interface ToolbarProps {
  domains: string[];
  domainFilter: string;
  statusFilter: string;
  onDomainChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export function Toolbar({ domains, domainFilter, statusFilter, onDomainChange, onStatusChange }: ToolbarProps) {
  return (
    <div className="canvasToolbar">
      <div className="toolGroup">
        <button><Hand size={16} /></button>
        <button><MousePointer2 size={16} /></button>
        <button>↔</button>
        <button>▭</button>
        <button>T</button>
      </div>
      <div className="filterGroup">
        <select value={domainFilter} onChange={(event) => onDomainChange(event.target.value)}>
          {domains.map((domain) => <option key={domain}>{domain}</option>)}
        </select>
        <select value={statusFilter} onChange={(event) => onStatusChange(event.target.value)}>
          <option>All</option>
          <option>active</option>
          <option>planned</option>
          <option>deprecated</option>
          <option>retired</option>
        </select>
        <div className="searchBox"><span>Search in canvas</span><Search size={16} /></div>
        <button><ZoomOut size={16} /></button>
        <span className="zoomText">100%</span>
        <button><ZoomIn size={16} /></button>
      </div>
    </div>
  );
}
