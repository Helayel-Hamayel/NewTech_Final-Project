import { useState } from "react";
import { Check, Download, ReceiptText, WalletCards } from "lucide-react";
import { currency } from "../../helpers/formatting/currency";
import type { BillingProps } from "./types";

export default function Billing({ invoices, onDownloadInvoice }: BillingProps) {
  const [paymentMessage, setPaymentMessage] = useState("");
  const currentBalanceDue = invoices
    .filter((invoice) => invoice.status === "Due")
    .reduce((total, invoice) => total + invoice.total, 0);
  const lastPayment = invoices
    .filter((invoice) => invoice.status === "Paid")
    .at(-1);
  const yearToDatePaid = invoices
    .filter((invoice) => invoice.status === "Paid")
    .reduce((total, invoice) => total + invoice.total, 0);

  function handlePay(invoiceId: string) {
    setPaymentMessage(
      `Payment started for ${invoiceId}. A secure checkout would open here.`,
    );
  }

  return (
    <section className="resident-view" aria-labelledby="billing-heading">
      <header className="resident-page-intro resident-page-intro--split">
        <div>
          <p className="section-label">Account finance</p>
          <h1 id="billing-heading">Billing &amp; payments</h1>
          <p>
            Review monthly charges, download receipts, and keep your account
            current.
          </p>
        </div>
        <div className="resident-intro-badge">
          <ReceiptText size={18} aria-hidden="true" />
          <span>Updated today</span>
        </div>
      </header>
      <div className="billing-summary-grid">
        <article className="billing-balance-card">
          <div className="billing-icon">
            <WalletCards size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="section-label section-label--light">
              Current balance due
            </p>
            <p className="billing-total">
              {currency.format(currentBalanceDue)}
            </p>
            <span>Due Sep 30, 2026</span>
          </div>
          <button
            className="resident-primary-btn"
            type="button"
            onClick={() => handlePay("current balance")}
          >
            Pay balance
          </button>
        </article>
        <article className="resident-card billing-stat-card">
          <p className="section-label">Last payment</p>
          <strong>{currency.format(lastPayment?.total ?? 0)}</strong>
          <span>{lastPayment?.period ?? "No payments yet"}</span>
        </article>
        <article className="resident-card billing-stat-card">
          <p className="section-label">Paid this year</p>
          <strong>{currency.format(yearToDatePaid)}</strong>
          <span>
            {invoices.filter((invoice) => invoice.status === "Paid").length}{" "}
            invoices settled
          </span>
        </article>
      </div>
      <section
        className="resident-card billing-history-card"
        aria-labelledby="billing-history-heading"
      >
        <div className="resident-card-header">
          <div>
            <p className="section-label">Payment history</p>
            <h2 id="billing-history-heading">Invoices</h2>
          </div>
          <span className="billing-count">{invoices.length} records</span>
        </div>
        {paymentMessage ? (
          <p className="resident-action-message" role="status">
            <Check size={16} aria-hidden="true" />
            {paymentMessage}
          </p>
        ) : null}
        <div className="billing-table-wrap">
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
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <strong>{invoice.id}</strong>
                    <span className="billing-subtext">Rent + utilities</span>
                  </td>
                  <td>{invoice.period}</td>
                  <td>
                    <span className="billing-subtext">
                      Rent {currency.format(invoice.rent)}
                    </span>
                    <span className="billing-subtext">
                      Utilities{" "}
                      {currency.format(invoice.water + invoice.electricity)}
                    </span>
                  </td>
                  <td>
                    <strong>{currency.format(invoice.total)}</strong>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${invoice.status === "Due" ? "status-badge--unpaid" : "status-badge--paid"}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="billing-actions">
                    {invoice.status === "Paid" ? (
                      <button
                        className="resident-secondary-btn"
                        type="button"
                        onClick={() => onDownloadInvoice(invoice)}
                      >
                        <Download size={15} aria-hidden="true" />
                        Receipt
                      </button>
                    ) : (
                      <button
                        className="resident-primary-btn"
                        type="button"
                        onClick={() => handlePay(invoice.id)}
                      >
                        Pay now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
