import { Bell, Check, Search, X } from "lucide-react";
import { fieldGuardData } from "../../data/fieldGuardData(Demo)";
import { staffData, staffDisputesData } from "../../data/staffData(Demo)";
import "../../styles/pages/StaffDashboardPage.css";

export default function StaffDisputePage() {
  const pendingDisputes = staffDisputesData.filter((dispute) => dispute.status === "PENDING");
  const openReports = fieldGuardData.reports.filter(
    (report) => report.status === "NEW" || report.status === "IN PROGRESS",
  ).length;
  const initials = staffData.name.split(" ").map((part) => part[0]).join("");

  return (
    <section className="staff-disputes" aria-labelledby="staff-disputes-title">
      <header className="staff-page-bar">
        <div>
          <h1 id="staff-disputes-title">Citation Disputes</h1>
          <p>{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · City of Millbrook</p>
        </div>
        <div className="staff-page-tools">
          <label className="staff-search">
            <Search size={16} aria-hidden="true" />
            <input type="search" placeholder="Search resident or address…" aria-label="Search resident or address (preview)" />
          </label>
          <button className="staff-notifications" type="button" aria-label="Notifications (preview)" disabled>
            <Bell size={18} aria-hidden="true" />
          </button>
          <span className="staff-top-avatar" aria-label={staffData.name}>{initials}</span>
        </div>
      </header>

      <div className="staff-dispute-content">
        <div className="staff-summary-cards">
          <article className="staff-summary-card staff-summary-card--amber">
            <h2><span />Pending disputes</h2>
            <strong>{pendingDisputes.length}</strong>
            <p>Awaiting review</p>
          </article>
          <article className="staff-summary-card staff-summary-card--blue">
            <h2><span />Active field officers</h2>
            <strong>—</strong>
            <p>Activity data unavailable</p>
          </article>
          <article className="staff-summary-card staff-summary-card--slate">
            <h2><span />Open tickets</h2>
            <strong>{openReports}</strong>
            <p>Maintenance backlog</p>
          </article>
          <article className="staff-summary-card staff-summary-card--red">
            <h2><span />Total outstanding</h2>
            <strong>—</strong>
            <p>Account balances unavailable</p>
          </article>
        </div>

        <section className="staff-dispute-queue" aria-labelledby="staff-queue-title">
          <div className="staff-queue-heading">
            <h2 id="staff-queue-title">Disputes &amp; Inspections Queue</h2>
            <span>{pendingDisputes.length} pending</span>
          </div>
          <div className="staff-table-scroll" role="region" aria-label="Disputes table" tabIndex={0}>
            <table className="staff-dispute-table">
              <thead>
                <tr>
                  <th scope="col">Ticket</th><th scope="col">Resident</th>
                  <th scope="col">Field evidence</th><th scope="col">Resident evidence</th>
                  <th scope="col">Violation</th><th scope="col">Reason</th>
                  <th scope="col">Amount</th><th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDisputes.map((dispute) => {
                  const issue = fieldGuardData.issues.find((item) => item._id === dispute.issueId);
                  return (
                    <tr key={dispute._id}>
                      <td className="staff-ticket">{dispute.ticket}</td>
                      <td><span className="staff-resident-name">{dispute.residentName}</span><time dateTime={dispute.submittedAt}>{new Date(dispute.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}</time></td>
                      <td><span className="staff-evidence-placeholder">Not shown</span></td>
                      <td><span className="staff-evidence-placeholder">Not shown</span></td>
                      <td>{issue?.violationType ?? "Issue unavailable"}</td>
                      <td>{dispute.reason}</td>
                      <td className="staff-dispute-amount">{issue ? `$${issue.amount.toLocaleString("en-US")}` : "—"}</td>
                      <td><div className="staff-dispute-actions">
                        <button type="button" className="staff-approve" title="Review actions are not connected yet"><Check size={13} aria-hidden="true" />Approve</button>
                        <button type="button" className="staff-reject" title="Review actions are not connected yet"><X size={13} aria-hidden="true" />Reject</button>
                      </div></td>
                    </tr>
                  );
                })}
                {pendingDisputes.length === 0 && <tr><td colSpan={8} className="staff-queue-empty">No pending disputes to review.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  );
}
