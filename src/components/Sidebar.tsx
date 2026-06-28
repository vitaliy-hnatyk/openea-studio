import { Activity, BarChart3, Box, Boxes, Cable, Gauge, GitBranch, Layers, Map, Settings } from 'lucide-react';

const nav = [
  { label: 'Dashboard', icon: Gauge },
  { label: 'Applications', icon: Box, active: true },
  { label: 'Capabilities', icon: Boxes },
  { label: 'Technologies', icon: Layers },
  { label: 'Integrations', icon: Cable },
  { label: 'Architecture Canvas', icon: GitBranch },
  { label: 'Impact Analysis', icon: Activity },
  { label: 'Roadmap', icon: Map },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Settings', icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandMark">◇</div>
        <div>
          <h1>OpenEA Studio</h1>
          <span>Enterprise Architecture</span>
        </div>
      </div>

      <nav className="navList">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} className={`navItem ${item.active ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="viewsBox">
        <h3>Views</h3>
        <button>All Applications</button>
        <button>By Domain</button>
        <button>By Status</button>
        <button>By Criticality</button>
      </div>

      <div className="userBox">
        <div className="avatar">AD</div>
        <div>
          <strong>Admin User</strong>
          <span>Enterprise Architect</span>
        </div>
      </div>
      <div className="health"><span /> All systems operational</div>
    </aside>
  );
}
