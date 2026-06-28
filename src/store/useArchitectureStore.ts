import { useEffect, useMemo, useState } from 'react';
import { ArchitectureRepository } from '../types/architecture';
import { sampleRepository } from '../data/sampleData';

const STORAGE_KEY = 'openea-studio-repository-v1';

function loadRepository(): ArchitectureRepository {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleRepository;
    return JSON.parse(raw) as ArchitectureRepository;
  } catch {
    return sampleRepository;
  }
}

export function useArchitectureStore() {
  const [repository, setRepository] = useState<ArchitectureRepository>(() => loadRepository());
  const [selectedId, setSelectedId] = useState<string>('order-service');
  const [domainFilter, setDomainFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(repository));
  }, [repository]);

  const selectedApplication = useMemo(
    () => repository.applications.find((app) => app.id === selectedId) ?? repository.applications[0],
    [repository.applications, selectedId]
  );

  const domains = useMemo(
    () => ['All', ...Array.from(new Set(repository.applications.map((app) => app.domain)))],
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
    setSelectedId('order-service');
  }

  function importRepository(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as ArchitectureRepository;
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

  function addDemoApplication() {
    const nextIndex = repository.applications.length + 1;
    const id = `new-app-${Date.now()}`;
    setRepository({
      ...repository,
      applications: [
        ...repository.applications,
        {
          id,
          name: `New Application ${nextIndex}`,
          domain: 'Shared Services',
          description: 'New application placeholder. Edit in future backend version.',
          owner: 'Architecture Team',
          status: 'planned',
          criticality: 'medium',
          technologies: ['TBD'],
          annualCost: 0,
          lifecycle: 'Planned',
          position: { x: 980, y: 150 + (nextIndex % 5) * 80 }
        }
      ]
    });
    setSelectedId(id);
  }

  return {
    repository,
    selectedId,
    selectedApplication,
    domains,
    filteredApplications,
    domainFilter,
    statusFilter,
    setSelectedId,
    setDomainFilter,
    setStatusFilter,
    resetDemoData,
    importRepository,
    exportRepository,
    addDemoApplication
  };
}
