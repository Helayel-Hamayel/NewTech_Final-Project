import FieldGuardStatusIcon from "./FieldGuardStatusIcon";
import { useEffect, useState } from "react";
import type { FineFromBackend } from "../../data/fineData";
import {
  prepareHistoryIssues,
  getHistoryCounts,
  filterHistoryIssues,
  formatCost,
} from "../../helpers/fieldGuard/fieldGuardHistory/fieldGuardHistoryHelpers";
import { HistoryFilters, HistoryList, HistoryDetails } from "../../helpers/fieldGuard/fieldGuardHistory/fieldGuardHistoryComponents";
import "../../styles/pages/FieldGuard/FieldGuardHistoryPage.css";

export default function FieldGuardHistoryPage() {
  const [sourceIssues, setSourceIssues] = useState<FineFromBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const issues = prepareHistoryIssues(sourceIssues);
  const counts = getHistoryCounts(issues);
  const visibleIssues = filterHistoryIssues(issues, search, status);
  const selectedIssue = visibleIssues.find((issue) => issue._id === selectedId) ?? null;

  function selectIssue(id: string) {
    setSelectedId((currentId) => (currentId === id ? null : id));
  }

  function changeSearch(value: string) {
    setSearch(value);
    setSelectedId(null);
  }

  function changeFilter(value: string) {
    setStatus(value);
    setSelectedId(null);
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadFines() {
      try {
        const response = await fetch("http://localhost:4000/fines", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load your fines.");
        }

        const data: FineFromBackend[] = await response.json();

        if (!controller.signal.aborted) {
          setSourceIssues(data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error instanceof Error ? error.message : "Could not load your fines.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadFines();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <section className="field-guard-screen field-guard-history">
        <p role="status">Loading fines...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="field-guard-screen field-guard-history">
        <p role="alert">{error}</p>
      </section>
    );
  }

  return (
    <section className="field-guard-screen field-guard-history" aria-labelledby="history-title">
      <header className="field-guard-page-heading">
        <p className="field-guard-eyebrow">CITATION RECORDS</p>
        <h1 id="history-title">Issue History</h1>
        <p>Review issued citations, their status, and indicative fines.</p>
      </header>
      <dl className="field-guard-stat-grid field-guard-history-stats">
        <div className="field-guard-stat-card">
          <dt>Total issues</dt>
          <dd>{counts.total}</dd>
        </div>
        <div className="field-guard-stat-card field-guard-stat-card--new">
          <dt>
            <FieldGuardStatusIcon status="UNPAID" />
            Unpaid
          </dt>
          <dd>{counts.unpaid}</dd>
        </div>

        <div className="field-guard-stat-card field-guard-stat-card--accepted">
          <dt>
            <FieldGuardStatusIcon status="PAID" />
            Paid
          </dt>
          <dd>{counts.paid}</dd>
        </div>
        <div className="field-guard-stat-card">
          <dt>Total indicative fines</dt>
          <dd>{formatCost(counts.totalCost)}</dd>
        </div>
      </dl>
      <section className="field-guard-workspace">
        <section className="field-guard-panel field-guard-history-list-panel" aria-label="Issues">
          <HistoryFilters search={search} status={status} setSearch={changeSearch} setStatus={changeFilter} />

          <HistoryList issues={visibleIssues} selectedId={selectedId} onSelect={selectIssue} />
          <p className="field-guard-result-count" role="status">
            {visibleIssues.length} out of {issues.length} issues
          </p>
        </section>
        <section className="field-guard-panel field-guard-history-details-panel" aria-label="Selected issue details">
          <HistoryDetails issue={selectedIssue} />
        </section>
      </section>
    </section>
  );
}
