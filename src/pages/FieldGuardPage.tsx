import { useEffect, useState } from "react";
import type { ReportFromBackend } from "../data/staffData";
import FieldGuardStatusIcon from "../components/FieldGuard/FieldGuardStatusIcon";
import { fieldGuardData, type FieldGuardIssue } from "../data/fieldGuardData";
import { RecentPanel } from "../helpers/fieldGuard/fieldGuardPageHelpers";
import "../styles/pages/FieldGuard/FieldGuardPage.css";

type FieldGuardPageProps = {
  issues: FieldGuardIssue[];
};

export default function FieldGuardPage({ issues }: FieldGuardPageProps) {
  const { name } = fieldGuardData;

  const [reports, setReports] = useState<ReportFromBackend[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState("");
  const acceptedCount = issues.filter((issue) => issue.status === "ACCEPTED").length;
  const rejectedCount = issues.filter((issue) => issue.status === "REJECTED").length;

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
          setReportsError(error instanceof Error ? error.message : "Could not load your reports.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setReportsLoading(false);
        }
      }
    }

    loadReports();

    return () => controller.abort();
  }, []);
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
        {reportsLoading ? (
          <p role="status">Loading reports...</p>
        ) : reportsError ? (
          <p role="alert">{reportsError}</p>
        ) : (
          <RecentPanel title="Recent reports" prefix="Report" entries={reports} />
        )}{" "}
      </div>
    </section>
  );
}
