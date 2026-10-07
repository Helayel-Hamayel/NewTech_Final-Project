import { billingAccounts } from "../../data/staffData";
import { currency } from "../../helpers/formatting/currency";

type StaffOverviewProps = {
  pendingDisputes: number;
  openTickets: number;
};

export default function StaffOverview({
  pendingDisputes,
  openTickets,
}: StaffOverviewProps) {
  const outstandingBalance = billingAccounts.reduce(
    (total, account) => total + account.balance,
    0,
  );

  return (
    <section className="staff-kpis" aria-label="Municipal overview">
      <article className="staff-kpi staff-kpi--amber">
        <p>Pending Disputes</p>
        <strong>{pendingDisputes}</strong>
        <span>Unreviewed citation appeals</span>
      </article>
      <article className="staff-kpi staff-kpi--blue">
        <p>Active Field Officers</p>
        <strong>4</strong>
        <span>3 zones covered</span>
      </article>
      <article className="staff-kpi staff-kpi--slate">
        <p>Open Tickets</p>
        <strong>{openTickets}</strong>
        <span>Non-completed maintenance</span>
      </article>
      <article className="staff-kpi staff-kpi--rose">
        <p>Total Outstanding</p>
        <strong>{currency.format(outstandingBalance)}</strong>
        <span>Across all accounts</span>
      </article>
    </section>
  );
}
