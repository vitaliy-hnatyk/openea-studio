import type { ElementType } from 'react';
import { Application, Integration } from '../types/architecture';
import { domainColor } from '../utils/graph';
import { Cloud, Database, Globe2, Mail, Package, Server, Smartphone, UserRound } from 'lucide-react';

const iconMap: Record<string, ElementType> = {
  'Web Portal': Globe2,
  'Mobile App': Smartphone,
  'API Gateway': Cloud,
  'Order Service': Package,
  'CRM System': UserRound,
  'Billing System': Server,
  'Inventory Service': Server,
  'Email Service': Mail,
  'Oracle Database': Database
};

interface ArchitectureCanvasProps {
  applications: Application[];
  allApplications: Application[];
  integrations: Integration[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ArchitectureCanvas({ applications, allApplications, integrations, selectedId, onSelect }: ArchitectureCanvasProps) {
  const visibleIds = new Set(applications.map((app) => app.id));
  const visibleIntegrations = integrations.filter((item) => visibleIds.has(item.sourceId) && visibleIds.has(item.targetId));

  function getApp(id: string) {
    return allApplications.find((app) => app.id === id);
  }

  return (
    <section className="canvasPanel">
      <div className="gridBackground">
        <svg className="edges" width="100%" height="100%" viewBox="0 0 1100 640" preserveAspectRatio="none">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#8fa4bf" />
            </marker>
            <marker id="arrowHot" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#f59e0b" />
            </marker>
          </defs>
          {visibleIntegrations.map((integration) => {
            const source = getApp(integration.sourceId);
            const target = getApp(integration.targetId);
            if (!source || !target) return null;
            const x1 = source.position.x + 90;
            const y1 = source.position.y + 32;
            const x2 = target.position.x + 90;
            const y2 = target.position.y + 32;
            const hot = integration.sourceId === selectedId || integration.targetId === selectedId;
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            return (
              <g key={integration.id} className={hot ? 'edge hot' : 'edge'}>
                <path d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`} markerEnd={hot ? 'url(#arrowHot)' : 'url(#arrow)'} />
                <text x={midX + 8} y={midY - 8}>{integration.label}</text>
              </g>
            );
          })}
        </svg>

        <div className="domainLegend">
          <h3>Domains</h3>
          {['Customer', 'Sales', 'Finance', 'Operations', 'Shared Services'].map((domain) => (
            <div key={domain}><span style={{ background: domainColor(domain) }} />{domain}</div>
          ))}
        </div>

        <div className="lineLegend">
          <h3>Legend</h3>
          <div><i className="solid" /> REST API</div>
          <div><i className="dash" /> SOAP</div>
          <div><i className="dot" /> Database</div>
          <div><i className="solid" /> File Transfer</div>
        </div>

        {applications.map((app) => {
          const Icon = iconMap[app.name] ?? Package;
          const color = domainColor(app.domain);
          return (
            <button
              key={app.id}
              className={`appNode ${selectedId === app.id ? 'selected' : ''}`}
              style={{ left: app.position.x, top: app.position.y, borderColor: color }}
              onClick={() => onSelect(app.id)}
            >
              <span className="nodeIcon" style={{ background: color }}><Icon size={19} /></span>
              <span className="nodeText"><strong>{app.name}</strong><small>{app.domain}</small></span>
              <em>{app.status}</em>
            </button>
          );
        })}
      </div>
    </section>
  );
}
