import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { useTheme } from "../../contexts/useTheme";
import { currency } from "../../helpers/formatting/currency";
import {
  resident,
  residentProperty,
  seededInvoices,
} from "../../data/residentPortal";
import PaymentCheckout from "./PaymentCheckout";
import type { DashboardProps } from "./types";

export default function Dashboard({
  unpaidFines,
  unpaidFineTotal,
  utilityType,
  utilityUsage,
  onUtilityTypeChange,
  onOpenAppeal,
  onNavigate,
}: DashboardProps) {
  const { isDark } = useTheme();
  const [checkoutPayments, setCheckoutPayments] = useState<number | null>(null);
  const currentInvoice = seededInvoices.find((invoice) => invoice.status === "Due");
  const currentUtilityBill = currentInvoice
    ? currentInvoice.water + currentInvoice.electricity
    : 0;
  const usageUnit = utilityType === "Water" ? "m³" : "kWh";
  const totalBalance =
    residentProperty.monthlyRent + currentUtilityBill + unpaidFineTotal;

  return (
    <section className="resident-view" aria-labelledby="dashboard-heading">
      <header className="resident-page-intro">
        <section className="resident-page-intro-copy">
          <h1 id="dashboard-heading">Good morning, {resident.name}</h1>
          <p>{residentProperty.address} · Resident ID: {resident.id}</p>
        </section>
        <section
          className="resident-card resident-status-card"
          aria-labelledby="status-heading"
        >
          <p className="section-label">Account status</p>
          <h3 id="status-heading">Active</h3>
          <p className="resident-status-line">
            Lease valid to {residentProperty.leaseEnd}
          </p>
        </section>
      </header>

      <section className="resident-summary-grid" aria-label="Account summary">
        <section
          className="resident-card resident-balance-card"
          aria-labelledby="balance-heading"
        >
          <section className="resident-balance-header">
            <p className="section-label section-label--light">
              Account balance due
            </p>
            <h2 className="resident-balance-total">
              {currency.format(totalBalance)}
            </h2>
          </section>
          <dl className="resident-balance-list">
            <div>
              <dt>Rent</dt>
              <dd>{currency.format(residentProperty.monthlyRent)}</dd>
            </div>
            <div>
              <dt>Utilities</dt>
              <dd>{currency.format(currentUtilityBill)}</dd>
            </div>
            <div>
              <dt>Unpaid fines</dt>
              <dd>{currency.format(unpaidFineTotal)}</dd>
            </div>
          </dl>
          <section className="resident-card-actions">
            <button
              className="resident-primary-btn"
              type="button"
              onClick={() => setCheckoutPayments(1)}
            >
              Pay All · {currency.format(totalBalance)}
            </button>
            <button
              className="resident-secondary-btn resident-secondary-btn--light"
              type="button"
              onClick={() => setCheckoutPayments(2)}
            >
              Payment Plan
            </button>
          </section>
        </section>

        <article className="resident-card resident-kpi-card resident-kpi-card--rose">
          <section className="resident-kpi-content">
            <h3>
              Active
              <br />
              Fines
            </h3>
            <section className="resident-kpi-metric">
              <p className="resident-kpi-value">{unpaidFines.length}</p>
              <p className="resident-kpi-label">Appealed</p>
            </section>
          </section>
          <section className="resident-kpi-actions">
            <button type="button" onClick={() => onNavigate("My Services")}>
              View in My Services
            </button>
          </section>
        </article>

        <article className="resident-card resident-kpi-card resident-kpi-card--sand">
          <section className="resident-kpi-content">
            <h3>
              Open
              <br />
              Requests
            </h3>
            <section className="resident-kpi-metric">
              <p className="resident-kpi-value">2</p>
              <p className="resident-kpi-label">Maintenance tickets</p>
            </section>
          </section>
          <section className="resident-kpi-actions">
            <button type="button" onClick={() => onNavigate("My Services")}>
              View in My Services
            </button>
          </section>
        </article>
      </section>

      <section
        className="resident-card resident-utility-card"
        aria-labelledby="utility-heading"
      >
        <section className="resident-card-header resident-card-header--stacked">
          <section>
            <p className="section-label">Utility usage</p>
            <h3 id="utility-heading">August 2026</h3>
          </section>
          <section
            className="resident-utility-toggle"
            aria-label="Utility type selection"
          >
            <button
              type="button"
              className={utilityType === "Water" ? "is-active" : ""}
              onClick={() => onUtilityTypeChange("Water")}
            >
              Water
            </button>
            <button
              type="button"
              className={utilityType === "Electricity" ? "is-active" : ""}
              onClick={() => onUtilityTypeChange("Electricity")}
            >
              Electricity
            </button>
          </section>
        </section>
        <figure className="resident-chart">
          <figcaption>
            {utilityType} usage ({usageUnit}), March–August 2026
          </figcaption>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={utilityUsage}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? "#3b5064" : "#dbe3ef"}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: isDark ? "#9eb2c4" : "#64748b", fontSize: 11 }}
                stroke={isDark ? "#526579" : "#cbd5e1"}
              />
              <YAxis
                tick={{ fill: isDark ? "#9eb2c4" : "#64748b", fontSize: 11 }}
                stroke={isDark ? "#526579" : "#cbd5e1"}
              />
              <Tooltip
                formatter={(value) => [`${value} ${usageUnit}`, utilityType]}
                contentStyle={{
                  backgroundColor: isDark ? "#1c2a3b" : "#ffffff",
                  border: `1px solid ${isDark ? "#526579" : "#e2e8f0"}`,
                  borderRadius: "12px",
                  color: isDark ? "#e5edf5" : "#0f172a",
                }}
                cursor={{ fill: isDark ? "#29445a" : "#dbeafe" }}
              />
              <Bar
                dataKey="usage"
                name={utilityType}
                radius={[6, 6, 0, 0]}
                fill={isDark ? "#5ba6ce" : "#2563eb"}
              />
            </BarChart>
          </ResponsiveContainer>
        </figure>
        <aside className="resident-current-bill">
          <section>
            <h4>Current bill</h4>
            <p>{currency.format(currentUtilityBill)}</p>
            <span>Due 30 Sep 2026</span>
          </section>
          <button
            className="resident-secondary-btn"
            type="button"
            onClick={() => onNavigate("Billing")}
          >
            View billing history
          </button>
        </aside>
      </section>

      <section className="resident-card" aria-labelledby="fines-heading">
        <section className="resident-card-header">
          <section>
            <p className="section-label">Citations</p>
            <h3 id="fines-heading">Active fines &amp; citations</h3>
          </section>
          <button
            className="resident-secondary-btn"
            type="button"
            onClick={() => onNavigate("My Services")}
          >
            View all fines
          </button>
        </section>
        {unpaidFines.length === 0 ? (
          <p className="resident-empty-state">No unpaid citations.</p>
        ) : (
          <ul className="resident-list resident-list--stacked">
            {unpaidFines.map((fine) => (
              <li key={fine.id}>
                <article className="resident-list-item">
                  <section className="resident-list-meta">
                    <p className="resident-list-photo">{fine.photo}</p>
                    <section>
                      <h4>{fine.id}</h4>
                      <p className="resident-muted">{fine.violation}</p>
                      <p className="resident-muted resident-list-location">
                        {fine.location}
                      </p>
                    </section>
                  </section>
                  <section className="resident-list-details">
                    <p>
                      <span>Status</span>{" "}
                      <strong className="status-badge status-badge--unpaid">
                        {fine.status}
                      </strong>
                    </p>
                    <p>
                      <span>Location</span> {fine.location}
                    </p>
                    <p>
                      <span>Date</span> {fine.date}
                    </p>
                    <p>
                      <span>Amount</span> {currency.format(fine.amount)}
                    </p>
                  </section>
                  <button
                    className="resident-secondary-btn"
                    type="button"
                    onClick={() => onOpenAppeal(fine)}
                  >
                    File Appeal
                  </button>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      {checkoutPayments !== null ? (
        <PaymentCheckout
          amount={totalBalance}
          defaultPayments={checkoutPayments}
          onClose={() => setCheckoutPayments(null)}
        />
      ) : null}
    </section>
  );
}
