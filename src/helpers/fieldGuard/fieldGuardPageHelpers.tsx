import { Tag, CalendarDays } from "lucide-react";
import FieldGuardStatusIcon from "../../components/FieldGuard/FieldGuardStatusIcon";
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
    <section>
      <h2>{title}</h2>
      <ul>
        {recentEntries.map((entry) => (
          <li key={entry._id}>
            <span

              role="img"
              aria-label={`${entry.priority.toLowerCase()} priority`}
              title={`${entry.priority.toLowerCase()} priority`}
            />
            <div>
              <p title={entry.description}>
                {entry.description}
              </p>
              <div>
                <span><Tag aria-hidden="true" />{entry.displayId}</span>
                <time dateTime={entry.createdAt}><CalendarDays aria-hidden="true" />{formatDate(entry.createdAt)}</time>
              </div>
            </div>
            <span

            >
              <FieldGuardStatusIcon status={entry.status} />{entry.status}
            </span>
          </li>
        ))}
      </ul>
      {recentEntries.length === 0 && (
        <p>No entries yet.</p>
      )}
    </section>
  );
}