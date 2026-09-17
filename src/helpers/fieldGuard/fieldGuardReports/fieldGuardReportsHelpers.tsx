import { Tag, CalendarDays, User, MapPin, FileText, Flag, Phone } from "lucide-react";
import FieldGuardStatusIcon from "../../../components/FieldGuard/FieldGuardStatusIcon";
import type { fieldGuardData } from "../../../data/fieldGuardData";

type GuardReport = (typeof fieldGuardData.reports)[number];
type DisplayReport = GuardReport & { displayId: string };
type ReportsListProps = {
  reports: DisplayReport[];
  emptyMessage: string;
  selectedReportId: string | null;
  onSelectReport: (reportId: string) => void;
};

type ReportDetailsProps = {
  report: DisplayReport | null;
  onChangeStatus: (reportId: string) => void;
};

type ReportFiltersProps = {
  status: string;
  priority: string;
  setStatus: (value: string) => void;
  setPriority: (value: string) => void;
};

function formatDate(value: string) {
  const date = new Date(value);

  return `${date.toLocaleDateString("en-GB")} @ ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function ReportFilters({ status, priority, setStatus, setPriority }: ReportFiltersProps) {

  return (
    <div className="reports-filters">
      <div className="reports-filter">
        <span id="reports-status-label">Status</span>
        <div className="choice-row" role="group" aria-labelledby="reports-status-label">
          {["All", "New", "In Progress", "Resolved", "Rejected"].map((value) => (
            <button
              key={value}
              type="button"
              className={`choice-box ${status === value ? "selected" : ""}`}
              onClick={() => setStatus(value)}
              aria-pressed={status === value}
            >
              <FieldGuardStatusIcon status={value} />{value}
            </button>
          ))}
        </div>
      </div>
      <div className="reports-filter">
        <span id="reports-priority-label">Priority</span>
        <div className="choice-row" role="group" aria-labelledby="reports-priority-label">
          {["All", "Low", "Medium", "High"].map((value) => (
            <button
              key={value}
              type="button"
              className={`choice-box ${priority === value ? "selected" : ""}`}
              onClick={() => setPriority(value)}
              aria-pressed={priority === value}
            >
              <FieldGuardStatusIcon status={value} />{value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReportsList({ reports, emptyMessage, selectedReportId, onSelectReport }: ReportsListProps) {
  if (reports.length === 0) {
    return <p className="field-guard-empty" role="status">{emptyMessage}</p>;
  }
  return (
    <ul className="reports-list">
      {reports.map((report) => (
        <li
          className={`report-row ${selectedReportId === report._id ? "report-row-selected" : ""}`}
          key={report._id}
          onClick={() => onSelectReport(report._id)}
        >
          <span
            className={`field-guard-priority priority-${report.priority.toLowerCase()}`}
            role="img"
            aria-label={`${report.priority.toLowerCase()} priority`}
            title={`${report.priority.toLowerCase()} priority`}
          />
          <div className="report-content">
            <div className="report-line">
              <div className="report-identification">
                <span className="field-guard-icon-text"><Tag className="field-guard-icon" aria-hidden="true" />{report.displayId}</span>
                <span>{report.category}</span>
              </div>
              <span className={`field-guard-status status-${report.status.toLowerCase().replaceAll(" ", "-")}`}>
                <FieldGuardStatusIcon status={report.status} />{report.status}
              </span>
            </div>
            <div className="report-line">
              <h2>
                <button
                  type="button"
                  className="report-select-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectReport(report._id);
                  }}
                  aria-pressed={selectedReportId === report._id}
                >
                  {report.title}
                </button>
              </h2>
              <time className="field-guard-icon-text" dateTime={report.createdAt}><CalendarDays className="field-guard-icon" aria-hidden="true" />{formatDate(report.createdAt)}</time>
            </div>
            <p className="report-description" title={report.description}>
              {report.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ReportDetails({ report, onChangeStatus }: ReportDetailsProps) {
  if (!report) {
    return (
      <section className="reports-side-panel report-details">
        <p className="field-guard-empty">Select a report to view its details.</p>
      </section>
    );
  }

  return (
    <section className="reports-side-panel report-details" aria-label={`Details for ${report.displayId}`}>
      <div className="report-details-header">
        <h2 className="field-guard-icon-text"><Tag className="field-guard-icon" aria-hidden="true" />{report.displayId}</h2>
        <span className={`field-guard-status status-${report.status.toLowerCase().replaceAll(" ", "-")}`}>
          <FieldGuardStatusIcon status={report.status} />{report.status}
        </span>
      </div>
      <dl className="report-details-fields">
        <div className="report-details-field">
          <dt className="field-guard-icon-text"><User className="field-guard-icon" aria-hidden="true" />Citizen</dt>
          <dd><span>{report.residentName}</span><span className="field-guard-icon-text"><Phone className="field-guard-icon" aria-hidden="true" />{report.residentPhone}</span></dd>
        </div>
        <div className="report-details-field">
          <dt className="field-guard-icon-text"><Tag className="field-guard-icon" aria-hidden="true" />Category</dt><dd>{report.category}</dd>
        </div>
        <div className="report-details-field">
          <dt className="field-guard-icon-text"><MapPin className="field-guard-icon" aria-hidden="true" />Location</dt><dd>{report.location}</dd>
        </div>
        <div className="report-details-field">
          <dt className="field-guard-icon-text"><FileText className="field-guard-icon" aria-hidden="true" />Description</dt><dd>{report.description}</dd>
        </div>
        <div className="report-details-field">
          <dt className="field-guard-icon-text"><Flag className="field-guard-icon" aria-hidden="true" />Priority</dt>
          <dd>
            <div className="report-details-priority">
              <span className={`field-guard-priority priority-${report.priority.toLowerCase()}`} aria-hidden="true" />
              <span>{report.priority}</span>
            </div>
          </dd>
        </div>
        <div className="report-details-field">
          <dd><time className="field-guard-icon-text" dateTime={report.createdAt}><CalendarDays className="field-guard-icon" aria-hidden="true" />{formatDate(report.createdAt)}</time></dd>
        </div>
      </dl>
      {report.status === "NEW" && (
        <button type="button" className="report-action report-take-action" onClick={() => onChangeStatus(report._id)}>
          Take action
        </button>
      )}
      {report.status === "IN PROGRESS" && (
        <button type="button" className="report-action report-abort" onClick={() => onChangeStatus(report._id)}>
          Abort
        </button>
      )}
    </section>
  );
}
