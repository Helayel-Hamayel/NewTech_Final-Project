import { useState } from "react";
import { Download, ReceiptText, WalletCards } from "lucide-react";
import { currency } from "../../helpers/formatting/currency";
import PaymentCheckout from "./PaymentCheckout";
import type { BillingProps, PaymentSelection } from "./types";

export default function Billing({ invoices, unpaidFineTotal, unpaidFineIds, onPay, onDownloadInvoice }: BillingProps) {
  const [checkout, setCheckout] = useState<(PaymentSelection & { amount: number }) | null>(null);
  const unpaidInvoices = invoices.filter((invoice) => invoice.status === "Due");

  const rentDue = unpaidInvoices.reduce((total, invoice) => total + invoice.rent, 0);

  const waterDue = unpaidInvoices.reduce((total, invoice) => total + invoice.water, 0);

  const electricityDue = unpaidInvoices.reduce((total, invoice) => total + invoice.electricity, 0);

  const currentBalanceDue = rentDue + waterDue + electricityDue + unpaidFineTotal;

  const paidInvoices = invoices.filter((invoice) => invoice.status === "Paid");

  const latestPaidMonth = paidInvoices.at(-1);

  const totalPaid = paidInvoices.reduce((total, invoice) => total + invoice.total, 0);
  return (
    <section className="resident-view" aria-labelledby="billing-heading">
      <header className="resident-page-intro resident-page-intro--split">
        <section>
          <p className="section-label">Account finance</p>
          <h1 id="billing-heading">Billing &amp; payments</h1>
          <p>Review monthly charges, download receipts, and keep your account current.</p>
        </section>
        <section className="resident-intro-badge">
          <ReceiptText size={18} aria-hidden="true" />
          <span>Monthly billing records</span>{" "}
        </section>
      </header>
      <section className="billing-summary-grid" aria-label="Billing summary">
        <article className="billing-balance-card">
          <section className="billing-icon">
            <WalletCards size={20} aria-hidden="true" />
          </section>
          <section>
            <p className="section-label section-label--light">Current balance due</p>
            <p className="billing-total">{currency.format(currentBalanceDue)}</p>
            <div>
              <p>Rent: {currency.format(rentDue)}</p>
              <p>Water: {currency.format(waterDue)}</p>
              <p>Electricity: {currency.format(electricityDue)}</p>
              <p>Unpaid fines: {currency.format(unpaidFineTotal)}</p>
            </div>
          </section>
          <button
            className="resident-primary-btn"
            type="button"
            onClick={() =>
              setCheckout({
                amount: currentBalanceDue,
                months: unpaidInvoices.map((invoice) => invoice.id.replace("BILL-", "")),
                fineIds: unpaidFineIds,
              })
            }
            disabled={currentBalanceDue === 0}>
            Pay balance
          </button>
          <button
            className="resident-secondary-btn"
            type="button"
            disabled={currentBalanceDue === 0}
            onClick={() =>
              onDownloadInvoice({
                id: "OUTSTANDING-BALANCE",
                period: "All outstanding charges",
                rent: rentDue,
                water: waterDue,
                electricity: electricityDue,
                fines: unpaidFineTotal,
                total: currentBalanceDue,
                status: "Due",
              })
            }>
            <Download size={15} aria-hidden="true" />
            Download balance
          </button>
        </article>
        <article className="resident-card billing-stat-card">
          <p className="section-label">Latest paid month</p>
          <strong>{currency.format(latestPaidMonth?.total ?? 0)}</strong>
          <span>{latestPaidMonth?.period ?? "No paid months yet"}</span>
        </article>

        <article className="resident-card billing-stat-card">
          <p className="section-label">Total paid</p>
          <strong>{currency.format(totalPaid)}</strong>
          <span>{paidInvoices.length} months settled</span>
        </article>
      </section>
      <section className="resident-card billing-history-card" aria-labelledby="billing-history-heading">
        <section className="resident-card-header">
          <section>
            <p className="section-label">Payment history</p>
            <h2 id="billing-history-heading">Invoices</h2>
          </section>
          <span className="billing-count">{invoices.length} records</span>
        </section>
        <section className="billing-table-wrap">
          <table className="billing-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Period</th>
                <th>Charges</th>
                <th>Total</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={6}>No monthly bills have been recorded yet.</td>
                </tr>
              )}
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <strong>{invoice.id}</strong>
                    <span className="billing-subtext">Rent + utilities</span>
                  </td>
                  <td>{invoice.period}</td>
                  <td>
                    <span className="billing-subtext">Rent {currency.format(invoice.rent)}</span>
                    <span className="billing-subtext">Water {currency.format(invoice.water)}</span>
                    <span className="billing-subtext">Electricity {currency.format(invoice.electricity)}</span>
                  </td>
                  <td>
                    <strong>{currency.format(invoice.total)}</strong>
                  </td>
                  <td>
                    <span className={`status-badge ${invoice.status === "Due" ? "status-badge--unpaid" : "status-badge--paid"}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="billing-actions">
                    {invoice.status === "Paid" ? (
                      <button className="resident-secondary-btn" type="button" onClick={() => onDownloadInvoice(invoice)}>
                        <Download size={15} aria-hidden="true" />
                        Receipt
                      </button>
                    ) : (
                      <button
                        className="resident-primary-btn"
                        type="button"
                        onClick={() =>
                          setCheckout({
                            amount: invoice.total,
                            months: [invoice.id.replace("BILL-", "")],
                            fineIds: [],
                          })
                        }>
                        Pay now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
      {checkout !== null && (
        <PaymentCheckout
          amount={checkout.amount}
          defaultPayments={1}
          onConfirm={() =>
            onPay({
              months: checkout.months,
              fineIds: checkout.fineIds,
            })
          }
          onClose={() => setCheckout(null)}
        />
      )}
    </section>
  );
}
