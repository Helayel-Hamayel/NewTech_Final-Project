import { Tag, CalendarDays, User, MapPin, FileText, Flag, Phone } from "lucide-react";
import FieldGuardStatusIcon from "../../../components/FieldGuard/FieldGuardStatusIcon";
import type { fieldGuardData } from "../../../data/fieldGuardData";
import { formatIsraeliDateTime } from "../../formatting/israeliDate";

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
  return formatIsraeliDateTime(value);
}

export function ReportFilters({ status, priority, setStatus, setPriority }: ReportFiltersProps) {

  return (
    <div className="field-guard-filters">
      <div className="field-guard-filter-group">
        <span className="field-guard-filter-label" id="reports-status-label">Status</span>
        <div className="field-guard-filter-options" role="group" aria-labelledby="reports-status-label">
          {["All", "New", "In Progress", "Resolved", "Rejected"].map((value) => (
            <button
              className="field-guard-filter-button"
              key={value}
              type="button"
              onClick={() => setStatus(value)}
              aria-pressed={status === value}
            >
              <FieldGuardStatusIcon status={value} />{value}
            </button>
          ))}
        </div>
      </div>
      <div className="field-guard-filter-group">
        <span className="field-guard-filter-label" id="reports-priority-label">Priority</span>
        <div className="field-guard-filter-options" role="group" aria-labelledby="reports-priority-label">
          {["All", "Low", "Medium", "High"].map((value) => (
            <button
              className="field-guard-filter-button"
              key={value}
              type="button"
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
    <ul className="field-guard-record-list field-guard-report-list">
      {reports.map((report) => (
        <li
          className={`field-guard-report-row${selectedReportId === report._id ? " is-selected" : ""}`}
          key={report._id}
          onClick={() => onSelectReport(report._id)}
        >
          <span
            className={`field-guard-priority-dot field-guard-priority-dot--${report.priority.toLowerCase()}`}
            role="img"
            aria-label={`${report.priority.toLowerCase()} priority`}
            title={`${report.priority.toLowerCase()} priority`}
          />
          <div className="field-guard-report-row-content">
            <div className="field-guard-report-row-top">
              <div className="field-guard-record-meta">
                <span><Tag aria-hidden="true" />{report.displayId}</span>
                <span className="field-guard-category">{report.category}</span>
              </div>
              <span className={`field-guard-status field-guard-status--${report.status.toLowerCase().replaceAll(" ", "-")}`}>
                <FieldGuardStatusIcon status={report.status} />{report.status}
              </span>
            </div>
            <div className="field-guard-report-row-heading">
              <h2>
                <button
                  className="field-guard-record-title-button"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectReport(report._id);
                  }}
                  aria-pressed={selectedReportId === report._id}
                >
                  {report.title}
                </button>
              </h2>
              <time className="field-guard-record-date" dateTime={report.createdAt}><CalendarDays aria-hidden="true" />{formatDate(report.createdAt)}</time>
            </div>
            <p className="field-guard-report-description" title={report.description}>
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
      <section className="field-guard-details-empty">
        <p>Select a report to view its details.</p>
      </section>
    );
  }

  return (
    <section className="field-guard-report-details" aria-label={`Details for ${report.displayId}`}>
      <div className="field-guard-details-heading">
        <div>
          <p className="field-guard-eyebrow">REPORT DETAILS</p>
          <h2><Tag aria-hidden="true" />{report.displayId}</h2>
        </div>
        <span className={`field-guard-status field-guard-status--${report.status.toLowerCase().replaceAll(" ", "-")}`}>
          <FieldGuardStatusIcon status={report.status} />{report.status}
        </span>
      </div>
      <dl className="field-guard-detail-list">
        <div>
          <dt><User aria-hidden="true" />Citizen</dt>
          <dd><span>{report.residentName}</span><span><Phone aria-hidden="true" />{report.residentPhone}</span></dd>
        </div>
        <div>
          <dt><Tag aria-hidden="true" />Category</dt><dd>{report.category}</dd>
        </div>
        <div>
          <dt><MapPin aria-hidden="true" />Location</dt><dd>{report.location}</dd>
        </div>
        <div>
          <dt><FileText aria-hidden="true" />Description</dt><dd>{report.description}</dd>
        </div>
        <div>
          <dt><Flag aria-hidden="true" />Priority</dt>
          <dd>
            <div>
              <span aria-hidden="true" />
              <span>{report.priority}</span>
            </div>
          </dd>
        </div>
        <div>
          <dd><time dateTime={report.createdAt}><CalendarDays aria-hidden="true" />{formatDate(report.createdAt)}</time></dd>
        </div>
      </dl>
      {report.status === "NEW" && (
        <button className="field-guard-primary-action" type="button" onClick={() => onChangeStatus(report._id)}>
          Take action
        </button>
      )}
      {report.status === "IN PROGRESS" && (
        <button className="field-guard-secondary-action" type="button" onClick={() => onChangeStatus(report._id)}>
          Abort
        </button>
      )}
    </section>
  );
}
