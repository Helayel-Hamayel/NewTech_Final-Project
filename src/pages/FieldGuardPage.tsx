import FieldGuardStatusIcon from "../components/FieldGuard/FieldGuardStatusIcon";
import { fieldGuardData, type FieldGuardIssue } from "../data/fieldGuardData";
import { RecentPanel } from "../helpers/fieldGuard/fieldGuardPageHelpers";
import "../styles/pages/FieldGuard/FieldGuardPage.css";

type FieldGuardPageProps = {
  issues: FieldGuardIssue[];
};

export default function FieldGuardPage({ issues }: FieldGuardPageProps) {
  const { name, reports } = fieldGuardData;
  const acceptedCount = issues.filter(
    (issue) => issue.status === "ACCEPTED",
  ).length;
  const rejectedCount = issues.filter(
    (issue) => issue.status === "REJECTED",
  ).length;

  return (
    <section className="field-guard-screen field-guard-overview" aria-labelledby="field-guard-title">
      <div className="field-guard-page-heading">
        <p className="field-guard-eyebrow">OFFICER WORKSPACE</p>
        <h1 id="field-guard-title">Field Guard Overview</h1>
        <p>Welcome back, {name}. Here is your activity at a glance.</p>
      </div>

      <dl className="field-guard-stat-grid">
        <div className="field-guard-stat-card">
          <dt>ISSUES HANDLED</dt>
          <dd>{issues.length}</dd>
        </div>
        <div className="field-guard-stat-card field-guard-stat-card--accepted">
          <dt>
            <FieldGuardStatusIcon status="ACCEPTED" />
            ISSUES ACCEPTED
          </dt>
          <dd>{acceptedCount}</dd>
        </div>
        <div className="field-guard-stat-card field-guard-stat-card--rejected">
          <dt>
            <FieldGuardStatusIcon status="REJECTED" />
            ISSUES REJECTED
          </dt>
          <dd>{rejectedCount}</dd>
        </div>
        <div className="field-guard-stat-card">
          <dt>REPORTS HANDLED</dt>
          <dd>{reports.length}</dd>
        </div>
      </dl>
      <div className="field-guard-overview-panels">
        <RecentPanel title="Recent issues" prefix="Issue" entries={issues} />
        <RecentPanel title="Recent reports" prefix="Report" entries={reports} />
      </div>
    </section>
  );
}
