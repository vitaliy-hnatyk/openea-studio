import { Application } from '../types/architecture';

interface StatusDonutProps { apps: Application[]; }

export function StatusDonut({ apps }: StatusDonutProps) {
  const active = apps.filter((app) => app.status === 'active').length;
  const planned = apps.filter((app) => app.status === 'planned').length;
  const deprecated = apps.filter((app) => app.status === 'deprecated').length;
  const retired = apps.filter((app) => app.status === 'retired').length;
  const total = Math.max(apps.length, 1);
  const a = (active / total) * 100;
  const p = (planned / total) * 100;
  const d = (deprecated / total) * 100;
  const gradient = `conic-gradient(#57c946 0 ${a}%, #3f8cff ${a}% ${a + p}%, #ff7b22 ${a + p}% ${a + p + d}%, #94a3b8 ${a + p + d}% 100%)`;

  return (
    <section className="bottomCard donutCard">
      <div className="cardHeader"><h3>Applications by Status</h3></div>
      <div className="donutWrap">
        <div className="donut" style={{ background: gradient }}><div><strong>{apps.length}</strong><span>Total</span></div></div>
        <div className="donutLegend">
          <div><i style={{ background: '#57c946' }} />Active <b>{active}</b></div>
          <div><i style={{ background: '#3f8cff' }} />Planned <b>{planned}</b></div>
          <div><i style={{ background: '#ff7b22' }} />Deprecated <b>{deprecated}</b></div>
          <div><i style={{ background: '#94a3b8' }} />Retired <b>{retired}</b></div>
        </div>
      </div>
    </section>
  );
}
