import { useCallback, useMemo } from 'react';
import type { ElementType } from 'react';
import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeProps,
  OnEdgesDelete,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Handle,
  Position
} from '@xyflow/react';
import { Application, Integration, Position as AppPosition } from '../types/architecture';
import { domainColor } from '../utils/graph';
import { Cloud, Database, Globe2, Mail, Package, RefreshCw, Server, Smartphone, UserRound } from 'lucide-react';

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

type AppNodeData = {
  app: Application;
  selectedId: string;
};

function AppFlowNode({ data }: NodeProps<Node<AppNodeData>>) {
  const app = data.app;
  const Icon = iconMap[app.name] ?? Package;
  const color = domainColor(app.domain);
  const selected = data.selectedId === app.id;

  return (
    <div className={`flowAppNode ${selected ? 'selected' : ''}`} style={{ borderColor: color }}>
      <Handle type="target" position={Position.Left} className="flowHandle" />
      <span className="nodeIcon" style={{ background: color }}><Icon size={19} /></span>
      <span className="nodeText"><strong>{app.name}</strong><small>{app.domain}</small></span>
      <em>{app.status}</em>
      <Handle type="source" position={Position.Right} className="flowHandle" />
    </div>
  );
}

const nodeTypes = { appNode: AppFlowNode };

interface ArchitectureCanvasProps {
  applications: Application[];
  allApplications: Application[];
  integrations: Integration[];
  selectedId: string;
  onSelect: (id: string) => void;
  onMoveApplication: (id: string, position: AppPosition) => void;
  onCreateConnection: (sourceId: string, targetId: string) => void;
  onDeleteIntegration: (id: string) => void;
  onAutoLayout: () => void;
}

function CanvasInner({
  applications,
  integrations,
  selectedId,
  onSelect,
  onMoveApplication,
  onCreateConnection,
  onDeleteIntegration,
  onAutoLayout
}: ArchitectureCanvasProps) {
  const reactFlow = useReactFlow();
  const visibleIds = useMemo(() => new Set(applications.map((app) => app.id)), [applications]);

  const nodes = useMemo<Node<AppNodeData>[]>(() => applications.map((app) => ({
    id: app.id,
    type: 'appNode',
    position: app.position,
    data: { app, selectedId },
    draggable: true
  })), [applications, selectedId]);

  const edges = useMemo<Edge[]>(() => integrations
    .filter((item) => visibleIds.has(item.sourceId) && visibleIds.has(item.targetId))
    .map((integration) => ({
      id: integration.id,
      source: integration.sourceId,
      target: integration.targetId,
      label: integration.label || integration.type,
      animated: integration.criticality === 'critical' || integration.criticality === 'high',
      type: integration.type === 'SOAP' ? 'smoothstep' : 'bezier',
      className: `flowEdge criticality-${integration.criticality}`,
      markerEnd: { type: 'arrowclosed' }
    })), [integrations, visibleIds]);

  const onConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target || connection.source === connection.target) return;
    onCreateConnection(connection.source, connection.target);
  }, [onCreateConnection]);

  const onEdgesDelete = useCallback<OnEdgesDelete>((deletedEdges) => {
    deletedEdges.forEach((edge) => onDeleteIntegration(edge.id));
  }, [onDeleteIntegration]);

  return (
    <section className="canvasPanel flowCanvasPanel">
      <div className="flowActionBar">
        <button onClick={() => reactFlow.zoomIn()} title="Zoom in">+</button>
        <button onClick={() => reactFlow.zoomOut()} title="Zoom out">−</button>
        <button onClick={() => reactFlow.fitView({ padding: 0.2 })} title="Fit view">Fit</button>
        <button onClick={onAutoLayout} title="Auto layout"><RefreshCw size={14} /> Auto-layout</button>
        <span>Drag nodes. Drag from right handle to left handle to create an integration. Select an edge and press Delete.</span>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onSelect(node.id)}
        onNodeDragStop={(_, node) => onMoveApplication(node.id, node.position)}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        deleteKeyCode={["Backspace", "Delete"]}
        fitView
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        nodesDraggable
        nodesConnectable
        edgesFocusable
        edgesReconnectable={false}
        connectionLineStyle={{ stroke: '#58a6ff', strokeWidth: 2 }}
        defaultEdgeOptions={{ deletable: true }}
      >
        <Background gap={24} size={1} color="rgba(148, 163, 184, 0.2)" />
        <MiniMap pannable zoomable nodeColor={(node) => domainColor((node.data as AppNodeData).app.domain)} />
        <Controls showInteractive />
      </ReactFlow>
      <div className="domainLegend flowLegend">
        <h3>Domains</h3>
        {['Customer', 'Sales', 'Finance', 'Operations', 'Shared Services'].map((domain) => (
          <div key={domain}><span style={{ background: domainColor(domain) }} />{domain}</div>
        ))}
      </div>
      <div className="lineLegend flowLineLegend">
        <h3>Legend</h3>
        <div><i className="solid" /> REST / Event</div>
        <div><i className="dash" /> SOAP</div>
        <div><i className="dot" /> Database</div>
        <div><i className="solid" /> File / Queue</div>
      </div>
    </section>
  );
}

export function ArchitectureCanvas(props: ArchitectureCanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
}
