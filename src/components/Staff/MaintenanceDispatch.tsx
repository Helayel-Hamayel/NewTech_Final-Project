import { useState } from "react";
import type { FormEvent } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Plus, X } from "lucide-react";
import type { StaffMaintenanceTicket } from "../../data/staffData";

const ticketColumns: StaffMaintenanceTicket["status"][] = [
  "Unassigned",
  "Dispatched",
  "In Progress",
  "Completed",
];

const columnClass: Record<StaffMaintenanceTicket["status"], string> = {
  Unassigned: "slate",
  Dispatched: "amber",
  "In Progress": "blue",
  Completed: "emerald",
};

type MaintenanceDispatchProps = {
  tickets: StaffMaintenanceTicket[];
  search: string;
  setTickets: Dispatch<SetStateAction<StaffMaintenanceTicket[]>>;
};

export default function MaintenanceDispatch({
  tickets,
  search,
  setTickets,
}: MaintenanceDispatchProps) {
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [newTicketIssue, setNewTicketIssue] = useState("");
  const [newTicketLocation, setNewTicketLocation] = useState("");
  const [newTicketPriority, setNewTicketPriority] =
    useState<StaffMaintenanceTicket["priority"]>("Medium");
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const matchingTickets = tickets.filter((ticket) =>
    [
      ticket.id,
      ticket.issue,
      ticket.location,
      ticket.team ?? "",
      ticket.status,
    ].some((value) => value.toLocaleLowerCase().includes(normalizedSearch)),
  );

  function handleAssignTeam(ticketId: string) {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === ticketId && ticket.status === "Unassigned"
          ? {
              ...ticket,
              status: "Dispatched",
              team: "Team Alpha",
              eta: "30m",
            }
          : ticket,
      ),
    );
  }

  function handleCreateTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextNumber =
      Math.max(
        2209,
        ...tickets.map((ticket) => Number(ticket.id.replace("TKT-", ""))),
      ) + 1;
    const ticket: StaffMaintenanceTicket = {
      id: `TKT-${nextNumber}`,
      issue: newTicketIssue.trim(),
      location: newTicketLocation.trim(),
      priority: newTicketPriority,
      status: "Unassigned",
      reported: "Just now",
    };
    setTickets((currentTickets) => [ticket, ...currentTickets]);
    setNewTicketIssue("");
    setNewTicketLocation("");
    setNewTicketPriority("Medium");
    setIsNewTicketOpen(false);
  }

  return (
    <>
      <section
        className="staff-maintenance-section"
        aria-labelledby="maintenance-heading"
      >
        <div className="staff-maintenance-heading">
          <div>
            <p className="staff-section-label">City service requests</p>
            <h2 id="maintenance-heading">Maintenance dispatch</h2>
          </div>
          <button
            className="staff-new-ticket"
            type="button"
            onClick={() => setIsNewTicketOpen(true)}
          >
            <Plus size={17} aria-hidden="true" />
            New Ticket
          </button>
        </div>
        <div className="staff-kanban-scroll" aria-label="Maintenance board">
          <div className="staff-kanban">
            {ticketColumns.map((status) => {
              const columnTickets = matchingTickets.filter(
                (ticket) => ticket.status === status,
              );
              return (
                <section
                  className={`staff-kanban-column staff-kanban-column--${columnClass[status]}`}
                  key={status}
                  aria-labelledby={`column-${columnClass[status]}`}
                >
                  <header>
                    <h3 id={`column-${columnClass[status]}`}>{status}</h3>
                    <span>{columnTickets.length}</span>
                  </header>
                  <div className="staff-ticket-list">
                    {columnTickets.map((ticket) => (
                      <article
                        className="staff-maintenance-card"
                        key={ticket.id}
                      >
                        <div className="staff-maintenance-card-top">
                          <span className="staff-ticket-id">{ticket.id}</span>
                          <span
                            className={`staff-priority staff-priority--${ticket.priority.toLowerCase()}`}
                          >
                            {ticket.priority}
                          </span>
                        </div>
                        <h4>{ticket.issue}</h4>
                        <p className="staff-ticket-location">
                          {ticket.location}
                        </p>
                        {ticket.status === "Dispatched" ? (
                          <p className="staff-ticket-meta">
                            {ticket.team} · ETA {ticket.eta}
                          </p>
                        ) : ticket.status === "In Progress" ? (
                          <p className="staff-ticket-meta">{ticket.team}</p>
                        ) : ticket.status === "Completed" ? (
                          <p className="staff-ticket-meta">
                            Done {ticket.completedAt}
                          </p>
                        ) : (
                          <p className="staff-ticket-meta">
                            Reported {ticket.reported}
                          </p>
                        )}
                        {ticket.status === "Unassigned" ? (
                          <button
                            className="staff-assign-team"
                            type="button"
                            onClick={() => handleAssignTeam(ticket.id)}
                          >
                            Assign Team
                          </button>
                        ) : null}
                      </article>
                    ))}
                    {columnTickets.length === 0 ? (
                      <p className="staff-column-empty">No tickets here.</p>
                    ) : null}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      {isNewTicketOpen ? (
        <div className="staff-modal-backdrop">
          <section
            className="staff-ticket-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-ticket-heading"
          >
            <div className="staff-dialog-heading">
              <div>
                <p className="staff-section-label">Maintenance dispatch</p>
                <h2 id="new-ticket-heading">Create a new ticket</h2>
              </div>
              <button
                className="staff-dialog-close"
                type="button"
                aria-label="Close new ticket form"
                onClick={() => setIsNewTicketOpen(false)}
              >
                <X size={19} aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleCreateTicket}>
              <label>
                Issue
                <input
                  required
                  value={newTicketIssue}
                  onChange={(event) => setNewTicketIssue(event.target.value)}
                  placeholder="e.g. Broken streetlight"
                />
              </label>
              <label>
                Location
                <input
                  required
                  value={newTicketLocation}
                  onChange={(event) =>
                    setNewTicketLocation(event.target.value)
                  }
                  placeholder="Street or intersection"
                />
              </label>
              <label>
                Priority
                <select
                  value={newTicketPriority}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (
                      value === "High" ||
                      value === "Medium" ||
                      value === "Low"
                    ) {
                      setNewTicketPriority(value);
                    }
                  }}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </label>
              <div className="staff-dialog-actions">
                <button
                  className="staff-cancel"
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                >
                  Cancel
                </button>
                <button className="staff-new-ticket" type="submit">
                  <Plus size={16} aria-hidden="true" />
                  Create Ticket
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
