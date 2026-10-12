import type { StaffServiceRequest } from "../../data/staffData";
import { CheckCircle2, Clock, Image as ImageIcon, MapPin } from "lucide-react";
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

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

  async function advanceStatus(ticket: StaffServiceRequest) {
    if (updatingId) return;

    if (ticket.status !== "Assigned" && ticket.status !== "In Progress") {
      return;
    }

    const nextStatus = ticket.status === "Assigned" ? "IN PROGRESS" : "RESOLVED";

    setUpdatingId(ticket.id);
    setUpdateError("");

    try {
      const response = await fetch(`http://localhost:4000/reports/${ticket.id}/maintenance-status`, {
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
        description: nextStatus === "RESOLVED" ? "The report has been marked as resolved." : "The report is now in progress.",
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
            onClick={() => setActiveStatus(column.status)}>
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
              <section key={column.status} className={`staff-kanban-column staff-kanban-column--${column.color}${activeStatus === column.status ? " is-mobile-active" : ""}`}>
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

                      {(ticket.attachment || ticket.status === "Assigned" || ticket.status === "In Progress") && (
                        <section className="staff-ticket-actions">
                          {ticket.attachment && (
                            <a
                              className="staff-photo-button"
                              href={ticket.attachment}
                              target="_blank"
                              rel="noopener noreferrer">
                              <ImageIcon size={14} aria-hidden="true" />
                              View photo
                            </a>
                          )}
                          {(ticket.status === "Assigned" || ticket.status === "In Progress") && (
                            <button
                              className="staff-assign-team"
                              type="button"
                              disabled={updatingId !== null}
                              onClick={() => advanceStatus(ticket)}>
                              {updatingId === ticket.id
                                ? "Saving..."
                                : ticket.status === "Assigned"
                                  ? "Start work"
                                  : "Mark completed"}
                            </button>
                          )}
                        </section>
                      )}
                    </article>
                  ))}

                  {columnTickets.length === 0 && <p className="staff-column-empty">No tickets here.</p>}
                </section>
              </section>
            );
          })}
        </section>
      </section>
    </section>
  );
}
