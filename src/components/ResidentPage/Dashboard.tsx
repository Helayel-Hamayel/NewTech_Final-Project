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
import { currency } from "./formatters";
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
  const [balanceActionMessage, setBalanceActionMessage] = useState("");
  const totalBalance = 1250 + 86 + unpaidFineTotal;

  function handlePayAll() {
    setBalanceActionMessage(
      `Payment started for ${currency.format(totalBalance)}. A secure checkout would open here.`,
    );
  }

  function handlePaymentPlan() {
    setBalanceActionMessage(
      "Payment plan request started. A resident services specialist would contact you here.",
    );
  }

  return (
    <section className="resident-view" aria-labelledby="dashboard-heading">
      <header className="resident-page-intro">
        <div className="resident-page-intro-copy">
          <h1 id="dashboard-heading">Good morning, Maria Reyes</h1>
          <p>14 Maple Street, Unit 2B · Resident ID: RES-00441</p>
        </div>
        <section
          className="resident-card resident-status-card"
          aria-labelledby="status-heading"
        >
          <p className="section-label">Account status</p>
          <h3 id="status-heading">Active</h3>
          <p className="resident-status-line">Lease valid to Dec 2026</p>
        </section>
      </header>

      <div className="resident-summary-grid">
        <section
          className="resident-card resident-balance-card"
          aria-labelledby="balance-heading"
        >
          <div className="resident-balance-header">
            <p className="section-label section-label--light">
              Account balance due
            </p>
            <h2 className="resident-balance-total">
              {currency.format(totalBalance)}
            </h2>
          </div>

          <dl className="resident-balance-list">
            <div>
              <dt>Rent</dt>
              <dd>{currency.format(1250)}</dd>
            </div>
            <div>
              <dt>Utilities</dt>
              <dd>{currency.format(86)}</dd>
            </div>
            <div>
              <dt>Unpaid fines</dt>
              <dd>{currency.format(unpaidFineTotal)}</dd>
            </div>
          </dl>

          <div className="resident-card-actions">
            <button
              className="resident-primary-btn"
              type="button"
              onClick={handlePayAll}
            >
              Pay All · {currency.format(totalBalance)}
            </button>
            <button
              className="resident-secondary-btn resident-secondary-btn--light"
              type="button"
              onClick={handlePaymentPlan}
            >
              Payment Plan
            </button>
          </div>
          {balanceActionMessage ? (
            <p className="resident-action-message" role="status">
              {balanceActionMessage}
            </p>
          ) : null}
        </section>

        <article className="resident-card resident-kpi-card resident-kpi-card--rose">
          <div className="resident-kpi-content">
            <h3>
              Active
              <br />
              Fines
            </h3>
            <div className="resident-kpi-metric">
              <p className="resident-kpi-value">{unpaidFines.length}</p>
              <p className="resident-kpi-label">Appealed</p>
            </div>
          </div>
          <div className="resident-kpi-actions">
            <button type="button" onClick={() => onNavigate("My Tickets")}>
              View in My Tickets
            </button>
          </div>
        </article>

        <article className="resident-card resident-kpi-card resident-kpi-card--sand">
          <div className="resident-kpi-content">
            <h3>
              Open
              <br />
              Requests
            </h3>
            <div className="resident-kpi-metric">
              <p className="resident-kpi-value">2</p>
              <p className="resident-kpi-label">Maintenance tickets</p>
            </div>
          </div>
          <div className="resident-kpi-actions">
            <button type="button" onClick={() => onNavigate("My Tickets")}>
              View in My Tickets
            </button>
          </div>
        </article>
      </div>

      <section
        className="resident-card resident-utility-card"
        aria-labelledby="utility-heading"
      >
        <div className="resident-card-header resident-card-header--stacked">
          <div>
            <p className="section-label">Utility usage</p>
            <h3 id="utility-heading">August 2026</h3>
          </div>
          <div
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
          </div>
        </div>

        <figure className="resident-chart">
          <figcaption>{utilityType} usage, March–August 2026</figcaption>
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
          <div>
            <h4>Current bill</h4>
            <p>{currency.format(86)}</p>
            <span>Due Sep 30, 2026</span>
          </div>
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
        <div className="resident-card-header">
          <div>
            <p className="section-label">Citations</p>
            <h3 id="fines-heading">Active fines &amp; citations</h3>
          </div>
          <button
            className="resident-secondary-btn"
            type="button"
            onClick={() => onNavigate("My Tickets")}
          >
            View all fines
          </button>
        </div>

        {unpaidFines.length === 0 ? (
          <p className="resident-empty-state">No unpaid citations.</p>
        ) : (
          <ul className="resident-list resident-list--stacked">
            {unpaidFines.map((fine) => (
              <li key={fine.id}>
                <article className="resident-list-item">
                  <div className="resident-list-meta">
                    <p className="resident-list-photo">{fine.photo}</p>
                    <div>
                      <h4>{fine.id}</h4>
                      <p className="resident-muted">{fine.violation}</p>
                      <p className="resident-muted resident-list-location">
                        {fine.location}
                      </p>
                    </div>
                  </div>
                  <div className="resident-list-details">
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
                  </div>
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
    </section>
  );
}