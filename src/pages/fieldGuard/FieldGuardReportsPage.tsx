import { useState } from "react";
import "../../styles/pages/FieldGuard/FieldGuardPage.css";
import "../../styles/pages/FieldGuard/FieldGuardReportsPage.css";
import { fieldGuardData } from "../../data/fieldGuardData(Demo)";
import { ReportFilters, ReportsList, ReportDetails } from "../../helpers/fieldGuard/fieldGuardReports/fieldGuardReportsHelpers";
import { getReportCounts } from "../../helpers/fieldGuard/fieldGuardReports/fieldGuardReportCounts";
import { filterReports } from "../../helpers/fieldGuard/fieldGuardReports/fieldGuardReportFilters";

export default function FieldGuardReportsPage() {
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [reports, setReports] = useState(fieldGuardData.reports);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const counts = getReportCounts(reports);
  const filteredReports = filterReports(reports, status, priority);
  const selectedReport = filterReports(reports, "All", "All").find((report) => report._id === selectedReportId) ?? null;

  function changeReportStatus(reportId: string) {
    setReports((currentReports) =>
      currentReports.map((report) => {
        if (report._id !== reportId) return report;
        if (report.status === "NEW") return { ...report, status: "IN PROGRESS" };
        if (report.status === "IN PROGRESS") return { ...report, status: "NEW" };
        return report;
      }),
    );
  }

  return (
    <section className="field-guard-overview" aria-labelledby="reports-title">
      <div className="field-guard-overview-heading">
        <h1 id="reports-title">Reports</h1>
        <p>Review reports and track their progress.</p>
      </div>
      <dl className="field-guard-stats">
        <div className="field-guard-stat">
          <dt>Total reports</dt>
          <dd>{counts.total}</dd>
        </div>
        <div className="field-guard-stat">
          <dt>New</dt>
          <dd className="reports-blue">{counts.new}</dd>
        </div>
        <div className="field-guard-stat">
          <dt>In progress</dt>
          <dd className="reports-orange">{counts.inProgress}</dd>
        </div>
        <div className="field-guard-stat">
          <dt>Resolved / Rejected</dt>
          <dd>
            <span className="reports-green">{counts.resolved} </span>/<span className="reports-red"> {counts.rejected}</span>
          </dd>
        </div>
      </dl>
      <div className="reports-panels">
        <section className="reports-list-panel" aria-label="Reports list">
          <ReportFilters status={status} priority={priority} setStatus={setStatus} setPriority={setPriority} />
          <ReportsList
            reports={filteredReports}
            selectedReportId={selectedReportId}
            onSelectReport={setSelectedReportId}
            emptyMessage={reports.length === 0 ? "No reports yet." : "No reports match these filters."}
          />
        </section>
        <ReportDetails report={selectedReport} onChangeStatus={changeReportStatus} />
      </div>
    </section>
  );
}
