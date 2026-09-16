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
    <div className="history-filters">
      <div className="history-search">
        <label htmlFor="history-search">Search by issue number</label>
        <input id="history-search" type="search" placeholder="Issue-001"
          value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <div className="choice-row" role="group" aria-label="Issue status">
        {["All", "Accepted", "Pending", "Rejected"].map((value) => (
          <button key={value} type="button"
            className={`choice-box ${status === value ? "selected" : ""}`}
            onClick={() => setStatus(value)} aria-pressed={status === value}>
            {value}
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
    return <p className="field-guard-empty" role="status">No issues match your search and filters.</p>;
  }
  return (
    <ul className="history-list">
      {issues.map((issue) => (
        <li key={issue._id}
          className={`history-row ${selectedId === issue._id ? "history-row-selected" : ""}`}
          onClick={() => onSelect(issue._id)}>
          <span className={`field-guard-priority priority-${issue.priority.toLowerCase()}`}
            role="img" aria-label={`${issue.priority.toLowerCase()} priority`}
            title={`${issue.priority.toLowerCase()} priority`} />
          <div className="history-row-content">
            <h2>
              <button type="button" className="history-select-button"
                aria-pressed={selectedId === issue._id}
                onClick={(event) => { event.stopPropagation(); onSelect(issue._id); }}>
                {issue.name}
              </button>
            </h2>
            <div className="history-row-meta">
              <span>{issue.displayId}</span>
              <span>{issue.violationType}</span>
              <time dateTime={issue.createdAt}>{formatHistoryDate(issue.createdAt)}</time>
            </div>
          </div>
          <div className="history-row-summary">
            <span className="history-gold">{formatCost(issue.amount)}</span>
            <span className={`field-guard-status status-${issue.status.toLowerCase()}`}>{issue.status}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function HistoryDetails({ issue }: { issue: HistoryIssue | null }) {
  if (!issue) {
    return <section className="history-panel history-details">
      <p className="field-guard-empty">Select an issue to view its details.</p>
    </section>;
  }
  return (
    <section className="history-panel history-details" aria-label={`Details for ${issue.displayId}`}>
      <div className="history-details-header">
        <h2>{issue.displayId}</h2>
        <span className={`field-guard-status status-${issue.status.toLowerCase()}`}>{issue.status}</span>
      </div>
      <dl className="history-details-fields">
        <div className="history-field"><dt>Problem</dt><dd>{issue.description}</dd></div>
        <div className="history-field">
          <dt>Estimated cost</dt>
          <dd className="history-cost-box history-gold">{formatCost(issue.amount)}</dd>
        </div>
        <div className="history-detail-pair">
          <div className="history-field"><dt>Category</dt><dd>{issue.violationType}</dd></div>
          <div className="history-field"><dt>Priority</dt><dd>{issue.priority}</dd></div>
        </div>
        <div className="history-field"><dt>Location</dt><dd>{issue.location}</dd></div>
        <div className="history-detail-pair">
          <div className="history-field">
            <dt>Submitted</dt>
            <dd><time dateTime={issue.createdAt}>{formatHistoryDate(issue.createdAt)}</time></dd>
          </div>
          <div className="history-field">
            <dt>Resolved</dt>
            <dd>{issue.status !== "PENDING" && issue.resolvedAt ? (
              <time dateTime={issue.resolvedAt}>{formatHistoryDate(issue.resolvedAt)}</time>
            ) : "Not resolved yet"}</dd>
          </div>
        </div>
      </dl>
    </section>
  );
}
