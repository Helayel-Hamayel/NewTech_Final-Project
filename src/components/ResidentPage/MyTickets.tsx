import type { MaintenanceTicket } from '../../data/residentPortal'
import { currency } from './formatters'
import ResidentIssues from './ResidentIssues'
import type { MyTicketsProps } from './types'

export default function MyTickets({ tickets, fines, issues, onOpenAppeal, selectedAppealFine, appealStatement, onAppealStatementChange, onSubmitAppeal, onCloseAppeal, onAddIssue, onCheckIssue }: MyTicketsProps) {
  const ticketStages: MaintenanceTicket['stage'][] = ['Reported', 'Dispatched', 'In Progress', 'Resolved']

  return (
    <section className="resident-view" aria-labelledby="tickets-heading">
      <header className="resident-page-intro">
        <p className="section-label">Service center</p>
        <h1 id="tickets-heading">My tickets</h1>
        <p>
          Track maintenance, report local issues, and follow every update in one
          place.
        </p>
      </header>
      <ResidentIssues
        issues={issues}
        onAddIssue={onAddIssue}
        onCheckIssue={onCheckIssue}
      />
      <section
        className="resident-card tickets-section"
        aria-labelledby="maintenance-heading"
      >
        <div className="resident-card-header">
          <div>
            <p className="section-label">Home and street services</p>
            <h2 id="maintenance-heading">Maintenance requests</h2>
          </div>
          <button className="resident-primary-btn" type="button">
            + New request
          </button>
        </div>
        <div className="ticket-list">
          {tickets.map((ticket) => {
            const currentStageIndex = ticketStages.indexOf(ticket.stage);
            return (
              <article className="ticket-card" key={ticket.id}>
                <div className="ticket-card-top">
                  <div>
                    <span className="ticket-id">{ticket.id}</span>
                    <h3>{ticket.type}</h3>
                  </div>
                  <span className="status-badge status-badge--info">
                    {ticket.stage}
                  </span>
                </div>
                <p className="ticket-location">{ticket.location}</p>
                <p className="resident-muted">Reported {ticket.reportedDate}</p>
                <div
                  className="ticket-progress"
                  aria-label={`Maintenance progress: ${ticket.stage}`}
                >
                  {ticketStages.map((stage, index) => (
                    <div
                      className={index < currentStageIndex ? "is-complete" : index === currentStageIndex ? "is-current" : "is-upcoming"}
                      key={`${ticket.id}-${stage}`}
                    >
                      <span className="ticket-progress-dot">
                        {index <= currentStageIndex ? "●" : "○"}
                      </span>
                      <span>{stage}</span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <section
        className="resident-card tickets-section"
        aria-labelledby="citations-heading"
      >
        <div className="resident-card-header">
          <div>
            <p className="section-label">Account notices</p>
            <h2 id="citations-heading">Fines &amp; citations</h2>
          </div>
          <span className="billing-count">{fines.length} records</span>
        </div>
        <ul className="citation-grid">
          {fines.map((fine) => (
            <li key={fine.id}>
              <article className="citation-card">
                <div className="citation-card-header">
                  <span className="citation-photo">{fine.photo}</span>
                  <span
                    className={`status-badge ${fine.status === "Unpaid" ? "status-badge--unpaid" : "status-badge--paid"}`}
                  >
                    {fine.status}
                  </span>
                </div>
                <h3>{fine.id}</h3>
                <p className="citation-violation">{fine.violation}</p>
                <dl className="citation-details">
                  <div>
                    <dt>Location</dt>
                    <dd>{fine.location}</dd>
                  </div>
                  <div>
                    <dt>Date</dt>
                    <dd>{fine.date}</dd>
                  </div>
                  <div>
                    <dt>Amount</dt>
                    <dd>{currency.format(fine.amount)}</dd>
                  </div>
                </dl>
                {fine.status === "Unpaid" ? (
                  <button
                    className="resident-secondary-btn"
                    type="button"
                    onClick={() => onOpenAppeal(fine)}
                  >
                    File appeal
                  </button>
                ) : (
                  <span className="citation-resolved">Appeal submitted</span>
                )}
              </article>
            </li>
          ))}
        </ul>
      </section>
      {selectedAppealFine ? (
        <div
          className="resident-dialog-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="appeal-heading"
        >
          <div className="resident-dialog">
            <button
              className="resident-dialog-close"
              type="button"
              onClick={onCloseAppeal}
            >
              Close
            </button>
            <div className="appeal-layout">
              <div className="appeal-summary">
                <p className="citation-photo">{selectedAppealFine.photo}</p>
                <span className="ticket-id">{selectedAppealFine.id}</span>
                <h3>{selectedAppealFine.violation}</h3>
                <p>{selectedAppealFine.date}</p>
                <strong>{currency.format(selectedAppealFine.amount)}</strong>
              </div>
              <div className="appeal-form">
                <p className="section-label">Your statement</p>
                <h3 id="appeal-heading">Submit appeal</h3>
                <textarea
                  value={appealStatement}
                  onChange={(event) =>
                    onAppealStatementChange(event.target.value)
                  }
                  placeholder="Write your statement here"
                />
                <label>
                  <input type="checkbox" />
                  Upload photo or document
                </label>
                <button
                  className="resident-primary-btn"
                  type="button"
                  onClick={onSubmitAppeal}
                >
                  Submit appeal
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}