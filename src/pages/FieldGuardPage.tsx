import { apiUrl } from "../helpers/apiUrl";
import { useEffect, useState } from "react";
import type { ReportFromBackend } from "../data/staffData";
import FieldGuardStatusIcon from "../components/fieldGuard/FieldGuardStatusIcon";
import LoadingState from "../components/common/LoadingState";
import type { FineFromBackend } from "../data/fineData";
import { RecentPanel } from "../helpers/fieldGuard/fieldGuardPageHelpers";
import { useUser } from "../contexts/useUser";
import "../styles/pages/FieldGuard/FieldGuardPage.css";

export default function FieldGuardPage() {
  const { user } = useUser();

  const [reports, setReports] = useState<ReportFromBackend[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState("");
  const [fines, setFines] = useState<FineFromBackend[]>([]);
  const [finesLoading, setFinesLoading] = useState(true);
  const [finesError, setFinesError] = useState("");

  const paidCount = fines.filter((fine) => fine.status === "PAID").length;
  const unpaidCount = fines.filter((fine) => fine.status === "UNPAID").length;

  const fineEntries = fines.map((fine) => ({
    _id: fine._id,
    description: `${fine.violationType} · ${fine.licensePlate}`,
    status: fine.status,
    createdAt: fine.createdAt,
  }));

  useEffect(() => {
    const controller = new AbortController();

    async function loadReports() {
      try {
        const response = await fetch(apiUrl("/reports"), {
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

  useEffect(() => {
    const controller = new AbortController();

    async function loadFines() {
      try {
        const response = await fetch(apiUrl("/fines"), {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load your fines.");
        }

        const data: FineFromBackend[] = await response.json();

        if (!controller.signal.aborted) {
          setFines(data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setFinesError(error instanceof Error ? error.message : "Could not load your fines.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setFinesLoading(false);
        }
      }
    }

    loadFines();

    return () => controller.abort();
  }, []);
  return (
    <section className="field-guard-screen field-guard-overview" aria-labelledby="field-guard-title">
      <header className="field-guard-page-heading">
        <p className="field-guard-eyebrow">OFFICER WORKSPACE</p>
        <h1 id="field-guard-title">Field Guard Overview</h1>
        <p>Welcome back, {user?.name ?? "Field Guard"}. Here is your activity at a glance.</p>
      </header>

      <dl className="field-guard-stat-grid">
        <div className="field-guard-stat-card">
          <dt>ISSUED FINES</dt>
          <dd>{finesLoading || finesError ? "—" : fines.length}</dd>
        </div>

        <div className="field-guard-stat-card field-guard-stat-card--accepted">
          <dt>
            <FieldGuardStatusIcon status="PAID" />
            PAID FINES
          </dt>
          <dd>{finesLoading || finesError ? "—" : paidCount}</dd>
        </div>

        <div className="field-guard-stat-card field-guard-stat-card--new">
          <dt>
            <FieldGuardStatusIcon status="UNPAID" />
            UNPAID FINES
          </dt>
          <dd>{finesLoading || finesError ? "—" : unpaidCount}</dd>
        </div>

        <div className="field-guard-stat-card">
          <dt>ASSIGNED REPORTS</dt>
          <dd>{reportsLoading || reportsError ? "—" : reports.length}</dd>
        </div>
      </dl>
      <section className="field-guard-overview-panels" aria-label="Recent activity">
        {finesLoading ? (
          <LoadingState title="Loading fines" description="Fetching your recent citations." />
        ) : finesError ? (
          <p role="alert">{finesError}</p>
        ) : (
          <RecentPanel title="Recent fines" prefix="Fine" entries={fineEntries} />
        )}{" "}
        {reportsLoading ? (
          <LoadingState title="Loading reports" description="Fetching your assigned reports." />
        ) : reportsError ? (
          <p role="alert">{reportsError}</p>
        ) : (
          <RecentPanel title="Recent reports" prefix="Report" entries={reports} />
        )}{" "}
      </section>
    </section>
  );
}
