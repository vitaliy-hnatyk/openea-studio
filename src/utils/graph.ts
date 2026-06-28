import { Application, Integration } from '../types/architecture';

export function incoming(appId: string, integrations: Integration[]) {
  return integrations.filter((integration) => integration.targetId === appId);
}

export function outgoing(appId: string, integrations: Integration[]) {
  return integrations.filter((integration) => integration.sourceId === appId);
}

export function appName(apps: Application[], id: string) {
  return apps.find((app) => app.id === id)?.name ?? id;
}

export function domainColor(domain: string) {
  const colors: Record<string, string> = {
    Customer: '#3f8cff',
    Sales: '#57c946',
    Finance: '#ff7b22',
    Operations: '#a855f7',
    'Shared Services': '#f7c631'
  };
  return colors[domain] ?? '#6b7280';
}

export function criticalityColor(value: string) {
  const colors: Record<string, string> = {
    low: '#67e8f9',
    medium: '#f7c631',
    high: '#ef5b52',
    critical: '#ff2d55'
  };
  return colors[value] ?? '#94a3b8';
}
