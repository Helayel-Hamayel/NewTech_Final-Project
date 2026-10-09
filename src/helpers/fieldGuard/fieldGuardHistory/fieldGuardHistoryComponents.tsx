import { Tag, CalendarDays, FileText, Coins } from "lucide-react";
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
    <section className="field-guard-history-filters">
      <section className="field-guard-history-search">
        <label htmlFor="history-search">Search by fine number, plate, or violation</label>
        <input
          id="history-search"
          type="search"
          placeholder="Fine number or license plate"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>
      <section className="field-guard-filter-options" role="group" aria-label="Fine status">
        {["All", "Unpaid", "Paid"].map((value) => (
          <button
            className="field-guard-filter-button"
            key={value}
            type="button"
            onClick={() => setStatus(value)}
            aria-pressed={status === value}>
            <FieldGuardStatusIcon status={value} />
            {value}
          </button>
        ))}
      </section>
    </section>
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
        No fines match your search and filters.
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
          <section className="field-guard-history-content">
            <h2>
              <button
                className="field-guard-record-title-button"
                type="button"
                aria-pressed={selectedId === issue._id}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(issue._id);
                }}>
                {issue.violationType}
              </button>
            </h2>
            <section className="field-guard-record-meta">
              <span>
                <Tag aria-hidden="true" />
                {issue.displayId}
              </span>
              <span>{issue.licensePlate}</span>
              <time dateTime={issue.createdAt}>
                <CalendarDays aria-hidden="true" />
                {formatHistoryDate(issue.createdAt)}
              </time>
            </section>
          </section>
          <section className="field-guard-history-summary">
            <span className="field-guard-history-cost">{formatCost(issue.amount)}</span>
            <span className={`field-guard-status field-guard-status--${issue.status === "PAID" ? "accepted" : "new"}`}>
              {" "}
              <FieldGuardStatusIcon status={issue.status} />
              {issue.status}
            </span>
          </section>
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
        <p>Select a fine to view its details.</p>
      </section>
    );
  }
  return (
    <section className="field-guard-issue-details" aria-label={`Details for ${issue.displayId}`}>
      <header className="field-guard-details-heading">
        <section>
          <p className="field-guard-eyebrow">FINE DETAILS</p>
          <h2>
            <Tag aria-hidden="true" />
            {issue.displayId}
          </h2>
        </section>
        <span className={`field-guard-status field-guard-status--${issue.status === "PAID" ? "accepted" : "new"}`}>
          <FieldGuardStatusIcon status={issue.status} />
          {issue.status}
        </span>
      </header>
      <dl className="field-guard-detail-list">
        <div>
          <dt>
            <FileText aria-hidden="true" />
            Violation
          </dt>
          <dd>{issue.violationType}</dd>
        </div>

        <div>
          <dt>
            <Coins aria-hidden="true" />
            Fine amount
          </dt>
          <dd>{formatCost(issue.amount)}</dd>
        </div>

        <div>
          <dt>Vehicle registration</dt>
          <dd>{issue.licensePlate}</dd>
        </div>

        <div>
          <dt>Issued at</dt>
          <dd>
            <time dateTime={issue.createdAt}>
              <CalendarDays aria-hidden="true" />
              {formatHistoryDate(issue.createdAt)}
            </time>
          </dd>
        </div>

        {issue.photoUrl && (
          <div>
            <dt>Photo evidence</dt>
            <dd>
              <a href={issue.photoUrl} target="_blank" rel="noopener noreferrer">
                View photo
              </a>
            </dd>
          </div>
        )}

        {issue.resolvedAt && (
          <div>
            <dt>Resolved at</dt>
            <dd>
              <time dateTime={issue.resolvedAt}>
                <CalendarDays aria-hidden="true" />
                {formatHistoryDate(issue.resolvedAt)}
              </time>
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
