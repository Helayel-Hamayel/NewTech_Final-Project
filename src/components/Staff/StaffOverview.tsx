import { useEffect, useState } from "react";
import { billingAccounts, type StaffServiceRequest } from "../../data/staffData";
import { currency } from "../../helpers/formatting/currency";

type StaffOverviewProps = {
  pendingDisputes: number;
  openTickets: number;
  serviceRequests: StaffServiceRequest[];
  loading?: boolean;
};

export default function StaffOverview({
  pendingDisputes,
  openTickets,
  serviceRequests,
  loading = false,
}: StaffOverviewProps) {
  const [fieldOfficers, setFieldOfficers] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("http://localhost:4000/reports/field-guards", {
      credentials: "include",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((guards: unknown[]) => setFieldOfficers(guards.length))
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  const pendingRequests = serviceRequests.filter((request) => request.status === "Pending").length;
  const outstandingBalance = billingAccounts.reduce((total, account) => total + account.balance, 0);
  const display = (value: number) => (loading ? "—" : value);

  return (
    <section className="staff-kpis" aria-label="Municipal overview">
      <article className="staff-kpi staff-kpi--amber">
        <p>Pending Disputes</p>
        <strong>{pendingDisputes}</strong>
        <span>Unreviewed citation appeals</span>
      </article>
      <article className="staff-kpi staff-kpi--blue">
        <p>Pending Requests</p>
        <strong>{display(pendingRequests)}</strong>
        <span>Awaiting staff review</span>
      </article>
      <article className="staff-kpi staff-kpi--slate">
        <p>Open Tickets</p>
        <strong>{display(openTickets)}</strong>
        <span>Assigned or in progress</span>
      </article>
      <article className="staff-kpi staff-kpi--slate">
        <p>Field Officers</p>
        <strong>{fieldOfficers ?? "—"}</strong>
        <span>Registered field guards</span>
      </article>
      <article className="staff-kpi staff-kpi--rose">
        <p>Total Outstanding</p>
        <strong>{currency.format(outstandingBalance)}</strong>
        <span>Across all accounts</span>
      </article>
    </section>
  );
}
