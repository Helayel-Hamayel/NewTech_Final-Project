import type { StaffServiceRequest } from "../../data/staffData";
import { CheckCircle2, Clock, Image as ImageIcon, MapPin, X } from "lucide-react";
import { useState } from "react";
import type { Dispatch, SetStateAction, SubmitEvent } from "react";
import { toast } from "sonner";
import ImagePreview from "../common/ImagePreview";

type MaintenanceDispatchProps = {
  tickets: StaffServiceRequest[];
  search: string;
  setRequests: Dispatch<SetStateAction<StaffServiceRequest[]>>;
};

const columns = [
  { status: "Assigned", label: "Dispatched", color: "amber" },
  { status: "In Progress", label: "In Progress", color: "blue" },
  { status: "Resolved", label: "Completed", color: "emerald" },
  { status: "Rejected", label: "Rejected", color: "slate" },
] as const;

const progressSteps = ["Dispatched", "In progress", "Completed"] as const;

export default function MaintenanceDispatch({ tickets, search, setRequests }: MaintenanceDispatchProps) {
  const normalizedSearch = search.trim().toLowerCase();

  const matchingTickets = tickets.filter((ticket) =>
    [ticket.id, ticket.type, ticket.description, ticket.location, ticket.status].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    ),
  );

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState("");
  const [activeStatus, setActiveStatus] = useState<(typeof columns)[number]["status"]>("Assigned");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [progressNote, setProgressNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const selectedTicket = tickets.find((ticket) => ticket.id === selectedId) ?? null;

  function openDetails(ticketId: string) {
    setSelectedId(ticketId);
    setProgressNote("");
    setUpdateError("");
  }

  function isActive(ticket: StaffServiceRequest) {
    return ticket.status === "Assigned" || ticket.status === "In Progress";
  }

  async function addProgress(event: SubmitEvent<HTMLFormElement>, ticket: StaffServiceRequest) {
    event.preventDefault();

    const note = progressNote.trim();

    if (!note || savingNote) return;

    setSavingNote(true);

    try {
      const response = await fetch(`/api/reports/${ticket.id}/maintenance-progress`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(errorData?.message ?? "Could not save the progress note.");
      }

      const updatedReport = await response.json();

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === updatedReport._id
            ? { ...request, progressUpdates: updatedReport.progressUpdates ?? [] }
            : request,
        ),
      );
      setProgressNote("");
      toast.success("Progress logged");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the progress note.");
    } finally {
      setSavingNote(false);
    }
  }

  async function advanceStatus(ticket: StaffServiceRequest) {
    if (updatingId) return;

    if (ticket.status !== "Assigned" && ticket.status !== "In Progress") {
      return;
    }

    const nextStatus = ticket.status === "Assigned" ? "IN PROGRESS" : "RESOLVED";

    setUpdatingId(ticket.id);
    setUpdateError("");

    try {
      const response = await fetch(`/api/reports/${ticket.id}/maintenance-status`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(errorData?.message ?? "Could not update the report.");
      }

      const updatedReport = await response.json();

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === updatedReport._id
            ? {
                ...request,
                status: updatedReport.status === "RESOLVED" ? "Resolved" : "In Progress",
                resolvedAt: updatedReport.resolvedAt,
              }
            : request,
        ),
      );
      toast.success(nextStatus === "RESOLVED" ? "Maintenance completed" : "Maintenance started", {
        description:
          nextStatus === "RESOLVED" ? "The report has been marked as resolved." : "The report is now in progress.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not create the fine.";

      setUpdateError(message);
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  }
  return (
    <section className="staff-maintenance-section" aria-labelledby="maintenance-heading">
      <header className="staff-maintenance-heading">
        <section>
          <p className="staff-section-label">City service requests</p>
          <h2 id="maintenance-heading">Maintenance dispatch</h2>
        </section>
      </header>
      {updateError && <p role="alert">{updateError}</p>}
      <nav className="staff-kanban-tabs" aria-label="Maintenance status">
        {columns.map((column) => (
          <button
            key={column.status}
            type="button"
            className={`staff-kanban-tab staff-kanban-tab--${column.color}${activeStatus === column.status ? " is-active" : ""}`}
            aria-pressed={activeStatus === column.status}
            onClick={() => setActiveStatus(column.status)}
          >
            <span>{column.label}</span>
            <strong>{matchingTickets.filter((ticket) => ticket.status === column.status).length}</strong>
          </button>
        ))}
      </nav>
      <section className="staff-kanban-scroll" aria-label="Maintenance board">
        <section className="staff-kanban">
          {columns.map((column) => {
            const columnTickets = matchingTickets.filter((ticket) => ticket.status === column.status);

            return (
              <section
                key={column.status}
                className={`staff-kanban-column staff-kanban-column--${column.color}${activeStatus === column.status ? " is-mobile-active" : ""}`}
              >
                <header>
                  <h3>{column.label}</h3>
                  <span>{columnTickets.length}</span>
                </header>

                <section className="staff-ticket-list">
                  {columnTickets.map((ticket) => (
                    <article className="staff-maintenance-card" key={ticket.id}>
                      <span className="staff-ticket-id">{ticket.id}</span>
                      <h4>{ticket.type}</h4>

                      <p className="staff-ticket-location">
                        <MapPin size={13} aria-hidden="true" />
                        <span>{ticket.location}</span>
                      </p>

                      <p className="staff-ticket-description">{ticket.description}</p>

                      <footer className="staff-ticket-footer">
                        <p className="staff-ticket-meta">
                          <Clock size={12} aria-hidden="true" />
                          <span>Reported {ticket.reported}</span>
                        </p>
                        {(ticket.status === "Resolved" || ticket.status === "Rejected") && ticket.resolvedAt && (
                          <p className="staff-ticket-meta">
                            <CheckCircle2 size={12} aria-hidden="true" />
                            <span>
                              {ticket.status === "Rejected" ? "Rejected" : "Completed"}{" "}
                              {new Date(ticket.resolvedAt).toLocaleString("en-GB", {
                                timeZone: "Asia/Jerusalem",
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </span>
                          </p>
                        )}
                      </footer>

                      {ticket.status === "Rejected" && (
                        <p className="staff-ticket-reason">
                          <strong>Reason</strong>
                          {ticket.rejectionReason || "No reason provided."}
                        </p>
                      )}

                      <section className="staff-ticket-actions">
                        <button className="staff-assign-team" type="button" onClick={() => openDetails(ticket.id)}>
                          Show details
                        </button>
                      </section>
                    </article>
                  ))}

                  {columnTickets.length === 0 && <p className="staff-column-empty">No tickets here.</p>}
                </section>
              </section>
            );
          })}
        </section>
      </section>

      {selectedTicket ? (
        <section className="staff-modal-backdrop">
          <section
            className="staff-ticket-dialog staff-maintenance-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="maintenance-dialog-heading"
          >
            <header className="staff-dialog-heading">
              <section>
                <p className="staff-section-label">Job {selectedTicket.id}</p>
                <h2 id="maintenance-dialog-heading">{selectedTicket.type}</h2>
              </section>
              <button
                className="staff-dialog-close"
                type="button"
                aria-label="Close job details"
                disabled={updatingId !== null || savingNote}
                onClick={() => setSelectedId(null)}
              >
                <X size={19} aria-hidden="true" />
              </button>
            </header>

            <ol className="staff-progress-steps" aria-label="Job progress">
              {progressSteps.map((step, index) => {
                const currentIndex =
                  selectedTicket.status === "Resolved" ? 2 : selectedTicket.status === "In Progress" ? 1 : 0;
                const isRejected = selectedTicket.status === "Rejected";
                const stateClass = isRejected
                  ? ""
                  : index < currentIndex || (index === 2 && currentIndex === 2)
                    ? " is-done"
                    : index === currentIndex
                      ? " is-current"
                      : "";

                return (
                  <li key={step} className={`staff-progress-step${stateClass}`}>
                    <span aria-hidden="true">{stateClass === " is-done" ? <CheckCircle2 size={14} /> : index + 1}</span>
                    {step}
                  </li>
                );
              })}
            </ol>

            <dl className="staff-service-request-details">
              <div>
                <dt>Resident</dt>
                <dd>{selectedTicket.residentName}</dd>
              </div>
              <div>
                <dt>Reported</dt>
                <dd>{selectedTicket.reported}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{selectedTicket.location}</dd>
              </div>
              <div>
                <dt>Contact phone</dt>
                <dd>{selectedTicket.phone}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{selectedTicket.status}</dd>
              </div>
              <div>
                <dt>Attachment</dt>
                <dd>
                  {selectedTicket.attachment ? (
                    <ImagePreview
                      className="staff-photo-button"
                      src={selectedTicket.attachment}
                      alt={`Photo attached to ${selectedTicket.type}`}
                      label="View attached photo"
                    >
                      <ImageIcon size={14} aria-hidden="true" />
                      View photo
                    </ImagePreview>
                  ) : (
                    "No photo"
                  )}
                </dd>
              </div>
            </dl>

            <section className="staff-service-request-description">
              <h3>Issue description</h3>
              <p>{selectedTicket.description}</p>
            </section>

            {selectedTicket.status === "Rejected" && (
              <section className="staff-service-request-rejection">
                <h3>Rejection reason</h3>
                <p>{selectedTicket.rejectionReason || "No reason provided."}</p>
              </section>
            )}

            <section className="staff-progress-log">
              <h3>Progress log</h3>
              {(selectedTicket.progressUpdates ?? []).length === 0 ? (
                <p className="staff-progress-empty">No progress has been logged yet.</p>
              ) : (
                <ul>
                  {[...(selectedTicket.progressUpdates ?? [])].reverse().map((update, index) => (
                    <li key={update._id ?? `${update.createdAt}-${index}`}>
                      <time dateTime={update.createdAt}>
                        {new Date(update.createdAt).toLocaleString("en-GB", {
                          timeZone: "Asia/Jerusalem",
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </time>
                      <p>{update.note}</p>
                    </li>
                  ))}
                </ul>
              )}

              {isActive(selectedTicket) && (
                <form className="staff-progress-form" onSubmit={(event) => addProgress(event, selectedTicket)}>
                  <label htmlFor="maintenance-progress-note">
                    Add progress update
                    <textarea
                      id="maintenance-progress-note"
                      rows={3}
                      maxLength={500}
                      value={progressNote}
                      onChange={(event) => setProgressNote(event.target.value)}
                      placeholder="e.g. Crew on site, materials ordered"
                    />
                  </label>
                  <button className="staff-photo-button" type="submit" disabled={savingNote || !progressNote.trim()}>
                    {savingNote ? "Saving..." : "Log update"}
                  </button>
                </form>
              )}
            </section>

            {isActive(selectedTicket) && (
              <footer className="staff-progress-footer">
                <button
                  className="staff-assign-team"
                  type="button"
                  disabled={updatingId !== null || savingNote}
                  onClick={() => advanceStatus(selectedTicket)}
                >
                  {updatingId === selectedTicket.id
                    ? "Saving..."
                    : selectedTicket.status === "Assigned"
                      ? "Start work"
                      : "Mark completed"}
                </button>
              </footer>
            )}
          </section>
        </section>
      ) : null}
    </section>
  );
}
