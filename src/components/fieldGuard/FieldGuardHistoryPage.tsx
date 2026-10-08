import FieldGuardStatusIcon from "./FieldGuardStatusIcon";
import { useState } from "react";
import {
  prepareHistoryIssues,
  getHistoryCounts,
  filterHistoryIssues,
  formatCost,
} from "../../helpers/fieldGuard/fieldGuardHistory/fieldGuardHistoryHelpers";
import { HistoryFilters, HistoryList, HistoryDetails } from "../../helpers/fieldGuard/fieldGuardHistory/fieldGuardHistoryComponents";
import "../../styles/pages/FieldGuard/FieldGuardHistoryPage.css";
import type { FieldGuardIssue } from "../../data/fieldGuardData";

type FieldGuardHistoryPageProps = {
  issues: FieldGuardIssue[];
};

export default function FieldGuardHistoryPage({
  issues: sourceIssues,
}: FieldGuardHistoryPageProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const issues = prepareHistoryIssues(sourceIssues);
  const counts = getHistoryCounts(issues);
  const visibleIssues = filterHistoryIssues(issues, search, status);
  const selectedIssue = issues.find((issue) => issue._id === selectedId) ?? null;

  return (
    <section className="field-guard-screen field-guard-history" aria-labelledby="history-title">
      <div className="field-guard-page-heading">
        <p className="field-guard-eyebrow">CITATION RECORDS</p>
        <h1 id="history-title">Issue History</h1>
        <p>Review issued citations, their status, and indicative fines.</p>
      </div>
      <dl className="field-guard-stat-grid field-guard-history-stats">
        <div className="field-guard-stat-card">
          <dt>Total issues</dt>
          <dd>{counts.total}</dd>
        </div>
        <div className="field-guard-stat-card field-guard-stat-card--accepted">
          <dt><FieldGuardStatusIcon status="ACCEPTED" />Accepted</dt>
          <dd>{counts.accepted}</dd>
        </div>
        <div className="field-guard-stat-card field-guard-stat-card--rejected">
          <dt><FieldGuardStatusIcon status="REJECTED" />Rejected</dt>
          <dd>{counts.rejected}</dd>
        </div>
        <div className="field-guard-stat-card">
          <dt>Total indicative fines</dt>
          <dd>{formatCost(counts.totalCost)}</dd>
        </div>
      </dl>
      <div className="field-guard-workspace">
        <section className="field-guard-panel field-guard-history-list-panel" aria-label="Issues">
          <HistoryFilters search={search} status={status} setSearch={setSearch} setStatus={setStatus} />
          <HistoryList issues={visibleIssues} selectedId={selectedId} onSelect={setSelectedId} />
          <p className="field-guard-result-count" role="status">
            {visibleIssues.length} out of {issues.length} issues
          </p>
        </section>
        <div className="field-guard-panel field-guard-history-details-panel">
          <HistoryDetails issue={selectedIssue} />
        </div>
      </div>
    </section>
  );
}
