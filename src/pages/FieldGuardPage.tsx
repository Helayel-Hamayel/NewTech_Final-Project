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

      aria-labelledby="field-guard-title"
    >
      <div>
        <h1 id="field-guard-title">Field Guard Overview</h1>
        <p>{name}</p>
      </div>

      <dl>
        <div>
          <dt>ISSUES HANDLED</dt>
          <dd>{issues.length}</dd>
        </div>
        <div>
          <dt>
            <FieldGuardStatusIcon status="ACCEPTED" />
            ISSUES ACCEPTED
          </dt>
          <dd>{acceptedCount}</dd>
        </div>
        <div>
          <dt>
            <FieldGuardStatusIcon status="REJECTED" />
            ISSUES REJECTED
          </dt>
          <dd>{rejectedCount}</dd>
        </div>
        <div>
          <dt>REPORTS HANDLED</dt>
          <dd>{reports.length}</dd>
        </div>
      </dl>
      <div>
        <RecentPanel title="Recent issues" prefix="Issue" entries={issues} />
        <RecentPanel title="Recent reports" prefix="Report" entries={reports} />
      </div>
    </section>
  );
}
