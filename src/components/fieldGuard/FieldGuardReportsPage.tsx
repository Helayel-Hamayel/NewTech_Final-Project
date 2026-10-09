import { useEffect, useState } from "react";
import type { ReportFromBackend } from "../../data/staffData";
import "../../styles/pages/FieldGuard/FieldGuardReportsPage.css";
import { Tag, CalendarDays, User, MapPin, FileText, Phone } from "lucide-react";
import FieldGuardStatusIcon from "./FieldGuardStatusIcon";

type ReportAction = "IN PROGRESS" | "RESOLVED" | "REJECTED";

const statusLabels: Record<ReportFromBackend["status"], string> = {
  NEW: "New",
  DISPATCHED: "Dispatched",
  "IN PROGRESS": "In Progress",
  RESOLVED: "Resolved",
  REJECTED: "Rejected",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    timeZone: "Asia/Jerusalem",
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function FieldGuardReportsPage() {
  const [reports, setReports] = useState<ReportFromBackend[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadReports() {
      try {
        const response = await fetch("http://localhost:4000/reports", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load your reports.");
        }

        const data: ReportFromBackend[] = await response.json();

        if (!controller.signal.aborted) {
          setReports(data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(error instanceof Error ? error.message : "Could not load your reports.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadReports();

    return () => controller.abort();
  }, []);

  const filteredReports = reports.filter((report) => statusFilter === "All" || report.status === statusFilter);

  const selectedReport = filteredReports.find((report) => report._id === selectedReportId) ?? null;

  const canAct = selectedReport?.status === "DISPATCHED" || selectedReport?.status === "IN PROGRESS";

  function selectReport(id: string) {
    if (saving) return;

    setSelectedReportId((currentId) => (currentId === id ? null : id));
    setRejectionReason("");
    setActionError("");
  }

  function changeFilter(value: string) {
    if (saving) return;

    setStatusFilter(value);

    if (selectedReport && value !== "All" && selectedReport.status === value) {
      return;
    }

    if (selectedReport && value === "All") {
      return;
    }

    setSelectedReportId(null);
    setRejectionReason("");
    setActionError("");
  }

  async function changeStatus(status: ReportAction) {
    if (!selectedReport || saving || !canAct) return;

    if (status === "REJECTED" && !rejectionReason.trim()) {
      setActionError("Enter a rejection reason.");
      return;
    }

    setSaving(true);
    setActionError("");

    try {
      const response = await fetch(`http://localhost:4000/reports/${selectedReport._id}/field-guard-status`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          rejectionReason: status === "REJECTED" ? rejectionReason.trim() : "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(errorData?.message ?? "Could not update the report.");
      }

      const updatedReport: ReportFromBackend = await response.json();

      setReports((currentReports) => currentReports.map((report) => (report._id === updatedReport._id ? updatedReport : report)));

      setRejectionReason("");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not update the report.");
    } finally {
      setSaving(false);
    }
  }
  function statusClass(status: ReportFromBackend["status"]) {
    return status === "DISPATCHED" ? "new" : status.toLowerCase().replaceAll(" ", "-");
  }
  return (
    <section className="field-guard-screen field-guard-reports" aria-labelledby="reports-title">
      <header className="field-guard-page-heading">
        <p className="field-guard-eyebrow">CITIZEN SUBMISSIONS</p>
        <h1 id="reports-title">Reports</h1>
        <p>Review your assigned reports and update their progress.</p>
      </header>

      {loading ? (
        <p role="status">Loading reports...</p>
      ) : loadError ? (
        <p role="alert">{loadError}</p>
      ) : (
        <>
          <dl className="field-guard-stat-grid field-guard-report-stats">
            <div className="field-guard-stat-card">
              <dt>Total reports</dt>
              <dd>{reports.length}</dd>
            </div>

            <div className="field-guard-stat-card field-guard-stat-card--new">
              <dt>
                <FieldGuardStatusIcon status="DISPATCHED" />
                Dispatched
              </dt>
              <dd>{reports.filter((report) => report.status === "DISPATCHED").length}</dd>
            </div>

            <div className="field-guard-stat-card field-guard-stat-card--progress">
              <dt>
                <FieldGuardStatusIcon status="IN PROGRESS" />
                In progress
              </dt>
              <dd>{reports.filter((report) => report.status === "IN PROGRESS").length}</dd>
            </div>

            <div className="field-guard-stat-card field-guard-stat-card--resolved">
              <dt>
                <FieldGuardStatusIcon status="RESOLVED" />
                Resolved / <FieldGuardStatusIcon status="REJECTED" />
                Rejected
              </dt>
              <dd>
                {reports.filter((report) => report.status === "RESOLVED").length}
                {" / "}
                {reports.filter((report) => report.status === "REJECTED").length}
              </dd>
            </div>
          </dl>

          <section className="field-guard-workspace">
            <section className="field-guard-panel field-guard-report-list-panel" aria-label="Reports list">
              <section className="field-guard-filters">
                <section className="field-guard-filter-group">
                  <span className="field-guard-filter-label" id="reports-status-label">
                    Status
                  </span>

                  <section className="field-guard-filter-options" role="group" aria-labelledby="reports-status-label">
                    {(["All", "DISPATCHED", "IN PROGRESS", "RESOLVED", "REJECTED"] as const).map((value) => (
                      <button
                        className="field-guard-filter-button"
                        key={value}
                        type="button"
                        disabled={saving}
                        aria-pressed={statusFilter === value}
                        onClick={() => changeFilter(value)}>
                        <FieldGuardStatusIcon status={value} />
                        {value === "All" ? "All" : statusLabels[value]}
                      </button>
                    ))}
                  </section>
                </section>
              </section>
              {filteredReports.length === 0 ? (
                <p className="field-guard-empty" role="status">
                  No reports match this view.
                </p>
              ) : (
                <ul className="field-guard-record-list field-guard-report-list">
                  {filteredReports.map((report) => (
                    <li
                      key={report._id}
                      className={`field-guard-report-row${selectedReportId === report._id ? " is-selected" : ""}`}
                      onClick={() => {
                        if (!saving) selectReport(report._id);
                      }}>
                      <section className="field-guard-report-row-content">
                        <section className="field-guard-report-row-top">
                          <section className="field-guard-record-meta">
                            <span title={report._id}>
                              <Tag aria-hidden="true" />
                              {report._id.slice(-8)}
                            </span>
                            <span className="field-guard-category">{report.category}</span>
                          </section>

                          <span className={`field-guard-status field-guard-status--${statusClass(report.status)}`}>
                            <FieldGuardStatusIcon status={report.status} />
                            {statusLabels[report.status]}
                          </span>
                        </section>

                        <header className="field-guard-report-row-heading">
                          <h2>
                            <button
                              className="field-guard-record-title-button"
                              type="button"
                              disabled={saving}
                              aria-pressed={selectedReportId === report._id}
                              onClick={(event) => {
                                event.stopPropagation();
                                selectReport(report._id);
                              }}>
                              {report.category}
                            </button>
                          </h2>

                          <time className="field-guard-record-date" dateTime={report.createdAt}>
                            <CalendarDays aria-hidden="true" />
                            {formatDate(report.createdAt)}
                          </time>
                        </header>

                        <p className="field-guard-report-description" title={report.description}>
                          {report.description}
                        </p>
                      </section>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="field-guard-panel field-guard-report-details-panel" aria-label="Report details">
              {!selectedReport ? (
                <section className="field-guard-details-empty">
                  <p>Select a report to view its details.</p>
                </section>
              ) : (
                <section className="field-guard-report-details">
                  <header className="field-guard-details-heading">
                    <section>
                      <p className="field-guard-eyebrow">REPORT DETAILS</p>
                      <h2 title={selectedReport._id}>
                        <Tag aria-hidden="true" />
                        {selectedReport._id.slice(-8)}
                      </h2>
                    </section>

                    <span className={`field-guard-status field-guard-status--${statusClass(selectedReport.status)}`}>
                      <FieldGuardStatusIcon status={selectedReport.status} />
                      {statusLabels[selectedReport.status]}
                    </span>
                  </header>

                  <dl className="field-guard-detail-list">
                    <div>
                      <dt>
                        <User aria-hidden="true" />
                        Citizen
                      </dt>
                      <dd>
                        <span>{selectedReport.resident?.name ?? "Unknown resident"}</span>
                        <span>
                          <Phone aria-hidden="true" />
                          {selectedReport.phone}
                        </span>
                      </dd>
                    </div>

                    <div>
                      <dt>
                        <Tag aria-hidden="true" />
                        Category
                      </dt>
                      <dd>{selectedReport.category}</dd>
                    </div>

                    <div>
                      <dt>
                        <MapPin aria-hidden="true" />
                        Location
                      </dt>
                      <dd>{selectedReport.location}</dd>
                    </div>

                    <div>
                      <dt>
                        <FileText aria-hidden="true" />
                        Description
                      </dt>
                      <dd>{selectedReport.description}</dd>
                    </div>

                    <div>
                      <dt>
                        <CalendarDays aria-hidden="true" />
                        Reported at
                      </dt>
                      <dd>
                        <time dateTime={selectedReport.createdAt}>{formatDate(selectedReport.createdAt)}</time>
                      </dd>
                    </div>

                    {selectedReport.photoUrl && (
                      <div>
                        <dt>Photo</dt>
                        <dd>
                          <a href={selectedReport.photoUrl} target="_blank" rel="noopener noreferrer">
                            View photo
                          </a>
                        </dd>
                      </div>
                    )}

                    {(selectedReport.status === "RESOLVED" || selectedReport.status === "REJECTED") && selectedReport.resolvedAt && (
                      <div>
                        <dt>
                          <CalendarDays aria-hidden="true" />
                          {selectedReport.status === "REJECTED" ? "Rejected at" : "Completed at"}
                        </dt>
                        <dd>
                          <time dateTime={selectedReport.resolvedAt}>{formatDate(selectedReport.resolvedAt)}</time>
                        </dd>
                      </div>
                    )}

                    {selectedReport.status === "REJECTED" && (
                      <div>
                        <dt>Rejection reason</dt>
                        <dd>{selectedReport.rejectionReason}</dd>
                      </div>
                    )}
                  </dl>

                  {canAct && (
                    <>
                      <button
                        className="field-guard-primary-action"
                        type="button"
                        disabled={saving}
                        onClick={() => changeStatus(selectedReport.status === "DISPATCHED" ? "IN PROGRESS" : "RESOLVED")}>
                        {selectedReport.status === "DISPATCHED" ? "Start work" : "Mark completed"}
                      </button>

                      <form
                        className="field-guard-report-rejection"
                        onSubmit={(event) => {
                          event.preventDefault();
                          void changeStatus("REJECTED");
                        }}>
                        <label htmlFor="guard-rejection-reason">Rejection reason</label>
                        <textarea
                          id="guard-rejection-reason"
                          required
                          value={rejectionReason}
                          disabled={saving}
                          onChange={(event) => setRejectionReason(event.target.value)}
                        />

                        <button className="field-guard-secondary-action" type="submit" disabled={saving || !rejectionReason.trim()}>
                          Reject report
                        </button>
                      </form>
                    </>
                  )}

                  {saving && <p role="status">Saving...</p>}
                  {actionError && <p role="alert">{actionError}</p>}
                </section>
              )}
            </section>
          </section>
        </>
      )}
    </section>
  );
}
