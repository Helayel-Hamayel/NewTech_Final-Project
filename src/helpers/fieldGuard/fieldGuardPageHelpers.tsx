import { Tag, CalendarDays } from "lucide-react";
import FieldGuardStatusIcon from "../../components/fieldGuard/FieldGuardStatusIcon";
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
  const date = new Date(value);
  return `${date.toLocaleDateString("en-GB")} @ ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
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
    <section className="field-guard-recent-panel">
      <h2>{title}</h2>
      <ul className="field-guard-recent-list">
        {recentEntries.map((entry) => (
          <li className="field-guard-recent-row" key={entry._id}>
            <span
              className={`field-guard-priority priority-${entry.priority.toLowerCase()}`}
              role="img"
              aria-label={`${entry.priority.toLowerCase()} priority`}
              title={`${entry.priority.toLowerCase()} priority`}
            />
            <div className="field-guard-entry-content">
              <p className="field-guard-entry-description" title={entry.description}>
                {entry.description}
              </p>
              <div className="field-guard-entry-meta">
                <span className="field-guard-icon-text"><Tag className="field-guard-icon" aria-hidden="true" />{entry.displayId}</span>
                <time className="field-guard-icon-text" dateTime={entry.createdAt}><CalendarDays className="field-guard-icon" aria-hidden="true" />{formatDate(entry.createdAt)}</time>
              </div>
            </div>
            <span
              className={`field-guard-status status-${entry.status.toLowerCase().replaceAll(" ", "-")}`}
            >
              <FieldGuardStatusIcon status={entry.status} />{entry.status}
            </span>
          </li>
        ))}
      </ul>
      {recentEntries.length === 0 && (
        <p className="field-guard-empty">No entries yet.</p>
      )}
    </section>
  );
}