import { Tag, CalendarDays } from "lucide-react";
import FieldGuardStatusIcon from "../../components/FieldGuard/FieldGuardStatusIcon";
import { formatIsraeliDateTime } from "../formatting/israeliDate";
type RecentEntry = {
  _id: string;
  description: string;
  status: "UNPAID" | "PAID" | "NEW" | "DISPATCHED" | "IN PROGRESS" | "RESOLVED" | "REJECTED";
  createdAt: string;
};

type RecentPanelProps = {
  title: string;
  prefix: "Fine" | "Report";
  entries: RecentEntry[];
};

function formatDate(value: string) {
  return formatIsraeliDateTime(value);
}

export function RecentPanel({ title, prefix, entries }: RecentPanelProps) {
  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)
    .map((entry) => ({
      ...entry,
      displayId: `${prefix}-${entry._id.slice(-8)}`,
    }));
  return (
    <section className="field-guard-panel field-guard-recent-panel">
      <header className="field-guard-panel-heading">
        <section>
          <p className="field-guard-eyebrow">ACTIVITY</p>
          <h2>{title}</h2>
        </section>
        <span className="field-guard-panel-count">{recentEntries.length}</span>
      </header>
      <ul className="field-guard-record-list">
        {recentEntries.map((entry) => (
          <li className="field-guard-record" key={entry._id}>
            <section className="field-guard-record-content">
              <p className="field-guard-record-title" title={entry.description}>
                {entry.description}
              </p>
              <section className="field-guard-record-meta">
                <span>
                  <Tag aria-hidden="true" />
                  {entry.displayId}
                </span>
                <time dateTime={entry.createdAt}>
                  <CalendarDays aria-hidden="true" />
                  {formatDate(entry.createdAt)}
                </time>
              </section>
            </section>
            <span
              className={`field-guard-status field-guard-status--${
                entry.status === "PAID"
                  ? "accepted"
                  : entry.status === "UNPAID" || entry.status === "DISPATCHED"
                    ? "new"
                    : entry.status.toLowerCase().replaceAll(" ", "-")
              }`}>
              <FieldGuardStatusIcon status={entry.status} />
              {entry.status}
            </span>
          </li>
        ))}
      </ul>
      {recentEntries.length === 0 ? <p className="field-guard-empty">No entries yet.</p> : null}
    </section>
  );
}
