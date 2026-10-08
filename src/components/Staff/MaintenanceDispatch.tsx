import type { StaffServiceRequest } from "../../data/staffData";
import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";

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
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : "Could not update the report.");
    } finally {
      setUpdatingId(null);
    }
  }
  return (
    <section className="staff-maintenance-section" aria-labelledby="maintenance-heading">
      <div className="staff-maintenance-heading">
        <div>
          <p className="staff-section-label">City service requests</p>
          <h2 id="maintenance-heading">Maintenance dispatch</h2>
        </div>
      </div>
      {updateError && <p role="alert">{updateError}</p>}
      <div className="staff-kanban-scroll" aria-label="Maintenance board">
        <div className="staff-kanban">
          {columns.map((column) => {
            const columnTickets = matchingTickets.filter((ticket) => ticket.status === column.status);

            return (
              <section key={column.status} className={`staff-kanban-column staff-kanban-column--${column.color}`}>
                <header>
                  <h3>{column.label}</h3>
                  <span>{columnTickets.length}</span>
                </header>

                <div className="staff-ticket-list">
                  {columnTickets.map((ticket) => (
                    <article className="staff-maintenance-card" key={ticket.id}>
                      <span className="staff-ticket-id">{ticket.id}</span>
                      <h4>{ticket.type}</h4>

                      <p className="staff-ticket-location">{ticket.location}</p>

                      <p>{ticket.description}</p>

                      <p className="staff-ticket-meta">Reported {ticket.reported}</p>
                      {(ticket.status === "Resolved" || ticket.status === "Rejected") && ticket.resolvedAt && (
                        <p className="staff-ticket-meta">
                          {ticket.status === "Rejected" ? "Rejected at" : "Completed at"}:{" "}
                          {new Date(ticket.resolvedAt).toLocaleString("en-GB", {
                            timeZone: "Asia/Jerusalem",
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </p>
                      )}
                      {ticket.attachment && (
                        <a href={ticket.attachment} target="_blank" rel="noopener noreferrer">
                          View photo
                        </a>
                      )}
                      {ticket.status === "Rejected" && (
                        <p>
                          <strong>Reason:</strong> {ticket.rejectionReason || "No reason provided."}
                        </p>
                      )}

                      {(ticket.status === "Assigned" || ticket.status === "In Progress") && (
                        <button
                          className="staff-assign-team"
                          type="button"
                          disabled={updatingId !== null}
                          onClick={() => advanceStatus(ticket)}>
                          {updatingId === ticket.id ? "Saving..." : ticket.status === "Assigned" ? "Start work" : "Mark completed"}
                        </button>
                      )}
                    </article>
                  ))}

                  {columnTickets.length === 0 && <p className="staff-column-empty">No tickets here.</p>}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
