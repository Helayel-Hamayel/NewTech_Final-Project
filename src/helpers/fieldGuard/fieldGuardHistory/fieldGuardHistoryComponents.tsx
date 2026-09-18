import { Tag, CalendarDays, MapPin, FileText, Flag, Coins } from "lucide-react";
import FieldGuardStatusIcon from "../../../components/FieldGuard/FieldGuardStatusIcon";
import { formatCost, formatHistoryDate } from "./fieldGuardHistoryHelpers";
import type { HistoryIssue } from "./fieldGuardHistoryHelpers";

type HistoryFiltersProps = {
  search: string;
  status: string;
  setSearch: (value: string) => void;
  setStatus: (value: string) => void;
}; 

export function HistoryFilters({ search, status, setSearch, setStatus }: HistoryFiltersProps) {
  return (
    <div>
      <div>
        <label htmlFor="history-search">Search by issue number</label>
        <input id="history-search" type="search" placeholder="Issue-001" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div role="group" aria-label="Issue status">
        {["All", "Accepted", "Pending", "Rejected"].map((value) => (
          <button
            key={value}
            type="button"

            onClick={() => setStatus(value)}
            aria-pressed={status === value}>
            <FieldGuardStatusIcon status={value} />{value}
          </button>
        ))}
      </div>
    </div>
  );
}

type HistoryListProps = {
  issues: HistoryIssue[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function HistoryList({ issues, selectedId, onSelect }: HistoryListProps) {
  if (issues.length === 0) {
    return (
      <p role="status">
        No issues match your search and filters.
      </p>
    );
  }
  return (
    <ul>
      {issues.map((issue) => (
        <li
          key={issue._id}

          onClick={() => onSelect(issue._id)}>
          <span

            role="img"
            aria-label={`${issue.priority.toLowerCase()} priority`}
            title={`${issue.priority.toLowerCase()} priority`}
          />
          <div>
            <h2>
              <button
                type="button"

                aria-pressed={selectedId === issue._id}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(issue._id);
                }}>
                {issue.name}
              </button>
            </h2>
            <div>
              <span><Tag aria-hidden="true" />{issue.displayId}</span>
              <span>{issue.violationType}</span>
              <time dateTime={issue.createdAt}><CalendarDays aria-hidden="true" />{formatHistoryDate(issue.createdAt)}</time>
            </div>
          </div>
          <div>
            <span>{formatCost(issue.amount)}</span>
            <span><FieldGuardStatusIcon status={issue.status} />{issue.status}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

type SelectedIssue = { issue: HistoryIssue | null };

export function HistoryDetails({ issue }: SelectedIssue) {
  if (!issue) {
    return (
      <section>
        <p>Select an issue to view its details.</p>
      </section>
    );
  }
  return (
    <section aria-label={`Details for ${issue.displayId}`}>
      <div>
        <h2><Tag aria-hidden="true" />{issue.displayId}</h2>
        <span><FieldGuardStatusIcon status={issue.status} />{issue.status}</span>
      </div>
      <dl>
        <div>
          <dt><FileText aria-hidden="true" />Description</dt>
          <dd>{issue.description}</dd>
        </div>
        <div>
          <dt><Coins aria-hidden="true" />Estimated cost</dt>
          <dd>{formatCost(issue.amount)}</dd>
        </div>
        <div>
          <div>
            <dt><Tag aria-hidden="true" />Category</dt>
            <dd>{issue.violationType}</dd>
          </div>
          <div>
            <dt><Flag aria-hidden="true" />Priority</dt>
            <dd>
              <span aria-hidden="true" />
              <span>{issue.priority}</span>
            </dd>
          </div>
        </div>
        <div>
          <dt><MapPin aria-hidden="true" />Location</dt>
          <dd>{issue.location}</dd>
        </div>
        <div>
          <div>
            <dt>Submitted</dt>
            <dd>
              <time dateTime={issue.createdAt}><CalendarDays aria-hidden="true" />{formatHistoryDate(issue.createdAt)}</time>
            </dd>
          </div>
          <div>
            <dt>Resolved</dt>
            <dd>
              {issue.status !== "PENDING" && issue.resolvedAt ? (
                <time dateTime={issue.resolvedAt}><CalendarDays aria-hidden="true" />{formatHistoryDate(issue.resolvedAt)}</time>
              ) : (
                "Not resolved yet"
              )}
            </dd>
          </div>
        </div>
      </dl>
    </section>
  );
}
