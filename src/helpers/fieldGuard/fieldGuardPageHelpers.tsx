import { Tag, CalendarDays } from "lucide-react";
import FieldGuardStatusIcon from "../../components/FieldGuard/FieldGuardStatusIcon";
import { formatIsraeliDateTime } from "../formatting/israeliDate";
type RecentEntry = {
  _id: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "ACCEPTED" | "REJECTED" | "PENDING" | "NEW" | "IN PROGRESS" | "RESOLVED";
  createdAt: string;
};

type RecentPanelProps = {
  title: string;
  prefix: "Issue" | "Report";
  entries: RecentEntry[];
};

function formatDate(value: string) {
  return formatIsraeliDateTime(value);
}

export function RecentPanel({ title, prefix, entries }: RecentPanelProps) {
  const recentEntries = entries
    .map((entry, index) => ({
      ...entry,
      displayId: `${prefix}-${String(index + 1).padStart(3, "0")}`,
    }))
    .slice(-5)
    .reverse();

  return (
    <section className="field-guard-panel field-guard-recent-panel">
      <div className="field-guard-panel-heading">
        <div>
          <p className="field-guard-eyebrow">ACTIVITY</p>
          <h2>{title}</h2>
        </div>
        <span className="field-guard-panel-count">{recentEntries.length}</span>
      </div>
      <ul className="field-guard-record-list">
        {recentEntries.map((entry) => (
          <li className="field-guard-record" key={entry._id}>
            <span
              className={`field-guard-priority-dot field-guard-priority-dot--${entry.priority.toLowerCase()}`}
              role="img"
              aria-label={`${entry.priority.toLowerCase()} priority`}
              title={`${entry.priority.toLowerCase()} priority`}
            />
            <div className="field-guard-record-content">
              <p className="field-guard-record-title" title={entry.description}>
                {entry.description}
              </p>
              <div className="field-guard-record-meta">
                <span><Tag aria-hidden="true" />{entry.displayId}</span>
                <time dateTime={entry.createdAt}><CalendarDays aria-hidden="true" />{formatDate(entry.createdAt)}</time>
              </div>
            </div>
            <span className={`field-guard-status field-guard-status--${entry.status.toLowerCase().replaceAll(" ", "-")}`}>
              <FieldGuardStatusIcon status={entry.status} />{entry.status}
            </span>
          </li>
        ))}
      </ul>
      {recentEntries.length === 0 ? <p className="field-guard-empty">No entries yet.</p> : null}
    </section>
  );
}