import { RoadmapItem } from '../types/architecture';

interface RoadmapPanelProps { items: RoadmapItem[]; }

export function RoadmapPanel({ items }: RoadmapPanelProps) {
  return (
    <section className="bottomCard roadmapCard">
      <div className="cardHeader"><h3>Roadmap <span>(Next 6 Months)</span></h3><button>View all</button></div>
      <div className="roadmapList">
        {items.map((item) => (
          <div key={item.id}>
            <span>{item.title}</span>
            <em className={item.status}>{item.status}</em>
            <small>{item.due}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
