import type { BillingAccount } from "../../data/staffData";
import { currency } from "../../helpers/formatting/currency";

type BillingLedgerProps = {
  accounts: BillingAccount[];
  search: string;
};

export default function BillingLedger({
  accounts,
  search,
}: BillingLedgerProps) {
  return (
    <section className="staff-panel" aria-labelledby="billing-heading">
      <div className="staff-panel-heading">
        <div>
          <p className="staff-section-label">Resident accounts</p>
          <h2 id="billing-heading">Billing ledger</h2>
        </div>
        <span className="staff-result-count">{accounts.length} accounts</span>
      </div>
      <div
        className="staff-table-scroll"
        role="region"
        aria-label="Billing ledger table"
        tabIndex={0}
      >
        <table className="staff-table staff-billing-table">
          <thead>
            <tr>
              <th scope="col">Property</th>
              <th scope="col">Account</th>
              <th scope="col">Resident</th>
              <th scope="col">Water</th>
              <th scope="col">Electricity</th>
              <th scope="col">Rent</th>
              <th scope="col">Fines</th>
              <th scope="col">Balance</th>
              <th scope="col">Last Paid</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.account}>
                <td>{account.property}</td>
                <td className="staff-ticket-id">{account.account}</td>
                <td className="staff-resident-cell">
                  <strong>{account.resident}</strong>
                </td>
                <td>{currency.format(account.water)}</td>
                <td>{currency.format(account.electricity)}</td>
                <td>{currency.format(account.rent)}</td>
                <td>{currency.format(account.fines)}</td>
                <td className="staff-amount">
                  {currency.format(account.balance)}
                </td>
                <td>{account.lastPaid}</td>
                <td>
                  <span
                    className={`staff-status-badge staff-status-badge--${account.status.toLowerCase()}`}
                  >
                    {account.status}
                  </span>
                </td>
              </tr>
            ))}
            {accounts.length === 0 ? (
              <tr>
                <td className="staff-empty" colSpan={10}>
                  No accounts match “{search}”.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
