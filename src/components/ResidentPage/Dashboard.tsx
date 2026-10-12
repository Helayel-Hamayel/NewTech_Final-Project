import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Camera, FileWarning, Home, ImageOff, Wallet, Zap } from "lucide-react";
import { useState } from "react";
import LoadingState from "../common/LoadingState";
import { useTheme } from "../../contexts/useTheme";
import { currency } from "../../helpers/formatting/currency";
import PaymentCheckout from "./PaymentCheckout";
import type { DashboardProps } from "./types";
import { MONTHLY_RENT } from "../../data/utilityData";
import { useUser } from "../../contexts/useUser";

function formatMonth(month: string) {
  return new Date(`${month}-01T00:00:00Z`).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function Dashboard({
  recentFines,
  finesLoading,
  finesError,
  unpaidFines,
  unpaidFineTotal,
  serviceRequests,
  reportsLoading,
  reportsError,
  utilityMonths,
  utilitiesLoading,
  utilitiesError,
  utilityType,
  onUtilityTypeChange,
  onOpenAppeal,
  onNavigate,
}: DashboardProps) {
  const { isDark } = useTheme();
  const { user } = useUser();

  const [checkoutPayments, setCheckoutPayments] = useState<number | null>(null);

  const openReports = serviceRequests.filter(
    (report) => report.stage === "Reported" || report.stage === "Dispatched" || report.stage === "In Progress",
  );

  const latestMonth = utilityMonths[utilityMonths.length - 1];

  const chartMonths = utilityMonths.slice(-6);

  const utilityUsage = chartMonths.map((entry) => ({
    month: formatMonth(entry.month),
    usage: utilityType === "Water" ? entry.waterUsage : entry.electricityUsage,
  }));

  const usageUnit = utilityType === "Water" ? "m³" : "kWh";

  const latestBillTotal = latestMonth ? latestMonth.waterAmount + latestMonth.electricityAmount : 0;

  const unpaidMonths = utilityMonths.filter((entry) => entry.status === "UNPAID");

  const unpaidUtilityTotal = unpaidMonths.reduce((total, entry) => total + entry.waterAmount + entry.electricityAmount, 0);

  const unpaidRentTotal = unpaidMonths.length * MONTHLY_RENT;

  const totalBalance = unpaidRentTotal + unpaidUtilityTotal + unpaidFineTotal;

  const balanceUnavailable = utilitiesLoading || finesLoading || Boolean(utilitiesError) || Boolean(finesError);

  return (
    <section className="resident-view" aria-labelledby="dashboard-heading">
      <header className="resident-page-intro">
        <section className="resident-page-intro-copy">
          <h1 id="dashboard-heading">Welcome, {user?.name ?? "Resident"}</h1>
          <p>{user?.email ?? ""}</p>
        </section>

        <section className="resident-card resident-status-card" aria-labelledby="status-heading">
          <p className="section-label">Your account</p>
          <h3 id="status-heading">Resident</h3>
          <p className="resident-status-line">ID: {user?.id ?? "—"}</p>
        </section>
      </header>

      <section className="resident-summary-grid" aria-label="Account summary">
        <section className="resident-card resident-balance-card" aria-labelledby="balance-heading">
          <section className="resident-balance-header">
            <span className="resident-balance-icon" aria-hidden="true">
              <Wallet size={20} />
            </span>
            <section className="resident-balance-heading">
              <p className="section-label section-label--light">Rent, utilities and fines due</p>
              <h2 id="balance-heading" className="resident-balance-total">
                {balanceUnavailable ? "—" : currency.format(totalBalance)}
              </h2>
            </section>
            {!balanceUnavailable && (
              <span className={`resident-balance-pill ${totalBalance === 0 ? "is-clear" : ""}`}>
                {totalBalance === 0 ? "All settled" : "Payment due"}
              </span>
            )}
          </section>

          <dl className="resident-balance-list">
            <div className="resident-balance-tile resident-balance-tile--rent">
              <dt>
                <Home size={14} aria-hidden="true" /> Unpaid rent
              </dt>
              <dd>{utilitiesLoading || utilitiesError ? "—" : currency.format(unpaidRentTotal)}</dd>
            </div>
            <div className="resident-balance-tile resident-balance-tile--utilities">
              <dt>
                <Zap size={14} aria-hidden="true" /> Unpaid utilities
              </dt>
              <dd>{utilitiesLoading || utilitiesError ? "—" : currency.format(unpaidUtilityTotal)}</dd>
            </div>
            <div className="resident-balance-tile resident-balance-tile--fines">
              <dt>
                <FileWarning size={14} aria-hidden="true" /> Unpaid fines
              </dt>
              <dd>{finesLoading || finesError ? "—" : currency.format(unpaidFineTotal)}</dd>
            </div>
          </dl>

          <section className="resident-card-actions">
            <button
              className="resident-primary-btn"
              type="button"
              disabled={balanceUnavailable || totalBalance === 0}
              onClick={() => setCheckoutPayments(1)}>
              Pay All
            </button>

            <button
              className="resident-secondary-btn resident-secondary-btn--light"
              type="button"
              disabled={balanceUnavailable || totalBalance === 0}
              onClick={() => setCheckoutPayments(2)}>
              Payment Plan
            </button>
          </section>

          <p className="resident-balance-note">Payment checkout is still a demo.</p>
        </section>

        <article className="resident-card resident-kpi-card resident-kpi-card--rose">
          <section className="resident-kpi-content">
            <h3>Active Fines</h3>
            <section className="resident-kpi-metric">
              <p className="resident-kpi-value">{finesLoading || finesError ? "—" : unpaidFines.length}</p>
              <p className="resident-kpi-label">Unpaid</p>
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
            <h3>Open Requests</h3>
            <section className="resident-kpi-metric">
              <p className="resident-kpi-value">{reportsLoading || reportsError ? "—" : openReports.length}</p>
              <p className="resident-kpi-label">Open reports</p>
            </section>
          </section>
          <section className="resident-kpi-actions">
            <button type="button" onClick={() => onNavigate("My Services")}>
              View in My Services
            </button>
          </section>
        </article>
      </section>

      {reportsError && <p role="alert">{reportsError}</p>}

      <section className="resident-card resident-utility-card" aria-labelledby="utility-heading">
        <section className="resident-card-header resident-card-header--stacked">
          <section>
            <p className="section-label">Utility usage</p>
            <h3 id="utility-heading">Water and electricity</h3>
          </section>

          <section className="resident-utility-toggle" aria-label="Utility type selection">
            <button type="button" className={utilityType === "Water" ? "is-active" : ""} onClick={() => onUtilityTypeChange("Water")}>
              Water
            </button>

            <button
              type="button"
              className={utilityType === "Electricity" ? "is-active" : ""}
              onClick={() => onUtilityTypeChange("Electricity")}>
              Electricity
            </button>
          </section>
        </section>

        {utilitiesLoading ? (
          <LoadingState variant="inline" title="Loading utilities" description="Fetching your utility data." />
        ) : utilitiesError ? (
          <p role="alert">{utilitiesError}</p>
        ) : !latestMonth ? (
          <p className="resident-empty-state">No water or electricity records have been added yet.</p>
        ) : (
          <>
            <figure className="resident-chart">
              <figcaption>
                {utilityType} usage ({usageUnit}) · Latest recorded months
              </figcaption>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={utilityUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#3b5064" : "#dbe3ef"} />

                  <XAxis
                    dataKey="month"
                    tick={{
                      fill: isDark ? "#9eb2c4" : "#64748b",
                      fontSize: 11,
                    }}
                    stroke={isDark ? "#526579" : "#cbd5e1"}
                  />

                  <YAxis
                    tick={{
                      fill: isDark ? "#9eb2c4" : "#64748b",
                      fontSize: 11,
                    }}
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

                  <Bar dataKey="usage" name={utilityType} radius={[6, 6, 0, 0]} fill={isDark ? "#5ba6ce" : "#2563eb"} />
                </BarChart>
              </ResponsiveContainer>
            </figure>

            <aside className="resident-current-bill">
              <dl className="resident-bill-breakdown">
                <div>
                  <dt>Water</dt>
                  <dd>
                    {currency.format(latestMonth.waterAmount)} <small>{latestMonth.waterUsage} m³</small>
                  </dd>
                </div>
                <div>
                  <dt>Electricity</dt>
                  <dd>
                    {currency.format(latestMonth.electricityAmount)} <small>{latestMonth.electricityUsage} kWh</small>
                  </dd>
                </div>
              </dl>

              <section className="resident-bill-total">
                <h4>Latest bill · {formatMonth(latestMonth.month)}</h4>
                <p>{currency.format(latestBillTotal)}</p>
                <span className={`status-badge ${latestMonth.status === "PAID" ? "status-badge--paid" : "status-badge--unpaid"}`}>
                  {latestMonth.status === "PAID" ? "Paid" : "Unpaid"}
                </span>
              </section>

              <button className="resident-secondary-btn" type="button" onClick={() => onNavigate("Billing")}>
                View billing history
              </button>
            </aside>
          </>
        )}
      </section>
      
      <section className="resident-card" aria-labelledby="fines-heading">
        <section className="resident-card-header">
          <section>
            <p className="section-label">Citations</p>
            <h3 id="fines-heading">Latest fines &amp; citations</h3>
          </section>

          <button className="resident-secondary-btn" type="button" onClick={() => onNavigate("My Services")}>
            View all fines
          </button>
        </section>

        {finesLoading ? (
          <LoadingState variant="inline" title="Loading fines" description="Fetching your fines." />
        ) : finesError ? (
          <p role="alert">{finesError}</p>
        ) : recentFines.length === 0 ? (
          <p className="resident-empty-state">You have no fines.</p>
        ) : (
          <ul className="resident-list resident-list--stacked">
            {recentFines.map((fine) => (
              <li key={fine.id}>
                <article className="resident-list-item">
                  <section className="resident-list-meta">
                    {fine.photoUrl ? (
                      <a className="resident-list-photo" href={fine.photoUrl} target="_blank" rel="noopener noreferrer" title="View photo">
                        <Camera size={20} aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="resident-list-photo resident-list-photo--empty" title="No photo attached">
                        <ImageOff size={20} aria-hidden="true" />
                      </span>
                    )}

                    <section>
                      <h4>{fine.id}</h4>
                      <p className="resident-muted">{fine.violation}</p>
                      <p className="resident-muted resident-list-location">{fine.licensePlate}</p>
                    </section>
                  </section>

                  <section className="resident-list-details">
                    <p>
                      <span>Status</span>{" "}
                      <strong
                        className={`status-badge ${
                          fine.status === "Unpaid"
                            ? "status-badge--unpaid"
                            : fine.status === "Paid" || fine.status === "Waived"
                              ? "status-badge--paid"
                              : "status-badge--info"
                        }`}>
                        {fine.status}
                      </strong>
                    </p>

                    <p>
                      <span>Vehicle registration</span> {fine.licensePlate ?? "Not recorded"}
                    </p>

                    <p>
                      <span>Date</span> {fine.date}
                    </p>

                    <p>
                      <span>Amount</span> {currency.format(fine.amount)}
                    </p>
                  </section>

                  {fine.status === "Unpaid" && !fine.appealStatus && (
                    <button className="resident-secondary-btn" type="button" onClick={() => onOpenAppeal(fine)}>
                      File Appeal
                    </button>
                  )}
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      {checkoutPayments !== null ? (
        <PaymentCheckout amount={totalBalance} defaultPayments={checkoutPayments} onClose={() => setCheckoutPayments(null)} />
      ) : null}
    </section>
  );
}
