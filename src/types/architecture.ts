export type AppStatus = 'active' | 'planned' | 'deprecated' | 'retired';
export type Criticality = 'low' | 'medium' | 'high' | 'critical';
export type IntegrationType = 'REST' | 'SOAP' | 'Database' | 'File' | 'Queue' | 'Event';

export interface Position {
  x: number;
  y: number;
}

export interface Application {
  id: string;
  name: string;
  domain: string;
  description: string;
  owner: string;
  status: AppStatus;
  criticality: Criticality;
  technologies: string[];
  annualCost: number;
  lifecycle: string;
  position: Position;
}

export interface Integration {
  id: string;
  sourceId: string;
  targetId: string;
  type: IntegrationType;
  label: string;
  criticality: Criticality;
}

export interface RoadmapItem {
  id: string;
  title: string;
  due: string;
  status: 'planned' | 'in-progress' | 'done';
}

export interface ArchitectureRepository {
  applications: Application[];
  integrations: Integration[];
  roadmap: RoadmapItem[];
}
