import FieldGuardStatusIcon from "../components/FieldGuard/FieldGuardStatusIcon";
import { fieldGuardData } from "../data/fieldGuardData";
import { RecentPanel } from "../helpers/fieldGuard/fieldGuardPageHelpers";

export default function FieldGuardPage() {
  const { name, issues, reports } = fieldGuardData;
  const acceptedCount = issues.filter(
    (issue) => issue.status === "ACCEPTED",
  ).length;
  const rejectedCount = issues.filter(
    (issue) => issue.status === "REJECTED",
  ).length;

  return (
    <section
      className="field-guard-overview"
      aria-labelledby="field-guard-title"
    >
      <div className="field-guard-overview-heading">
        <h1 id="field-guard-title">Field Guard Overview</h1>
        <p>{name}</p>
      </div>

      <dl className="field-guard-stats">
        <div className="field-guard-stat">
          <dt>ISSUES HANDLED</dt>
          <dd>{issues.length}</dd>
        </div>
        <div className="field-guard-stat">
          <dt className="field-guard-icon-text">
            <FieldGuardStatusIcon status="ACCEPTED" />
            ISSUES ACCEPTED
          </dt>
          <dd className="field-guard-count-accepted">{acceptedCount}</dd>
        </div>
        <div className="field-guard-stat">
          <dt className="field-guard-icon-text">
            <FieldGuardStatusIcon status="REJECTED" />
            ISSUES REJECTED
          </dt>
          <dd className="field-guard-count-rejected">{rejectedCount}</dd>
        </div>
        <div className="field-guard-stat">
          <dt>REPORTS HANDLED</dt>
          <dd className="field-guard-count-reports">{reports.length}</dd>
        </div>
      </dl>
      <div className="field-guard-recent-panels">
        <RecentPanel title="Recent issues" prefix="Issue" entries={issues} />
        <RecentPanel title="Recent reports" prefix="Report" entries={reports} />
      </div>
    </section>
  );
}
