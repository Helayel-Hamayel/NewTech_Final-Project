import FieldGuardStatusIcon from "../../components/FieldGuard/FieldGuardStatusIcon";
import { useState } from "react";
import { fieldGuardData } from "../../data/fieldGuardData";
import { ReportFilters, ReportsList, ReportDetails } from "../../helpers/fieldGuard/fieldGuardReports/fieldGuardReportsHelpers";
import { getReportCounts } from "../../helpers/fieldGuard/fieldGuardReports/fieldGuardReportCounts";
import { filterReports } from "../../helpers/fieldGuard/fieldGuardReports/fieldGuardReportFilters";
import "../../styles/pages/FieldGuard/FieldGuardReportsPage.css";

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
    <section className="field-guard-screen field-guard-reports" aria-labelledby="reports-title">
      <div className="field-guard-page-heading">
        <p className="field-guard-eyebrow">CITIZEN SUBMISSIONS</p>
        <h1 id="reports-title">Reports</h1>
        <p>Review reports and track their progress.</p>
      </div>
      <dl className="field-guard-stat-grid field-guard-report-stats">
        <div className="field-guard-stat-card">
          <dt>Total reports</dt>
          <dd>{counts.total}</dd>
        </div>
        <div className="field-guard-stat-card field-guard-stat-card--new">
          <dt><FieldGuardStatusIcon status="NEW" />New</dt>
          <dd>{counts.new}</dd>
        </div>
        <div className="field-guard-stat-card field-guard-stat-card--progress">
          <dt><FieldGuardStatusIcon status="IN PROGRESS" />In progress</dt>
          <dd>{counts.inProgress}</dd>
        </div>
        <div className="field-guard-stat-card field-guard-stat-card--resolved">
          <dt><FieldGuardStatusIcon status="RESOLVED" />Resolved / <FieldGuardStatusIcon status="REJECTED" />Rejected</dt>
          <dd>
            <span>{counts.resolved} </span>/<span> {counts.rejected}</span>
          </dd>
        </div>
      </dl>
      <div className="field-guard-workspace">
        <section className="field-guard-panel field-guard-report-list-panel" aria-label="Reports list">
          <ReportFilters status={status} priority={priority} setStatus={setStatus} setPriority={setPriority} />
          <ReportsList
            reports={filteredReports}
            selectedReportId={selectedReportId}
            onSelectReport={setSelectedReportId}
            emptyMessage={reports.length === 0 ? "No reports yet." : "No reports match these filters."}
          />
        </section>
        <div className="field-guard-panel field-guard-report-details-panel">
          <ReportDetails report={selectedReport} onChangeStatus={changeReportStatus} />
        </div>
      </div>
    </section>
  );
}
