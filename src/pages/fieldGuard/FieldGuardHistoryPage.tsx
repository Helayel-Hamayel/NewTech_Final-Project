import { useState } from "react";
import { fieldGuardData } from "../../data/fieldGuardData(Demo)";
import { prepareHistoryIssues, getHistoryCounts, filterHistoryIssues, formatCost } from "../../helpers/fieldGuard/fieldGuardHistory/fieldGuardHistoryHelpers";
import { HistoryFilters, HistoryList, HistoryDetails } from "../../helpers/fieldGuard/fieldGuardHistory/fieldGuardHistoryComponents";
import "../../styles/pages/FieldGuard/FieldGuardPage.css";
import "../../styles/common/fieldGuard/FieldGuardChoices.css";
import "../../styles/pages/FieldGuard/FieldGuardHistoryPage.css";

export default function FieldGuardHistoryPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const issues = prepareHistoryIssues(fieldGuardData.issues);
  const counts = getHistoryCounts(issues);
  const visibleIssues = filterHistoryIssues(issues, search, status);
  const selectedIssue = issues.find((issue) => issue._id === selectedId) ?? null;

  return (
    <section className="field-guard-overview history-page" aria-labelledby="history-title">
      <div className="field-guard-overview-heading">
        <h1 id="history-title">Issue History</h1>
        <p>Review issued violations, their status, and estimated costs.</p>
      </div>
      <dl className="field-guard-stats">
        <div className="field-guard-stat"><dt>Total issues</dt><dd>{counts.total}</dd></div>
        <div className="field-guard-stat"><dt>Accepted</dt><dd className="field-guard-count-accepted">{counts.accepted}</dd></div>
        <div className="field-guard-stat"><dt>Rejected</dt><dd className="field-guard-count-rejected">{counts.rejected}</dd></div>
        <div className="field-guard-stat"><dt>Total cost</dt><dd className="history-gold">{formatCost(counts.totalCost)}</dd></div>
      </dl>
      <div className="history-panels">
        <section className="history-panel history-list-panel" aria-label="Issues">
          <HistoryFilters search={search} status={status} setSearch={setSearch} setStatus={setStatus} />
          <HistoryList issues={visibleIssues} selectedId={selectedId} onSelect={setSelectedId} />
          <p className="history-result-count" role="status">{visibleIssues.length} out of {issues.length} issues</p>
        </section>
        <HistoryDetails issue={selectedIssue} />
      </div>
    </section>
  );
}
