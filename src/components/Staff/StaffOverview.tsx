import { useEffect, useState } from "react";
import type { StaffServiceRequest } from "../../data/staffData";
import { MONTHLY_RENT } from "../../data/utilityData";
import { currency } from "../../helpers/formatting/currency";

type UtilityAccount = {
  months: { status: "PAID" | "UNPAID"; waterAmount: number; electricityAmount: number }[];
};

type Fine = { status: "UNPAID" | "PAID" | "CANCELLED"; amount: number };

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
  const [outstandingBalance, setOutstandingBalance] = useState<number | null>(null);

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

  useEffect(() => {
    const controller = new AbortController();
    const options = { credentials: "include" as const, signal: controller.signal };
    const load = (path: string) =>
      fetch(`http://localhost:4000${path}`, options).then((response) =>
        response.ok ? response.json() : Promise.reject(),
      );

    Promise.all([load("/utilities"), load("/fines/staff")])
      .then(([accounts, fines]: [UtilityAccount[], Fine[]]) => {
        const unpaidUtilities = accounts.reduce(
          (total, account) =>
            total +
            account.months
              .filter((month) => month.status === "UNPAID")
              .reduce((sum, month) => sum + MONTHLY_RENT + month.waterAmount + month.electricityAmount, 0),
          0,
        );
        const unpaidFines = fines
          .filter((fine) => fine.status === "UNPAID")
          .reduce((sum, fine) => sum + fine.amount, 0);

        setOutstandingBalance(unpaidUtilities + unpaidFines);
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  const pendingRequests = serviceRequests.filter((request) => request.status === "Pending").length;
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
        <strong>{outstandingBalance === null ? "—" : currency.format(outstandingBalance)}</strong>
        <span>Unpaid rent, utilities and fines</span>
      </article>
    </section>
  );
}
