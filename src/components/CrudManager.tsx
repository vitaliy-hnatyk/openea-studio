import { FormEvent, ReactNode, useMemo, useState } from 'react';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import {
  Application,
  AppStatus,
  BusinessCapability,
  Criticality,
  Integration,
  IntegrationType,
  TechnologyItem,
  TechnologyLifecycle
} from '../types/architecture';
import { appName } from '../utils/graph';

type EntityType = 'application' | 'integration' | 'capability' | 'technology';
type Mode = 'create' | 'edit';

export interface ModalState {
  entity: EntityType;
  mode: Mode;
  id?: string;
}

interface CrudManagerProps {
  applications: Application[];
  integrations: Integration[];
  capabilities: BusinessCapability[];
  technologies: TechnologyItem[];
  modal: ModalState | null;
  onOpen: (modal: ModalState) => void;
  onClose: () => void;
  onSelectApplication: (id: string) => void;
  createApplication: (input: Omit<Application, 'id' | 'position'> & { id?: string; position?: Application['position'] }) => void;
  updateApplication: (id: string, patch: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  createIntegration: (input: Omit<Integration, 'id'> & { id?: string }) => void;
  updateIntegration: (id: string, patch: Partial<Integration>) => void;
  deleteIntegration: (id: string) => void;
  createCapability: (input: Omit<BusinessCapability, 'id'> & { id?: string }) => void;
  updateCapability: (id: string, patch: Partial<BusinessCapability>) => void;
  deleteCapability: (id: string) => void;
  createTechnology: (input: Omit<TechnologyItem, 'id'> & { id?: string }) => void;
  updateTechnology: (id: string, patch: Partial<TechnologyItem>) => void;
  deleteTechnology: (id: string) => void;
}

const appStatuses: AppStatus[] = ['active', 'planned', 'deprecated', 'retired'];
const criticalities: Criticality[] = ['low', 'medium', 'high', 'critical'];
const integrationTypes: IntegrationType[] = ['REST', 'SOAP', 'Database', 'File', 'Queue', 'Event'];
const technologyLifecycles: TechnologyLifecycle[] = ['approved', 'trial', 'deprecated', 'blocked'];

const emptyApplication: Omit<Application, 'id' | 'position'> = {
  name: '',
  domain: 'Shared Services',
  description: '',
  owner: '',
  status: 'planned',
  criticality: 'medium',
  technologies: [],
  annualCost: 0,
  lifecycle: 'Planned'
};

const emptyCapability: Omit<BusinessCapability, 'id'> = {
  name: '',
  domain: 'Shared Services',
  owner: '',
  description: '',
  parentId: ''
};

const emptyTechnology: Omit<TechnologyItem, 'id'> = {
  name: '',
  category: 'Backend',
  owner: '',
  lifecycle: 'approved',
  description: ''
};

export function CrudManager(props: CrudManagerProps) {
  const [activeTab, setActiveTab] = useState<EntityType>('integration');
  const selectedIntegration = props.modal?.entity === 'integration' ? props.integrations.find((item) => item.id === props.modal?.id) : undefined;
  const selectedApplication = props.modal?.entity === 'application' ? props.applications.find((item) => item.id === props.modal?.id) : undefined;
  const selectedCapability = props.modal?.entity === 'capability' ? props.capabilities.find((item) => item.id === props.modal?.id) : undefined;
  const selectedTechnology = props.modal?.entity === 'technology' ? props.technologies.find((item) => item.id === props.modal?.id) : undefined;

  return (
    <>
      <section className="managementPanel">
        <div className="managerHeader">
          <div>
            <h3>Repository Management</h3>
            <p>Create, edit and delete architecture repository objects.</p>
          </div>
          <div className="managerTabs">
            {(['application', 'integration', 'capability', 'technology'] as EntityType[]).map((tab) => (
              <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}s</button>
            ))}
          </div>
        </div>

        {activeTab === 'application' && (
          <EntityTable
            title="Applications"
            onAdd={() => props.onOpen({ entity: 'application', mode: 'create' })}
            headers={['Name', 'Domain', 'Owner', 'Status', 'Criticality']}
            rows={props.applications.map((app) => ({
              id: app.id,
              cells: [app.name, app.domain, app.owner, app.status, app.criticality],
              onOpen: () => props.onSelectApplication(app.id),
              onEdit: () => props.onOpen({ entity: 'application', mode: 'edit', id: app.id }),
              onDelete: () => props.deleteApplication(app.id)
            }))}
          />
        )}

        {activeTab === 'integration' && (
          <EntityTable
            title="Integrations"
            onAdd={() => props.onOpen({ entity: 'integration', mode: 'create' })}
            headers={['Source', 'Target', 'Type', 'Label', 'Criticality']}
            rows={props.integrations.map((item) => ({
              id: item.id,
              cells: [appName(props.applications, item.sourceId), appName(props.applications, item.targetId), item.type, item.label, item.criticality],
              onEdit: () => props.onOpen({ entity: 'integration', mode: 'edit', id: item.id }),
              onDelete: () => props.deleteIntegration(item.id)
            }))}
          />
        )}

        {activeTab === 'capability' && (
          <EntityTable
            title="Business Capabilities"
            onAdd={() => props.onOpen({ entity: 'capability', mode: 'create' })}
            headers={['Name', 'Domain', 'Owner', 'Parent', 'Description']}
            rows={props.capabilities.map((item) => ({
              id: item.id,
              cells: [item.name, item.domain, item.owner, props.capabilities.find((cap) => cap.id === item.parentId)?.name ?? '—', item.description],
              onEdit: () => props.onOpen({ entity: 'capability', mode: 'edit', id: item.id }),
              onDelete: () => props.deleteCapability(item.id)
            }))}
          />
        )}

        {activeTab === 'technology' && (
          <EntityTable
            title="Technologies"
            onAdd={() => props.onOpen({ entity: 'technology', mode: 'create' })}
            headers={['Name', 'Category', 'Owner', 'Lifecycle', 'Description']}
            rows={props.technologies.map((item) => ({
              id: item.id,
              cells: [item.name, item.category, item.owner, item.lifecycle, item.description],
              onEdit: () => props.onOpen({ entity: 'technology', mode: 'edit', id: item.id }),
              onDelete: () => props.deleteTechnology(item.id)
            }))}
          />
        )}
      </section>

      {props.modal?.entity === 'application' && (
        <ApplicationModal
          mode={props.modal.mode}
          initial={selectedApplication ?? emptyApplication}
          onClose={props.onClose}
          onSubmit={(value) => {
            if (props.modal?.mode === 'edit' && selectedApplication) props.updateApplication(selectedApplication.id, value);
            else props.createApplication(value);
            props.onClose();
          }}
        />
      )}

      {props.modal?.entity === 'integration' && (
        <IntegrationModal
          mode={props.modal.mode}
          applications={props.applications}
          initial={selectedIntegration ?? {
            sourceId: props.applications[0]?.id ?? '',
            targetId: props.applications[1]?.id ?? props.applications[0]?.id ?? '',
            type: 'REST',
            label: 'REST',
            criticality: 'medium'
          }}
          onClose={props.onClose}
          onSubmit={(value) => {
            if (props.modal?.mode === 'edit' && selectedIntegration) props.updateIntegration(selectedIntegration.id, value);
            else props.createIntegration(value);
            props.onClose();
          }}
        />
      )}

      {props.modal?.entity === 'capability' && (
        <CapabilityModal
          mode={props.modal.mode}
          capabilities={props.capabilities}
          initial={selectedCapability ?? emptyCapability}
          onClose={props.onClose}
          onSubmit={(value) => {
            if (props.modal?.mode === 'edit' && selectedCapability) props.updateCapability(selectedCapability.id, value);
            else props.createCapability(value);
            props.onClose();
          }}
        />
      )}

      {props.modal?.entity === 'technology' && (
        <TechnologyModal
          mode={props.modal.mode}
          initial={selectedTechnology ?? emptyTechnology}
          onClose={props.onClose}
          onSubmit={(value) => {
            if (props.modal?.mode === 'edit' && selectedTechnology) props.updateTechnology(selectedTechnology.id, value);
            else props.createTechnology(value);
            props.onClose();
          }}
        />
      )}
    </>
  );
}

interface EntityTableRow {
  id: string;
  cells: string[];
  onOpen?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function EntityTable({ title, headers, rows, onAdd }: { title: string; headers: string[]; rows: EntityTableRow[]; onAdd: () => void }) {
  return (
    <div className="entityTableWrap">
      <div className="entityTableHeader"><h4>{title} <span>({rows.length})</span></h4><button className="smallPrimary" onClick={onAdd}><Plus size={14} /> Create</button></div>
      <div className="entityTableScroll">
        <table className="entityTable">
          <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}<th>Actions</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} onDoubleClick={row.onOpen}>
                {row.cells.map((cell, index) => <td key={`${row.id}-${index}`}>{cell || '—'}</td>)}
                <td className="rowActions">
                  <button onClick={row.onEdit} title="Edit"><Edit2 size={14} /></button>
                  <button onClick={() => confirm('Delete this item?') && row.onDelete()} title="Delete"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ModalFrame({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="modalCard">
        <div className="modalHeader"><h3>{title}</h3><button onClick={onClose}><X size={18} /></button></div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="formField"><span>{label}</span>{children}</label>;
}

function ApplicationModal({ mode, initial, onClose, onSubmit }: { mode: Mode; initial: Omit<Application, 'id' | 'position'>; onClose: () => void; onSubmit: (value: Omit<Application, 'id' | 'position'>) => void }) {
  const [value, setValue] = useState(initial);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!value.name.trim()) return alert('Application name is required');
    onSubmit({ ...value, technologies: value.technologies.filter(Boolean) });
  }

  return (
    <ModalFrame title={`${mode === 'create' ? 'Create' : 'Edit'} Application`} onClose={onClose}>
      <form className="modalForm" onSubmit={submit}>
        <div className="formGrid">
          <Field label="Name"><input value={value.name} onChange={(e) => setValue({ ...value, name: e.target.value })} /></Field>
          <Field label="Domain"><input value={value.domain} onChange={(e) => setValue({ ...value, domain: e.target.value })} /></Field>
          <Field label="Owner"><input value={value.owner} onChange={(e) => setValue({ ...value, owner: e.target.value })} /></Field>
          <Field label="Lifecycle"><input value={value.lifecycle} onChange={(e) => setValue({ ...value, lifecycle: e.target.value })} /></Field>
          <Field label="Status"><select value={value.status} onChange={(e) => setValue({ ...value, status: e.target.value as AppStatus })}>{appStatuses.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Criticality"><select value={value.criticality} onChange={(e) => setValue({ ...value, criticality: e.target.value as Criticality })}>{criticalities.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Annual Cost"><input type="number" value={value.annualCost} onChange={(e) => setValue({ ...value, annualCost: Number(e.target.value) })} /></Field>
          <Field label="Technologies"><input value={value.technologies.join(', ')} onChange={(e) => setValue({ ...value, technologies: e.target.value.split(',').map((item) => item.trim()) })} placeholder="Java, Oracle, React" /></Field>
        </div>
        <Field label="Description"><textarea value={value.description} onChange={(e) => setValue({ ...value, description: e.target.value })} /></Field>
        <div className="modalActions"><button type="button" onClick={onClose}>Cancel</button><button className="primaryBtn" type="submit">Save Application</button></div>
      </form>
    </ModalFrame>
  );
}

function IntegrationModal({ mode, applications, initial, onClose, onSubmit }: { mode: Mode; applications: Application[]; initial: Omit<Integration, 'id'>; onClose: () => void; onSubmit: (value: Omit<Integration, 'id'>) => void }) {
  const [value, setValue] = useState(initial);
  const appOptions = useMemo(() => applications.map((app) => ({ id: app.id, name: app.name })), [applications]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!value.sourceId || !value.targetId) return alert('Source and target are required');
    if (value.sourceId === value.targetId) return alert('Source and target must be different');
    onSubmit(value);
  }

  return (
    <ModalFrame title={`${mode === 'create' ? 'Create' : 'Edit'} Integration`} onClose={onClose}>
      <form className="modalForm" onSubmit={submit}>
        <div className="formGrid">
          <Field label="Source Application"><select value={value.sourceId} onChange={(e) => setValue({ ...value, sourceId: e.target.value })}>{appOptions.map((app) => <option key={app.id} value={app.id}>{app.name}</option>)}</select></Field>
          <Field label="Target Application"><select value={value.targetId} onChange={(e) => setValue({ ...value, targetId: e.target.value })}>{appOptions.map((app) => <option key={app.id} value={app.id}>{app.name}</option>)}</select></Field>
          <Field label="Type"><select value={value.type} onChange={(e) => setValue({ ...value, type: e.target.value as IntegrationType, label: e.target.value })}>{integrationTypes.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Label"><input value={value.label} onChange={(e) => setValue({ ...value, label: e.target.value })} /></Field>
          <Field label="Criticality"><select value={value.criticality} onChange={(e) => setValue({ ...value, criticality: e.target.value as Criticality })}>{criticalities.map((item) => <option key={item}>{item}</option>)}</select></Field>
        </div>
        <div className="modalActions"><button type="button" onClick={onClose}>Cancel</button><button className="primaryBtn" type="submit">Save Integration</button></div>
      </form>
    </ModalFrame>
  );
}

function CapabilityModal({ mode, capabilities, initial, onClose, onSubmit }: { mode: Mode; capabilities: BusinessCapability[]; initial: Omit<BusinessCapability, 'id'>; onClose: () => void; onSubmit: (value: Omit<BusinessCapability, 'id'>) => void }) {
  const [value, setValue] = useState(initial);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!value.name.trim()) return alert('Capability name is required');
    onSubmit({ ...value, parentId: value.parentId || undefined });
  }

  return (
    <ModalFrame title={`${mode === 'create' ? 'Create' : 'Edit'} Business Capability`} onClose={onClose}>
      <form className="modalForm" onSubmit={submit}>
        <div className="formGrid">
          <Field label="Name"><input value={value.name} onChange={(e) => setValue({ ...value, name: e.target.value })} /></Field>
          <Field label="Domain"><input value={value.domain} onChange={(e) => setValue({ ...value, domain: e.target.value })} /></Field>
          <Field label="Owner"><input value={value.owner} onChange={(e) => setValue({ ...value, owner: e.target.value })} /></Field>
          <Field label="Parent Capability"><select value={value.parentId ?? ''} onChange={(e) => setValue({ ...value, parentId: e.target.value })}><option value="">No parent</option>{capabilities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
        </div>
        <Field label="Description"><textarea value={value.description} onChange={(e) => setValue({ ...value, description: e.target.value })} /></Field>
        <div className="modalActions"><button type="button" onClick={onClose}>Cancel</button><button className="primaryBtn" type="submit">Save Capability</button></div>
      </form>
    </ModalFrame>
  );
}

function TechnologyModal({ mode, initial, onClose, onSubmit }: { mode: Mode; initial: Omit<TechnologyItem, 'id'>; onClose: () => void; onSubmit: (value: Omit<TechnologyItem, 'id'>) => void }) {
  const [value, setValue] = useState(initial);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!value.name.trim()) return alert('Technology name is required');
    onSubmit(value);
  }

  return (
    <ModalFrame title={`${mode === 'create' ? 'Create' : 'Edit'} Technology Item`} onClose={onClose}>
      <form className="modalForm" onSubmit={submit}>
        <div className="formGrid">
          <Field label="Name"><input value={value.name} onChange={(e) => setValue({ ...value, name: e.target.value })} /></Field>
          <Field label="Category"><input value={value.category} onChange={(e) => setValue({ ...value, category: e.target.value })} /></Field>
          <Field label="Owner"><input value={value.owner} onChange={(e) => setValue({ ...value, owner: e.target.value })} /></Field>
          <Field label="Lifecycle"><select value={value.lifecycle} onChange={(e) => setValue({ ...value, lifecycle: e.target.value as TechnologyLifecycle })}>{technologyLifecycles.map((item) => <option key={item}>{item}</option>)}</select></Field>
        </div>
        <Field label="Description"><textarea value={value.description} onChange={(e) => setValue({ ...value, description: e.target.value })} /></Field>
        <div className="modalActions"><button type="button" onClick={onClose}>Cancel</button><button className="primaryBtn" type="submit">Save Technology</button></div>
      </form>
    </ModalFrame>
  );
}
