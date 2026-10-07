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
    <div className="field-guard-history-filters">
      <div className="field-guard-history-search">
        <label htmlFor="history-search">Search by issue number or plate</label>
        <input id="history-search" type="search" placeholder="Issue-001 or 12-345-67" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="field-guard-filter-options" role="group" aria-label="Issue status">
        {["All", "Accepted", "Pending", "Rejected"].map((value) => (
          <button
            className="field-guard-filter-button"
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
      <p className="field-guard-empty" role="status">
        No issues match your search and filters.
      </p>
    );
  }
  return (
    <ul className="field-guard-record-list field-guard-history-list">
      {issues.map((issue) => (
        <li
          className={`field-guard-history-row${selectedId === issue._id ? " is-selected" : ""}`}
          key={issue._id}
          onClick={() => onSelect(issue._id)}>
          <span
            className={`field-guard-priority-dot field-guard-priority-dot--${issue.priority.toLowerCase()}`}
            role="img"
            aria-label={`${issue.priority.toLowerCase()} priority`}
            title={`${issue.priority.toLowerCase()} priority`}
          />
          <div className="field-guard-history-content">
            <h2>
              <button
                className="field-guard-record-title-button"
                type="button"
                aria-pressed={selectedId === issue._id}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(issue._id);
                }}>
                {issue.name}
              </button>
            </h2>
            <div className="field-guard-record-meta">
              <span><Tag aria-hidden="true" />{issue.displayId}</span>
              <span>{issue.violationType}</span>
              <time dateTime={issue.createdAt}><CalendarDays aria-hidden="true" />{formatHistoryDate(issue.createdAt)}</time>
            </div>
          </div>
          <div className="field-guard-history-summary">
            <span className="field-guard-history-cost">{formatCost(issue.amount)}</span>
            <span className={`field-guard-status field-guard-status--${issue.status.toLowerCase().replaceAll(" ", "-")}`}>
              <FieldGuardStatusIcon status={issue.status} />{issue.status}
            </span>
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
      <section className="field-guard-details-empty">
        <p>Select an issue to view its details.</p>
      </section>
    );
  }
  return (
    <section className="field-guard-issue-details" aria-label={`Details for ${issue.displayId}`}>
      <div className="field-guard-details-heading">
        <div>
          <p className="field-guard-eyebrow">ISSUE DETAILS</p>
          <h2><Tag aria-hidden="true" />{issue.displayId}</h2>
        </div>
        <span className={`field-guard-status field-guard-status--${issue.status.toLowerCase().replaceAll(" ", "-")}`}>
          <FieldGuardStatusIcon status={issue.status} />{issue.status}
        </span>
      </div>
      <dl className="field-guard-detail-list">
        <div>
          <dt><FileText aria-hidden="true" />Description</dt>
          <dd>{issue.description}</dd>
        </div>
        <div>
          <dt><Coins aria-hidden="true" />Indicative fine</dt>
          <dd>{formatCost(issue.amount)}</dd>
        </div>
        {issue.vehicleRegistration ? (
          <div>
            <dt>Vehicle registration</dt>
            <dd>{issue.vehicleRegistration}</dd>
          </div>
        ) : null}
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
