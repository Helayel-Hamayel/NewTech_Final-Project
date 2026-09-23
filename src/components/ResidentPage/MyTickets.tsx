import { useState } from "react";
import type { FormEvent } from "react";
import type {
  MaintenanceTicket,
  ResidentServiceRequest,
} from "../../data/residentPortal";
import { currency } from "../../helpers/formatting/currency";
import ResidentIssues from "./ResidentIssues";
import type { MyTicketsProps } from "./types";

export default function MyTickets({
  tickets,
  serviceRequests,
  fines,
  issues,
  onOpenAppeal,
  selectedAppealFine,
  appealStatement,
  onAppealStatementChange,
  onSubmitAppeal,
  onCloseAppeal,
  onAddIssue,
  onAddServiceRequest,
}: MyTicketsProps) {
  const [activeSection, setActiveSection] = useState<
    "issues" | "maintenance" | "fines"
  >("issues");
  const [selectedCitationFine, setSelectedCitationFine] =
    useState<MyTicketsProps["selectedAppealFine"]>(null);
  const [appealReason, setAppealReason] = useState("Incorrect information");
  const [appealContact, setAppealContact] = useState("Email");
  const [requestForm, setRequestForm] = useState({
    type: "Maintenance",
    description: "",
    location: "",
    preferredDate: "",
    phone: "",
    attachment: "",
  });
  const ticketStages: MaintenanceTicket["stage"][] = [
    "Reported",
    "Dispatched",
    "In Progress",
    "Resolved",
  ];

  function updateRequestForm(field: keyof typeof requestForm, value: string) {
    setRequestForm((current) => ({ ...current, [field]: value }));
  }

  function handleServiceRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const request: ResidentServiceRequest = {
      id: `REQ-${4000 + serviceRequests.length}`,
      type: requestForm.type,
      description: requestForm.description,
      location: requestForm.location,
      preferredDate: requestForm.preferredDate,
      phone: requestForm.phone,
      attachment: requestForm.attachment,
      reportedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      stage: "Reported",
    };
    onAddServiceRequest(request);
    setRequestForm({
      type: "Maintenance",
      description: "",
      location: "",
      preferredDate: "",
      phone: "",
      attachment: "",
    });
  }

  return (
    <section className="resident-view" aria-labelledby="services-heading">
      <header className="resident-page-intro">
        <p className="section-label">Service center</p>
        <h1 id="services-heading">My services</h1>
        <p>
          Report community concerns and track service requests in one place.
        </p>
      </header>
      <nav className="tickets-subnav" aria-label="My services sections">
        <button
          className={activeSection === "issues" ? "is-active" : ""}
          type="button"
          onClick={() => setActiveSection("issues")}
        >
          Report a Community Issue
        </button>
        <button
          className={activeSection === "maintenance" ? "is-active" : ""}
          type="button"
          onClick={() => setActiveSection("maintenance")}
        >
          Track Service Requests
        </button>
        <button
          className={activeSection === "fines" ? "is-active" : ""}
          type="button"
          onClick={() => setActiveSection("fines")}
        >
          Fines &amp; citations
        </button>
      </nav>
      {activeSection === "issues" ? (
        <ResidentIssues issues={issues} onAddIssue={onAddIssue} />
      ) : null}
      {activeSection === "maintenance" ? (
        <section
          className="resident-card tickets-section"
          aria-labelledby="maintenance-heading"
        >
          <div className="resident-card-header">
            <div>
              <p className="section-label">Home and street services</p>
              <h2 id="maintenance-heading">Track Service Requests</h2>
            </div>
          </div>
          <form
            className="service-request-form"
            onSubmit={handleServiceRequestSubmit}
          >
            <label>
              Request type
              <select
                value={requestForm.type}
                onChange={(event) =>
                  updateRequestForm("type", event.target.value)
                }
              >
                <option>Maintenance</option>
                <option>Repair</option>
                <option>Inspection</option>
                <option>Utility service</option>
              </select>
            </label>
            <label>
              Description
              <textarea
                required
                value={requestForm.description}
                onChange={(event) =>
                  updateRequestForm("description", event.target.value)
                }
                placeholder="Describe the service needed"
              />
            </label>
            <label>
              Location
              <input
                required
                value={requestForm.location}
                onChange={(event) =>
                  updateRequestForm("location", event.target.value)
                }
                placeholder="Street, building, or room"
              />
            </label>
            <label>
              Preferred visit date
              <input
                type="date"
                value={requestForm.preferredDate}
                onChange={(event) =>
                  updateRequestForm("preferredDate", event.target.value)
                }
              />
            </label>
            <label>
              Contact phone
              <input
                required
                type="tel"
                value={requestForm.phone}
                onChange={(event) =>
                  updateRequestForm("phone", event.target.value)
                }
                placeholder="(555) 010-0000"
              />
            </label>
            <label>
              Photo or document
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(event) =>
                  updateRequestForm(
                    "attachment",
                    event.target.files?.[0]?.name ?? "",
                  )
                }
              />
            </label>
            <button className="resident-primary-btn" type="submit">
              Submit service request
            </button>
          </form>
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
                  <p className="resident-muted">
                    Reported {ticket.reportedDate}
                  </p>
                  <div
                    className="ticket-progress"
                    aria-label={`Maintenance progress: ${ticket.stage}`}
                  >
                    {ticketStages.map((stage, index) => (
                      <div
                        className={
                          index < currentStageIndex
                            ? "is-complete"
                            : index === currentStageIndex
                              ? "is-current"
                              : "is-upcoming"
                        }
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
      ) : null}
      {activeSection === "fines" ? (
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
                    <div className="citation-actions">
                      <button
                        className="resident-secondary-btn"
                        type="button"
                        onClick={() => setSelectedCitationFine(fine)}
                      >
                        View details
                      </button>
                      <button
                        className="resident-primary-btn"
                        type="button"
                        onClick={() => onOpenAppeal(fine)}
                      >
                        File appeal
                      </button>
                    </div>
                  ) : (
                    <div className="citation-actions">
                      <button
                        className="resident-secondary-btn"
                        type="button"
                        onClick={() => setSelectedCitationFine(fine)}
                      >
                        View details
                      </button>
                      <span className="citation-resolved">
                        Appeal submitted
                      </span>
                    </div>
                  )}
                </article>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
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
                <label className="appeal-field">
                  Appeal reason
                  <select
                    value={appealReason}
                    onChange={(event) => setAppealReason(event.target.value)}
                  >
                    <option>Incorrect information</option>
                    <option>Violation was not mine</option>
                    <option>Special circumstances</option>
                    <option>Already resolved</option>
                  </select>
                </label>
                <textarea
                  required
                  value={appealStatement}
                  onChange={(event) =>
                    onAppealStatementChange(event.target.value)
                  }
                  placeholder="Write your statement here"
                />
                <label className="appeal-field appeal-contact-field">
                  Preferred response method
                  <select
                    value={appealContact}
                    onChange={(event) => setAppealContact(event.target.value)}
                  >
                    <option>Email</option>
                    <option>Phone</option>
                    <option>Portal message</option>
                  </select>
                </label>
                <label className="appeal-upload-option">
                  Upload photo or document
                  <input type="file" accept="image/*,.pdf" />
                  <span>Choose an image or PDF</span>
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
      {selectedCitationFine ? (
        <div
          className="resident-dialog-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="citation-details-heading"
        >
          <div className="resident-dialog citation-detail-dialog">
            <button
              className="resident-dialog-close"
              type="button"
              onClick={() => setSelectedCitationFine(null)}
            >
              Close
            </button>
            <p className="section-label">Citation details</p>
            <h2 id="citation-details-heading">{selectedCitationFine.id}</h2>
            <p className="citation-detail-violation">
              {selectedCitationFine.violation}
            </p>
            <dl className="citation-detail-list">
              <div>
                <dt>Status</dt>
                <dd>{selectedCitationFine.status}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{selectedCitationFine.location}</dd>
              </div>
              <div>
                <dt>Date issued</dt>
                <dd>{selectedCitationFine.date}</dd>
              </div>
              <div>
                <dt>Amount</dt>
                <dd>{currency.format(selectedCitationFine.amount)}</dd>
              </div>
              <div>
                <dt>Evidence</dt>
                <dd>{selectedCitationFine.photo}</dd>
              </div>
            </dl>
            {selectedCitationFine.status === "Unpaid" ? (
              <button
                className="resident-primary-btn"
                type="button"
                onClick={() => {
                  onOpenAppeal(selectedCitationFine);
                  setSelectedCitationFine(null);
                }}
              >
                File an appeal
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
