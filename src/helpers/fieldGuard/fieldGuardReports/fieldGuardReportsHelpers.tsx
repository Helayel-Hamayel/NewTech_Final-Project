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
    <div>
      <div>
        <span id="reports-status-label">Status</span>
        <div role="group" aria-labelledby="reports-status-label">
          {["All", "New", "In Progress", "Resolved", "Rejected"].map((value) => (
            <button
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
      <div>
        <span id="reports-priority-label">Priority</span>
        <div role="group" aria-labelledby="reports-priority-label">
          {["All", "Low", "Medium", "High"].map((value) => (
            <button
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
    return <p role="status">{emptyMessage}</p>;
  }
  return (
    <ul>
      {reports.map((report) => (
        <li

          key={report._id}
          onClick={() => onSelectReport(report._id)}
        >
          <span

            role="img"
            aria-label={`${report.priority.toLowerCase()} priority`}
            title={`${report.priority.toLowerCase()} priority`}
          />
          <div>
            <div>
              <div>
                <span><Tag aria-hidden="true" />{report.displayId}</span>
                <span>{report.category}</span>
              </div>
              <span>
                <FieldGuardStatusIcon status={report.status} />{report.status}
              </span>
            </div>
            <div>
              <h2>
                <button
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
              <time dateTime={report.createdAt}><CalendarDays aria-hidden="true" />{formatDate(report.createdAt)}</time>
            </div>
            <p title={report.description}>
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
      <section>
        <p>Select a report to view its details.</p>
      </section>
    );
  }

  return (
    <section aria-label={`Details for ${report.displayId}`}>
      <div>
        <h2><Tag aria-hidden="true" />{report.displayId}</h2>
        <span>
          <FieldGuardStatusIcon status={report.status} />{report.status}
        </span>
      </div>
      <dl>
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
        <button type="button" onClick={() => onChangeStatus(report._id)}>
          Take action
        </button>
      )}
      {report.status === "IN PROGRESS" && (
        <button type="button" onClick={() => onChangeStatus(report._id)}>
          Abort
        </button>
      )}
    </section>
  );
}
