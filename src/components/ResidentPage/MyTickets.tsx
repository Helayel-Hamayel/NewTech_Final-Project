import { useState } from "react";
import type { SubmitEvent } from "react";
import type { MaintenanceTicket, ResidentServiceRequest } from "../../data/residentPortal";
import { currency } from "../../helpers/formatting/currency";
import type { MyTicketsProps } from "./types";

const requestTypes = [
  "Parking",
  "Road and sidewalk",
  "Lighting",
  "Waste and sanitation",
  "Noise",
  "Maintenance",
  "Repair",
  "Inspection",
  "Utility service",
  "Other",
];

export default function MyTickets({
  serviceRequests,
  fines,
  onOpenAppeal,
  selectedAppealFine,
  appealStatement,
  onAppealStatementChange,
  onSubmitAppeal,
  onCloseAppeal,
  onAddServiceRequest,
}: MyTicketsProps) {
  const [activeSection, setActiveSection] = useState<"requests" | "fines">("requests");
  const [selectedCitationFine, setSelectedCitationFine] = useState<MyTicketsProps["selectedAppealFine"]>(null);
  const [appealReason, setAppealReason] = useState("Incorrect information");
  const [appealContact, setAppealContact] = useState("Email");

  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [requestForm, setRequestForm] = useState({
    type: requestTypes[0],
    description: "",
    location: "",
    phone: "",
  });

  const ticketStages: MaintenanceTicket["stage"][] = ["Reported", "Dispatched", "In Progress", "Resolved"];

  function updateRequestForm(field: keyof typeof requestForm, value: string) {
    setRequestForm((current) => ({ ...current, [field]: value }));
  }

  async function handleServiceRequestSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    const form = event.currentTarget;

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (photo && photo.size > 5 * 1024 * 1024) {
        throw new Error("The photo must be 5 MB or smaller.");
      }

      const formData = new FormData();

      formData.append("category", requestForm.type);
      formData.append("description", requestForm.description.trim());
      formData.append("location", requestForm.location.trim());
      formData.append("phone", requestForm.phone.trim());

      if (photo) {
        formData.append("photo", photo);
      }

      const response = await fetch("http://localhost:4000/reports", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(errorData?.message ?? "Could not create the report.");
      }

      const report = await response.json();

      const newRequest: ResidentServiceRequest = {
        id: report._id,
        type: report.category,
        description: report.description,
        location: report.location,
        phone: report.phone,
        attachment: report.photoUrl,
        reportedDate: new Date(report.createdAt).toLocaleString("en-GB", {
          timeZone: "Asia/Jerusalem",
          dateStyle: "short",
          timeStyle: "short",
        }),
        stage: "Reported",
        preferredDate: "",
      };

      onAddServiceRequest(newRequest);

      setRequestForm({
        type: requestTypes[0],
        description: "",
        location: "",
        phone: "",
      });

      setPhoto(null);
      form.reset();
      setSuccess("Your report was submitted successfully.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong while submitting the report.");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <section className="resident-view" aria-labelledby="services-heading">
      <header className="resident-page-intro">
        <p className="section-label">Service center</p>
        <h1 id="services-heading">My services</h1>
        <p>Report community concerns and track service requests in one place.</p>
        <p className="resident-muted" role="note">
          Demo workspace: reports and service requests are temporary and are not sent to city staff.
        </p>
      </header>
      <nav className="tickets-subnav" aria-label="My services sections">
        <button className={activeSection === "requests" ? "is-active" : ""} type="button" onClick={() => setActiveSection("requests")}>
          Service requests
        </button>
        <button className={activeSection === "fines" ? "is-active" : ""} type="button" onClick={() => setActiveSection("fines")}>
          Fines &amp; citations
        </button>
      </nav>
      {activeSection === "requests" ? (
        <section className="resident-card tickets-section" aria-labelledby="requests-heading">
          <div className="resident-card-header">
            <div>
              <p className="section-label">Community and home services</p>
              <h2 id="requests-heading">Report a problem or request</h2>
            </div>
          </div>
          <form className="service-request-form" onSubmit={handleServiceRequestSubmit}>
            <label>
              What do you need help with?
              <select value={requestForm.type} onChange={(event) => updateRequestForm("type", event.target.value)}>
                {requestTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label>
              Description
              <textarea
                required
                value={requestForm.description}
                onChange={(event) => updateRequestForm("description", event.target.value)}
                placeholder="Describe the service needed"
              />
            </label>
            <label>
              Location
              <input
                required
                value={requestForm.location}
                onChange={(event) => updateRequestForm("location", event.target.value)}
                placeholder="Street, building, or room"
              />
            </label>
            <label>
              Contact phone
              <input
                required
                type="tel"
                value={requestForm.phone}
                onChange={(event) => updateRequestForm("phone", event.target.value)}
                placeholder="050-555-0000"
              />
            </label>
            <label>
              Photo
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  setPhoto(event.target.files?.[0] ?? null);
                }}
              />
            </label>
            <button className="resident-primary-btn" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit report"}
            </button>

            {error && <p role="alert">{error}</p>}
            {success && <p role="status">{success}</p>}
          </form>
          <h3 className="requests-subheading">Your requests</h3>
          {serviceRequests.length === 0 ? (
            <p className="resident-empty-state">No requests yet. Submit a request above to get started.</p>
          ) : (
            <div className="ticket-list">
              {serviceRequests.map((request) => {
                const currentStageIndex = ticketStages.findIndex((stage) => stage === request.stage);
                return (
                  <article className="ticket-card" key={request.id}>
                    <div className="ticket-card-top">
                      <div>
                        <span className="ticket-id">{request.id}</span>
                        <h3>{request.type}</h3>
                      </div>
                      <span className="status-badge status-badge--info">{request.stage}</span>
                    </div>
                    <p className="ticket-location">{request.location}</p>
                    <p className="resident-muted">Reported {request.reportedDate}</p>
                    <p>{request.description}</p>
                    {(request.stage === "Resolved" || request.stage === "Rejected") && request.resolvedAt && (
                      <p className="resident-muted">
                        {request.stage === "Rejected" ? "Rejected at" : "Resolved at"}:{" "}
                        {new Date(request.resolvedAt).toLocaleString("en-GB", {
                          timeZone: "Asia/Jerusalem",
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </p>
                    )}
                    {request.stage === "Rejected" && (
                      <p>
                        <strong>Reason for rejection:</strong> {request.rejectionReason || "No reason provided."}
                      </p>
                    )}
                    {currentStageIndex >= 0 ? (
                      <div className="ticket-progress" aria-label={`Request progress: ${request.stage}`}>
                        {ticketStages.map((stage, index) => (
                          <div
                            className={
                              index < currentStageIndex ? "is-complete" : index === currentStageIndex ? "is-current" : "is-upcoming"
                            }
                            key={`${request.id}-${stage}`}>
                            <span className="ticket-progress-dot">{index <= currentStageIndex ? "●" : "○"}</span>
                            <span>{stage}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      ) : null}
      {activeSection === "fines" ? (
        <section className="resident-card tickets-section" aria-labelledby="citations-heading">
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
                    <span className={`status-badge ${fine.status === "Unpaid" ? "status-badge--unpaid" : "status-badge--paid"}`}>
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
                      <button className="resident-secondary-btn" type="button" onClick={() => setSelectedCitationFine(fine)}>
                        View details
                      </button>
                      <button className="resident-primary-btn" type="button" onClick={() => onOpenAppeal(fine)}>
                        File appeal
                      </button>
                    </div>
                  ) : (
                    <div className="citation-actions">
                      <button className="resident-secondary-btn" type="button" onClick={() => setSelectedCitationFine(fine)}>
                        View details
                      </button>
                      <span className="citation-resolved">Appeal submitted</span>
                    </div>
                  )}
                </article>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {selectedAppealFine ? (
        <div className="resident-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="appeal-heading">
          <div className="resident-dialog">
            <button className="resident-dialog-close" type="button" onClick={onCloseAppeal}>
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
                  <select value={appealReason} onChange={(event) => setAppealReason(event.target.value)}>
                    <option>Incorrect information</option>
                    <option>Violation was not mine</option>
                    <option>Special circumstances</option>
                    <option>Already resolved</option>
                  </select>
                </label>
                <textarea
                  required
                  value={appealStatement}
                  onChange={(event) => onAppealStatementChange(event.target.value)}
                  placeholder="Write your statement here"
                />
                <label className="appeal-field appeal-contact-field">
                  Preferred response method
                  <select value={appealContact} onChange={(event) => setAppealContact(event.target.value)}>
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
                <button className="resident-primary-btn" type="button" onClick={onSubmitAppeal}>
                  Submit appeal
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {selectedCitationFine ? (
        <div className="resident-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="citation-details-heading">
          <div className="resident-dialog citation-detail-dialog">
            <button className="resident-dialog-close" type="button" onClick={() => setSelectedCitationFine(null)}>
              Close
            </button>
            <p className="section-label">Citation details</p>
            <h2 id="citation-details-heading">{selectedCitationFine.id}</h2>
            <p className="citation-detail-violation">{selectedCitationFine.violation}</p>
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
                }}>
                File an appeal
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
