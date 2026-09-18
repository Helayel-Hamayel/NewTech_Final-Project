import FieldGuardStatusIcon from "../../components/FieldGuard/FieldGuardStatusIcon";
import { useState } from "react";
import { fieldGuardData } from "../../data/fieldGuardData";
import {
  prepareHistoryIssues,
  getHistoryCounts,
  filterHistoryIssues,
  formatCost,
} from "../../helpers/fieldGuard/fieldGuardHistory/fieldGuardHistoryHelpers";
import { HistoryFilters, HistoryList, HistoryDetails } from "../../helpers/fieldGuard/fieldGuardHistory/fieldGuardHistoryComponents";


export default function FieldGuardHistoryPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const issues = prepareHistoryIssues(fieldGuardData.issues);
  const counts = getHistoryCounts(issues);
  const visibleIssues = filterHistoryIssues(issues, search, status);
  const selectedIssue = issues.find((issue) => issue._id === selectedId) ?? null;

  return (
    <section aria-labelledby="history-title">
      <div>
        <h1 id="history-title">Issue History</h1>
        <p>Review issued violations, their status, and estimated costs.</p>
      </div>
      <dl>
        <div>
          <dt>Total issues</dt>
          <dd>{counts.total}</dd>
        </div>
        <div>
          <dt><FieldGuardStatusIcon status="ACCEPTED" />Accepted</dt>
          <dd>{counts.accepted}</dd>
        </div>
        <div>
          <dt><FieldGuardStatusIcon status="REJECTED" />Rejected</dt>
          <dd>{counts.rejected}</dd>
        </div>
        <div>
          <dt>Total cost</dt>
          <dd>{formatCost(counts.totalCost)}</dd>
        </div>
      </dl>
      <div>
        <section aria-label="Issues">
          <HistoryFilters search={search} status={status} setSearch={setSearch} setStatus={setStatus} />
          <HistoryList issues={visibleIssues} selectedId={selectedId} onSelect={setSelectedId} />
          <p role="status">
            {visibleIssues.length} out of {issues.length} issues
          </p>
        </section>
        <HistoryDetails issue={selectedIssue} />
      </div>
    </section>
  );
}
