import FieldGuardStatusIcon from "../../components/FieldGuard/FieldGuardStatusIcon";
import { useState } from "react";
import { fieldGuardData } from "../../data/fieldGuardData";
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
    <section aria-labelledby="reports-title">
      <div>
        <h1 id="reports-title">Reports</h1>
        <p>Review reports and track their progress.</p>
      </div>
      <dl>
        <div>
          <dt>Total reports</dt>
          <dd>{counts.total}</dd>
        </div>
        <div>
          <dt><FieldGuardStatusIcon status="NEW" />New</dt>
          <dd>{counts.new}</dd>
        </div>
        <div>
          <dt><FieldGuardStatusIcon status="IN PROGRESS" />In progress</dt>
          <dd>{counts.inProgress}</dd>
        </div>
        <div>
          <dt><FieldGuardStatusIcon status="RESOLVED" />Resolved / <FieldGuardStatusIcon status="REJECTED" />Rejected</dt>
          <dd>
            <span>{counts.resolved} </span>/<span> {counts.rejected}</span>
          </dd>
        </div>
      </dl>
      <div>
        <section aria-label="Reports list">
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
