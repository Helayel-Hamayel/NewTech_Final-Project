import { useState } from "react";
import type { StaffUtilityAccount, UtilityMonth } from "../../data/utilityData";
import { currency } from "../../helpers/formatting/currency";
import StaffFineLedger from "./StaffFineLedger";

type BillingLedgerProps = {
  accounts: StaffUtilityAccount[];
  search: string;
};

function formatMonth(month: string) {
  return new Date(`${month}-01T00:00:00Z`).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function BillingLedger({ accounts, search }: BillingLedgerProps) {
  const [activeSection, setActiveSection] = useState<"monthly" | "fines">("monthly");
  const [statusFilter, setStatusFilter] = useState<UtilityMonth["status"] | "ALL">("UNPAID");

  const query = search.trim().toLowerCase();
  const monthlyRent = 5800;

  const rows = accounts
    .flatMap((account) =>
      account.months.map((month) => ({
        id: `${account._id}-${month.month}`,
        residentName: account.resident?.name ?? "Resident unavailable",
        residentEmail: account.resident?.email ?? "Email unavailable",
        month: month.month,
        water: month.waterAmount,
        electricity: month.electricityAmount,
        rent: monthlyRent,
        total: monthlyRent + month.waterAmount + month.electricityAmount,
        status: month.status,
      })),
    )
    .filter(
      (row) => (statusFilter === "ALL" || row.status === statusFilter) && [row.residentName, row.residentEmail].some((value) => value.toLowerCase().includes(query)),
    )
    .sort((a, b) => b.month.localeCompare(a.month) || a.residentName.localeCompare(b.residentName));

  return (
    <section className="staff-panel" aria-labelledby="billing-heading">
      <header className="staff-panel-heading">
        <section>
          <p className="staff-section-label">Resident bills and fines</p>
          <h2 id="billing-heading">Billing ledger</h2>
        </section>
      </header>

      <nav className="staff-ledger-tabs" aria-label="Choose ledger section">
        <button type="button" aria-pressed={activeSection === "monthly"} onClick={() => setActiveSection("monthly")}>
          Monthly bills
        </button>

        <button type="button" aria-pressed={activeSection === "fines"} onClick={() => setActiveSection("fines")}>
          Fines
        </button>
      </nav>

      {activeSection === "fines" ? (
        <StaffFineLedger search={search} />
      ) : (
        <>
          <div className="staff-ledger-toolbar">
            <div className="staff-ledger-filters" role="group" aria-label="Filter billing status">
              <button type="button" aria-pressed={statusFilter === "ALL"} onClick={() => setStatusFilter("ALL")}>
                All
              </button>

              <button type="button" aria-pressed={statusFilter === "UNPAID"} onClick={() => setStatusFilter("UNPAID")}>
                Unpaid
              </button>

              <button type="button" aria-pressed={statusFilter === "PAID"} onClick={() => setStatusFilter("PAID")}>
                Paid
              </button>
            </div>

            <span className="staff-result-count">{rows.length} monthly records</span>
          </div>

          <section className="staff-table-scroll" role="region" aria-label="Billing ledger table" tabIndex={0}>
            <table className="staff-table staff-billing-table">
              <thead>
                <tr>
                  <th scope="col">Resident</th>
                  <th scope="col">Month</th>
                  <th scope="col">Water</th>
                  <th scope="col">Electricity</th>
                  <th scope="col">Rent</th>
                  <th scope="col">Total</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="staff-resident-cell">
                      <div className="staff-ledger-resident">
                        <strong>{row.residentName}</strong>
                        <span>{row.residentEmail}</span>
                      </div>
                    </td>

                    <td>{formatMonth(row.month)}</td>
                    <td>{currency.format(row.water)}</td>
                    <td>{currency.format(row.electricity)}</td>
                    <td>{currency.format(row.rent)}</td>
                    <td className="staff-amount">{currency.format(row.total)}</td>

                    <td>
                      <span className={`staff-status-badge staff-ledger-status--${row.status.toLowerCase()}`}>
                        {row.status === "PAID" ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td className="staff-empty" colSpan={7}>
                      {query
                        ? "No bills match this resident name or email."
                        : `No ${statusFilter === "PAID" ? "paid " : statusFilter === "UNPAID" ? "unpaid " : ""}monthly bills.`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </>
      )}
    </section>
  );
}
