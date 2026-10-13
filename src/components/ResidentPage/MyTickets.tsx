import { useState } from "react";
import LoadingState from "../common/LoadingState";
import { Camera, Eye, ImageOff, MapPin } from "lucide-react";
import type { SubmitEvent } from "react";
import type { MaintenanceTicket, ResidentServiceRequest } from "../../data/residentPortal";
import { currency } from "../../helpers/formatting/currency";
import type { MyTicketsProps } from "./types";
import ResidentAppeals from "./ResidentAppeals";
import { useUser } from "../../contexts/useUser";
import AppealPhotoPicker from "./AppealPhotoPicker";
import PaymentCheckout from "./PaymentCheckout";
import MapPicker from "./MapPicker";
import RequestDetails from "./RequestDetails";
import { toast } from "sonner";
import ImagePreview from "../common/ImagePreview";

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
  finesLoading,
  finesError,
  onOpenAppeal,
  selectedAppealFine,
  appealStatement,
  appealSubmitting,
  appealError,
  onAppealStatementChange,
  onSubmitAppeal,
  onCloseAppeal,
  onAddServiceRequest,
  onPay,
}: MyTicketsProps) {
  const [activeSection, setActiveSection] = useState<"requests" | "fines">("requests");
  const [selectedCitationFine, setSelectedCitationFine] = useState<MyTicketsProps["selectedAppealFine"]>(null);

  const [photo, setPhoto] = useState<File | null>(null);
  const [appealPhoto, setAppealPhoto] = useState<{ fineId: string; file: File } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [mapOpen, setMapOpen] = useState(false);
  const [detailsRequest, setDetailsRequest] = useState<ResidentServiceRequest | null>(null);
  const [requestForm, setRequestForm] = useState({
    type: requestTypes[0],
    description: "",
    location: "",
    phone: "",
  });

  const [fineToPay, setFineToPay] = useState<{
    id: string;
    amount: number;
  } | null>(null);

  const ticketStages: MaintenanceTicket["stage"][] = ["Reported", "Dispatched", "In Progress", "Resolved"];

  const { user } = useUser();

  function updateRequestForm(field: keyof typeof requestForm, value: string) {
    setRequestForm((current) => ({ ...current, [field]: value }));
  }

  async function handleServiceRequestSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    const form = event.currentTarget;

    setSubmitting(true);
    setError("");

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
      toast.success("Report submitted", {
        description: "Your report has been sent to staff for review.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not create the fine.";

      setError(message);
      toast.error(message);
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
          <section className="resident-card-header">
            <section>
              <p className="section-label">Community and home services</p>
              <h2 id="requests-heading">Report a problem or request</h2>
            </section>
          </section>
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
              <span className="location-field">
                <input
                  required
                  maxLength={120}
                  value={requestForm.location}
                  onChange={(event) => updateRequestForm("location", event.target.value)}
                  placeholder="Street, building, or room"
                />
                <button type="button" className="location-pin-btn" onClick={() => setMapOpen(true)}>
                  <MapPin size={15} aria-hidden="true" /> Pick on map
                </button>
              </span>
            </label>
            <label>
              Contact phone
              <input
                required
                type="tel"
                inputMode="numeric"
                maxLength={10}
                minLength={9}
                pattern="0[0-9]{8,9}"
                title="Enter 9 or 10 digits starting with 0, e.g. 0505550000"
                value={requestForm.phone}
                onChange={(event) => updateRequestForm("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="0505550000"
              />
            </label>
            <AppealPhotoPicker file={photo} disabled={submitting} onChange={setPhoto} title="Photo" />
            <button className="resident-primary-btn" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit report"}
            </button>

            {error && <p role="alert">{error}</p>}
          </form>
          {mapOpen && (
            <MapPicker
              onClose={() => setMapOpen(false)}
              onConfirm={(address) => {
                updateRequestForm("location", address.slice(0, 120));
                setMapOpen(false);
              }}
            />
          )}
          <h3 className="requests-subheading">Your requests</h3>
          {detailsRequest && <RequestDetails request={detailsRequest} onClose={() => setDetailsRequest(null)} />}
          {serviceRequests.length === 0 ? (
            <p className="resident-empty-state">No requests yet. Submit a request above to get started.</p>
          ) : (
            <ul className="ticket-list">
              {serviceRequests.map((request) => {
                const currentStageIndex = ticketStages.findIndex((stage) => stage === request.stage);
                return (
                  <li key={request.id}>
                    <article className="ticket-card">
                      <section className="ticket-card-top">
                        <section>
                          <span className="ticket-id">{request.id}</span>
                          <h3>{request.type}</h3>
                        </section>
                        <span className="status-badge status-badge--info">{request.stage}</span>
                      </section>
                      <p className="ticket-location">
                        <MapPin size={14} aria-hidden="true" />
                        {request.location}
                      </p>
                      <p className="resident-muted ticket-date">Reported {request.reportedDate}</p>
                      <p className="ticket-description">{request.description}</p>
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
                        <section className="ticket-progress" aria-label={`Request progress: ${request.stage}`}>
                          {ticketStages.map((stage, index) => (
                            <section
                              className={
                                index < currentStageIndex ? "is-complete" : index === currentStageIndex ? "is-current" : "is-upcoming"
                              }
                              key={`${request.id}-${stage}`}>
                              <span className="ticket-progress-dot">{index <= currentStageIndex ? "●" : "○"}</span>
                              <span>{stage}</span>
                            </section>
                          ))}
                        </section>
                      ) : null}
                      <button
                        className="resident-secondary-btn ticket-details-btn"
                        type="button"
                        onClick={() => setDetailsRequest(request)}>
                        <Eye size={15} aria-hidden="true" /> View details
                      </button>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ) : null}
      {activeSection === "fines" ? (
        <section className="resident-card tickets-section" aria-labelledby="citations-heading">
          <section className="resident-card-header">
            <section>
              <p className="section-label">Account notices</p>
              <h2 id="citations-heading">Fines &amp; citations</h2>
            </section>
            <span className="billing-count">{fines.length} records</span>
          </section>
          {finesLoading ? (
            <LoadingState variant="inline" title="Loading fines" description="Fetching your fines." />
          ) : finesError ? (
            <p role="alert">{finesError}</p>
          ) : fines.length === 0 ? (
            <p className="resident-empty-state">You have no fines.</p>
          ) : (
            <ul className="citation-grid">
              {fines.map((fine) => (
                <li key={fine.id}>
                  <article className="citation-card">
                    <section className="citation-card-header">
                      {fine.photoUrl ? (
                        <ImagePreview
                          className="citation-photo"
                          src={fine.photoUrl}
                          alt={`Photo evidence for ${fine.violation}`}
                          label="View fine photo">
                          <Camera size={14} aria-hidden="true" />
                          View photo
                        </ImagePreview>
                      ) : (
                        <span className="citation-photo citation-photo--empty">
                          <ImageOff size={14} aria-hidden="true" />
                          No photo
                        </span>
                      )}
                      <span className={`status-badge ${fine.status === "Unpaid" ? "status-badge--unpaid" : "status-badge--paid"}`}>
                        {fine.status}
                      </span>
                    </section>
                    <h3>{fine.id}</h3>
                    <p className="citation-violation">{fine.violation}</p>
                    <dl className="citation-details">
                      <div>
                        <dt>Vehicle registration</dt>
                        <dd>{fine.licensePlate ?? "Not recorded"}</dd>
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
                      <section className="citation-actions">
                        <button className="resident-secondary-btn" type="button" onClick={() => setSelectedCitationFine(fine)}>
                          View details
                        </button>
                        <button
                          className="resident-primary-btn"
                          type="button"
                          onClick={() =>
                            setFineToPay({
                              id: fine.id,
                              amount: fine.amount,
                            })
                          }>
                          Pay
                        </button>

                        {!fine.appealStatus && (
                          <button className="resident-secondary-btn" type="button" onClick={() => onOpenAppeal(fine)}>
                            File appeal
                          </button>
                        )}
                      </section>
                    ) : (
                      <section className="citation-actions">
                        <button className="resident-secondary-btn" type="button" onClick={() => setSelectedCitationFine(fine)}>
                          View details
                        </button>
                        <span className="citation-resolved">
                          {fine.status === "Paid" ? "Paid" : fine.status === "Waived" ? "Waived" : "Appeal submitted"}
                        </span>
                      </section>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {activeSection === "fines" && <ResidentAppeals appealSubmitting={appealSubmitting} onPay={onPay} fines={fines} />}

      {selectedAppealFine ? (
        <section className="resident-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="appeal-heading">
          <section className="resident-dialog">
            <button className="resident-dialog-close" type="button" onClick={onCloseAppeal} disabled={appealSubmitting}>
              Close
            </button>
            <section className="appeal-layout">
              <section className="appeal-summary">
                <p className="citation-photo">{selectedAppealFine.photo}</p>
                <span className="ticket-id">{selectedAppealFine.id}</span>
                <h3>{selectedAppealFine.violation}</h3>
                <p>{selectedAppealFine.date}</p>
                <strong>{currency.format(selectedAppealFine.amount)}</strong>
              </section>
              <form
                className="appeal-form"
                key={selectedAppealFine.id}
                onSubmit={(event) => {
                  event.preventDefault();

                  const formData = new FormData(event.currentTarget);

                  if (appealPhoto?.fineId === selectedAppealFine.id) {
                    formData.append("photo", appealPhoto.file);
                  }

                  void onSubmitAppeal(formData);
                }}>
                <p className="section-label">Your statement</p>
                <h3 id="appeal-heading">Submit appeal</h3>

                <label className="appeal-field">
                  Appeal reason
                  <select name="reason" defaultValue="Incorrect information" required disabled={appealSubmitting}>
                    <option>Incorrect information</option>
                    <option>Violation was not mine</option>
                    <option>Special circumstances</option>
                    <option>Already resolved</option>
                  </select>
                </label>

                <label className="appeal-field" htmlFor="appeal-description">
                  Description
                </label>

                <textarea
                  id="appeal-description"
                  name="description"
                  required
                  value={appealStatement}
                  disabled={appealSubmitting}
                  onChange={(event) => onAppealStatementChange(event.target.value)}
                  placeholder="Explain why you are appealing this fine"
                />

                <label className="appeal-field appeal-contact-field">
                  Account email
                  <input type="email" value={user?.email ?? ""} readOnly />
                </label>

                <AppealPhotoPicker
                  file={appealPhoto?.fineId === selectedAppealFine.id ? appealPhoto.file : null}
                  disabled={appealSubmitting}
                  onChange={(file) => setAppealPhoto(file ? { fineId: selectedAppealFine.id, file } : null)}
                />

                {appealError && (
                  <p className="appeal-error" role="alert">
                    {appealError}
                  </p>
                )}

                <button className="resident-primary-btn appeal-submit" type="submit" disabled={appealSubmitting || !appealStatement.trim()}>
                  {appealSubmitting ? "Submitting..." : "Submit appeal"}
                </button>
              </form>
            </section>
          </section>
        </section>
      ) : null}
      {selectedCitationFine ? (
        <section className="resident-dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="citation-details-heading">
          <section className="resident-dialog citation-detail-dialog">
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
                <dt>Vehicle registration</dt>
                <dd>{selectedCitationFine.licensePlate ?? "Not recorded"}</dd>
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
                <dd>
                  {selectedCitationFine.photoUrl ? (
                    <ImagePreview
                      src={selectedCitationFine.photoUrl}
                      alt={`Photo evidence for ${selectedCitationFine.violation}`}
                      label="View fine photo">
                      View photo
                    </ImagePreview>
                  ) : (
                    "No photo"
                  )}
                </dd>{" "}
              </div>
            </dl>
            {selectedCitationFine.status === "Unpaid" && !selectedCitationFine.appealStatus ? (
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
          </section>
        </section>
      ) : null}
      {fineToPay && (
        <PaymentCheckout
          amount={fineToPay.amount}
          defaultPayments={1}
          onConfirm={() =>
            onPay({
              months: [],
              fineIds: [fineToPay.id],
            })
          }
          onClose={() => setFineToPay(null)}
        />
      )}
    </section>
  );
}
