import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Application,
  ArchitectureRepository,
  BusinessCapability,
  Integration,
  TechnologyItem,
  Position
} from '../types/architecture';
import { sampleRepository } from '../data/sampleData';
import { loadRepositoryFromIndexedDb, saveRepositoryToIndexedDb, clearRepositoryFromIndexedDb } from '../services/indexedDbRepository';

const LEGACY_STORAGE_KEYS = ['openea-studio-repository-v2', 'openea-studio-repository-v1'];

function withDefaults(repository: Partial<ArchitectureRepository>): ArchitectureRepository {
  return {
    applications: repository.applications ?? [],
    integrations: repository.integrations ?? [],
    capabilities: repository.capabilities ?? [],
    technologies: repository.technologies ?? [],
    roadmap: repository.roadmap ?? []
  };
}

function loadLegacyRepository(): ArchitectureRepository | null {
  try {
    for (const key of LEGACY_STORAGE_KEYS) {
      const raw = localStorage.getItem(key);
      if (raw) return withDefaults(JSON.parse(raw) as Partial<ArchitectureRepository>);
    }
    return null;
  } catch {
    return null;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'item';
}

function uniqueId(prefix: string, name: string) {
  return `${prefix}-${slugify(name)}-${Date.now().toString(36)}`;
}

function nextPosition(index: number) {
  return { x: 250 + (index % 4) * 230, y: 90 + Math.floor(index / 4) * 130 };
}

function autoLayoutPositions(repository: ArchitectureRepository): Record<string, Position> {
  const ids = repository.applications.map((app) => app.id);
  const incomingCount = new Map(ids.map((id) => [id, 0]));
  const outgoing = new Map(ids.map((id) => [id, [] as string[]]));

  repository.integrations.forEach((integration) => {
    if (!incomingCount.has(integration.sourceId) || !incomingCount.has(integration.targetId)) return;
    incomingCount.set(integration.targetId, (incomingCount.get(integration.targetId) ?? 0) + 1);
    outgoing.get(integration.sourceId)?.push(integration.targetId);
  });

  const level = new Map<string, number>();
  const queue = ids.filter((id) => (incomingCount.get(id) ?? 0) === 0);
  queue.forEach((id) => level.set(id, 0));

  while (queue.length > 0) {
    const id = queue.shift()!;
    const nextLevel = (level.get(id) ?? 0) + 1;
    for (const targetId of outgoing.get(id) ?? []) {
      if ((level.get(targetId) ?? -1) < nextLevel) level.set(targetId, nextLevel);
      incomingCount.set(targetId, (incomingCount.get(targetId) ?? 1) - 1);
      if ((incomingCount.get(targetId) ?? 0) === 0) queue.push(targetId);
    }
  }

  ids.forEach((id) => {
    if (!level.has(id)) level.set(id, 0);
  });

  const grouped = new Map<number, string[]>();
  ids.forEach((id) => {
    const group = level.get(id) ?? 0;
    grouped.set(group, [...(grouped.get(group) ?? []), id]);
  });

  const positions: Record<string, Position> = {};
  Array.from(grouped.entries()).sort(([a], [b]) => a - b).forEach(([group, groupIds]) => {
    groupIds.forEach((id, index) => {
      positions[id] = { x: 120 + group * 260, y: 90 + index * 125 };
    });
  });
  return positions;
}

export function useArchitectureStore() {
  const [repository, setRepository] = useState<ArchitectureRepository>(sampleRepository);
  const [selectedId, setSelectedId] = useState<string>(sampleRepository.applications[3]?.id ?? sampleRepository.applications[0]?.id ?? '');
  const [domainFilter, setDomainFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [storageStatus, setStorageStatus] = useState<'loading' | 'indexeddb' | 'fallback'>('loading');
  const hydratedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const stored = await loadRepositoryFromIndexedDb();
        const legacy = stored ?? loadLegacyRepository();
        const initial = legacy ?? sampleRepository;
        if (cancelled) return;
        setRepository(initial);
        setSelectedId(initial.applications[3]?.id ?? initial.applications[0]?.id ?? '');
        setStorageStatus('indexeddb');
        hydratedRef.current = true;
        if (!stored) await saveRepositoryToIndexedDb(initial);
      } catch {
        const fallback = loadLegacyRepository() ?? sampleRepository;
        if (cancelled) return;
        setRepository(fallback);
        setSelectedId(fallback.applications[3]?.id ?? fallback.applications[0]?.id ?? '');
        setStorageStatus('fallback');
        hydratedRef.current = true;
      }
    }

    hydrate();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (storageStatus === 'indexeddb') {
      saveRepositoryToIndexedDb(repository).catch(() => setStorageStatus('fallback'));
    } else if (storageStatus === 'fallback') {
      localStorage.setItem(LEGACY_STORAGE_KEYS[0], JSON.stringify(repository));
    }
  }, [repository, storageStatus]);

  const selectedApplication = useMemo(
    () => repository.applications.find((app) => app.id === selectedId) ?? repository.applications[0],
    [repository.applications, selectedId]
  );

  const domains = useMemo(
    () => ['All', ...Array.from(new Set(repository.applications.map((app) => app.domain).filter(Boolean)))],
    [repository.applications]
  );

  const filteredApplications = useMemo(() => {
    return repository.applications.filter((app) => {
      const domainOk = domainFilter === 'All' || app.domain === domainFilter;
      const statusOk = statusFilter === 'All' || app.status === statusFilter;
      return domainOk && statusOk;
    });
  }, [domainFilter, repository.applications, statusFilter]);

  function resetDemoData() {
    setRepository(sampleRepository);
    setSelectedId(sampleRepository.applications[3]?.id ?? sampleRepository.applications[0]?.id ?? '');
    clearRepositoryFromIndexedDb().then(() => saveRepositoryToIndexedDb(sampleRepository)).catch(() => undefined);
  }

  function importRepository(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = withDefaults(JSON.parse(String(reader.result)) as Partial<ArchitectureRepository>);
        if (!parsed.applications || !parsed.integrations) throw new Error('Invalid repository');
        setRepository(parsed);
        setSelectedId(parsed.applications[0]?.id ?? '');
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  }

  function exportRepository() {
    const blob = new Blob([JSON.stringify(repository, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'openea-repository.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function createApplication(input: Omit<Application, 'id' | 'position'> & { id?: string; position?: Application['position'] }) {
    const app: Application = {
      ...input,
      id: input.id?.trim() || uniqueId('app', input.name),
      position: input.position ?? nextPosition(repository.applications.length)
    };
    setRepository((current) => ({ ...current, applications: [...current.applications, app] }));
    setSelectedId(app.id);
  }

  function updateApplication(id: string, patch: Partial<Application>) {
    setRepository((current) => ({
      ...current,
      applications: current.applications.map((app) => (app.id === id ? { ...app, ...patch, id } : app))
    }));
  }

  function deleteApplication(id: string) {
    setRepository((current) => {
      const apps = current.applications.filter((app) => app.id !== id);
      const integrations = current.integrations.filter((item) => item.sourceId !== id && item.targetId !== id);
      if (selectedId === id) setSelectedId(apps[0]?.id ?? '');
      return { ...current, applications: apps, integrations };
    });
  }

  function createIntegration(input: Omit<Integration, 'id'> & { id?: string }) {
    if (input.sourceId === input.targetId) return;
    const integration: Integration = { ...input, id: input.id?.trim() || uniqueId('integration', `${input.sourceId}-${input.targetId}`) };
    setRepository((current) => ({ ...current, integrations: [...current.integrations, integration] }));
  }

  function createConnection(sourceId: string, targetId: string) {
    createIntegration({ sourceId, targetId, type: 'REST', label: 'REST', criticality: 'medium' });
  }

  function moveApplication(id: string, position: Position) {
    updateApplication(id, { position });
  }

  function autoLayoutApplications() {
    setRepository((current) => {
      const positions = autoLayoutPositions(current);
      return {
        ...current,
        applications: current.applications.map((app) => ({ ...app, position: positions[app.id] ?? app.position }))
      };
    });
  }

  function updateIntegration(id: string, patch: Partial<Integration>) {
    setRepository((current) => ({
      ...current,
      integrations: current.integrations.map((item) => (item.id === id ? { ...item, ...patch, id } : item))
    }));
  }

  function deleteIntegration(id: string) {
    setRepository((current) => ({ ...current, integrations: current.integrations.filter((item) => item.id !== id) }));
  }

  function createCapability(input: Omit<BusinessCapability, 'id'> & { id?: string }) {
    const capability: BusinessCapability = { ...input, id: input.id?.trim() || uniqueId('cap', input.name) };
    setRepository((current) => ({ ...current, capabilities: [...current.capabilities, capability] }));
  }

  function updateCapability(id: string, patch: Partial<BusinessCapability>) {
    setRepository((current) => ({
      ...current,
      capabilities: current.capabilities.map((item) => (item.id === id ? { ...item, ...patch, id } : item))
    }));
  }

  function deleteCapability(id: string) {
    setRepository((current) => ({ ...current, capabilities: current.capabilities.filter((item) => item.id !== id) }));
  }

  function createTechnology(input: Omit<TechnologyItem, 'id'> & { id?: string }) {
    const technology: TechnologyItem = { ...input, id: input.id?.trim() || uniqueId('tech', input.name) };
    setRepository((current) => ({ ...current, technologies: [...current.technologies, technology] }));
  }

  function updateTechnology(id: string, patch: Partial<TechnologyItem>) {
    setRepository((current) => ({
      ...current,
      technologies: current.technologies.map((item) => (item.id === id ? { ...item, ...patch, id } : item))
    }));
  }

  function deleteTechnology(id: string) {
    setRepository((current) => ({ ...current, technologies: current.technologies.filter((item) => item.id !== id) }));
  }

  return {
    repository,
    selectedId,
    selectedApplication,
    domains,
    filteredApplications,
    domainFilter,
    statusFilter,
    storageStatus,
    setSelectedId,
    setDomainFilter,
    setStatusFilter,
    resetDemoData,
    importRepository,
    exportRepository,
    createApplication,
    updateApplication,
    deleteApplication,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    createConnection,
    moveApplication,
    autoLayoutApplications,
    createCapability,
    updateCapability,
    deleteCapability,
    createTechnology,
    updateTechnology,
    deleteTechnology
  };
}
