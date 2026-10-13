import { useEffect, useState } from "react";
import type { SubmitEvent, Dispatch, SetStateAction } from "react";
import { Check, Wrench, X } from "lucide-react";
import type { StaffServiceRequest, StaffServiceRequestDestination } from "../../data/staffData";
import { toast } from "sonner";
import ImagePreview from "../common/ImagePreview";

type StaffServiceRequestInboxProps = {
  requests: StaffServiceRequest[];
  search: string;
  setRequests: Dispatch<SetStateAction<StaffServiceRequest[]>>;
};

type AssignmentDestination = StaffServiceRequestDestination | "";

type FieldGuardOption = {
  _id: string;
  name: string;
};

export default function StaffServiceRequestInbox({ requests, search, setRequests }: StaffServiceRequestInboxProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const [guards, setGuards] = useState<FieldGuardOption[]>([]);
  const [fieldGuardId, setFieldGuardId] = useState("");
  const [destination, setDestination] = useState<AssignmentDestination>("");
  const [guardsError, setGuardsError] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const normalizedSearch = search.trim().toLocaleLowerCase();
  const matchingRequests = requests.filter((request) =>
    [
      request.id,
      request.residentName,
      request.type,
      request.description,
      request.location,
      request.status,
      request.assignedTo ?? "",
    ].some((value) => value.toLocaleLowerCase().includes(normalizedSearch)),
  );
  const selectedRequest = requests.find((request) => request.id === selectedRequestId) ?? null;

  useEffect(() => {
    const controller = new AbortController();

    async function loadGuards() {
      try {
        const response = await fetch("http://localhost:4000/reports/field-guards", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load field guards.");
        }

        const data: FieldGuardOption[] = await response.json();

        if (!controller.signal.aborted) {
          setGuards(data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setGuardsError(error instanceof Error ? error.message : "Could not load guards.");
        }
      }
    }

    loadGuards();

    return () => controller.abort();
  }, []);

  function openRequest(requestId: string) {
    setSelectedRequestId(requestId);
    setRejectionReason("");
    setRejectionError("");
    setShowRejectForm(false);
    setFieldGuardId("");
    setDestination("");
    setAssignmentError("");
  }

  async function assignRequest(destination: StaffServiceRequestDestination) {
    if (!selectedRequest || assigning || rejecting) return;

    if (destination === "Field Guard" && !fieldGuardId) {
      setAssignmentError("Choose a field guard first.");
      return;
    }

    setAssigning(true);
    setAssignmentError("");

    try {
      const response = await fetch(`http://localhost:4000/reports/${selectedRequest.id}/assign`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedTeam: destination === "Field Guard" ? "FIELD_GUARD" : "MAINTENANCE",
          fieldGuardId: destination === "Field Guard" ? fieldGuardId : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(errorData?.message ?? "Could not assign the report.");
      }

      const updatedReport = await response.json();

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === updatedReport._id
            ? {
                ...request,
                status: "Assigned",
                assignedTo: updatedReport.assignedTeam === "FIELD_GUARD" ? "Field Guard" : "Maintenance Team",
                rejectionReason: undefined,
              }
            : request,
        ),
      );

      toast.success("Report assigned", {
        description:
          destination === "Field Guard"
            ? "The report has been assigned to the selected field guard."
            : "The report has been assigned to the maintenance team.",
      });
      setSelectedRequestId(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not create the fine.";

      setAssignmentError(message);
      toast.error(message);
    } finally {
      setAssigning(false);
    }
  }

  async function rejectRequest(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedRequest || assigning || rejecting) return;

    if (selectedRequest.status !== "Pending") {
      setRejectionError("Only pending reports can be rejected.");
      return;
    }

    const reason = rejectionReason.trim();

    if (!reason) {
      setRejectionError("Enter a reason before rejecting this request.");
      return;
    }

    setRejecting(true);
    setRejectionError("");

    try {
      const response = await fetch(`http://localhost:4000/reports/${selectedRequest.id}/reject`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectionReason: reason }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(errorData?.message ?? "Could not reject the report.");
      }

      const updatedReport = await response.json();

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.id === updatedReport._id
            ? {
                ...request,
                status: "Rejected",
                assignedTo: undefined,
                rejectionReason: updatedReport.rejectionReason,
                resolvedAt: updatedReport.resolvedAt,
              }
            : request,
        ),
      );

      toast.success("Report rejected", {
        description: "The rejection reason has been saved.",
      });
      setSelectedRequestId(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not create the fine.";

      setRejectionError(message);
      toast.error(message);
    } finally {
      setRejecting(false);
    }
  }

  return (
    <>
      <section className="staff-panel staff-service-requests" aria-labelledby="service-requests-heading">
        <header className="staff-maintenance-heading">
          <section>
            <p className="staff-section-label">Resident submissions</p>
            <h2 id="service-requests-heading">Request inbox</h2>
            <p className="staff-service-requests-description">
              Review each request, route it to the right team, or reject it with a reason.
            </p>
          </section>
          <span className="staff-service-request-count">
            {requests.filter((request) => request.status === "Pending").length} pending
          </span>
        </header>
        {matchingRequests.length === 0 ? (
          <p className="staff-service-requests-empty">
            {requests.length === 0 ? "No resident requests yet." : "No requests match your search."}
          </p>
        ) : (
          <section className="staff-service-request-list">
            {matchingRequests.map((request) => (
              <article className="staff-service-request-card" key={request.id}>
                <header className="staff-service-request-card-top">
                  <section>
                    <h3>{request.type}</h3>
                    <span className="staff-ticket-id">{request.id}</span>
                  </section>
                  <span
                    className={`staff-status-badge staff-status-badge--${request.status.toLocaleLowerCase() === "assigned" ? "current" : request.status.toLocaleLowerCase()}`}
                  >
                    {request.status}
                  </span>
                </header>
                <dl className="staff-service-request-meta">
                  <div>
                    <dt>Resident</dt>
                    <dd>{request.residentName}</dd>
                  </div>
                  <div>
                    <dt>Reported</dt>
                    <dd>{request.reported}</dd>
                  </div>
                  <div className="staff-service-request-meta-wide">
                    <dt>Location</dt>
                    <dd>{request.location}</dd>
                  </div>
                </dl>
                <p className="staff-service-request-summary">{request.description}</p>
                <footer className="staff-service-request-footer">
                  <p className="staff-service-request-outcome">
                    {request.status === "Rejected" && request.rejectionReason
                      ? `Rejected: ${request.rejectionReason}`
                      : request.assignedTo
                        ? `Assigned to ${request.assignedTo}`
                        : ""}
                    {request.resolvedAt
                      ? `${request.assignedTo || request.rejectionReason ? " · " : ""}${request.status === "Rejected" ? "Closed" : "Completed"} ${new Date(
                          request.resolvedAt,
                        ).toLocaleString("en-GB", {
                          timeZone: "Asia/Jerusalem",
                          dateStyle: "short",
                          timeStyle: "short",
                        })}`
                      : ""}
                  </p>
                  <button
                    className={request.status === "Rejected" ? "staff-photo-button" : "staff-assign-team"}
                    type="button"
                    onClick={() => openRequest(request.id)}
                  >
                    {request.status === "Rejected" ? "View details" : "Review"}
                  </button>
                </footer>
              </article>
            ))}
          </section>
        )}
      </section>

      {selectedRequest ? (
        <section className="staff-modal-backdrop">
          <section
            className="staff-ticket-dialog staff-service-request-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-request-dialog-heading"
          >
            <header className="staff-dialog-heading">
              <section>
                <p className="staff-section-label">Request {selectedRequest.id}</p>
                <h2 id="service-request-dialog-heading">{selectedRequest.type}</h2>
              </section>
              <button
                className="staff-dialog-close"
                type="button"
                aria-label="Close request details"
                disabled={assigning || rejecting}
                onClick={() => setSelectedRequestId(null)}
              >
                <X size={19} aria-hidden="true" />
              </button>
            </header>

            <dl className="staff-service-request-details">
              <div>
                <dt>Resident</dt>
                <dd>{selectedRequest.residentName}</dd>
              </div>
              <div>
                <dt>Reported</dt>
                <dd>{selectedRequest.reported}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{selectedRequest.location}</dd>
              </div>
              <div>
                <dt>Contact phone</dt>
                <dd>{selectedRequest.phone}</dd>
              </div>
              <div>
                <dt>Attachment</dt>
                <dd>
                  {selectedRequest.attachment ? (
                    <ImagePreview
                      className="staff-photo-button"
                      src={selectedRequest.attachment}
                      alt={`Photo attached to ${selectedRequest.type}`}
                      label="View attached photo"
                    >
                      View photo
                    </ImagePreview>
                  ) : (
                    "No photo"
                  )}
                </dd>{" "}
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  {selectedRequest.status}
                  {selectedRequest.assignedTo ? ` · ${selectedRequest.assignedTo}` : ""}
                </dd>
              </div>
            </dl>
            <section className="staff-service-request-description">
              <h3>Request details</h3>
              <p>{selectedRequest.description}</p>
            </section>

            {selectedRequest.status === "Rejected" ? (
              <section className="staff-service-request-rejection">
                <h3>Rejection reason</h3>
                <p>{selectedRequest.rejectionReason}</p>
              </section>
            ) : (
              <>
                <section className="staff-service-request-routing">
                  <header className="staff-routing-heading">
                    <h3>Assign request</h3>
                    <p>Choose who should handle this request.</p>
                  </header>

                  <label>
                    Assign to
                    <select
                      value={destination}
                      onChange={(event) => {
                        setDestination(event.target.value as AssignmentDestination);
                        setFieldGuardId("");
                        setAssignmentError("");
                      }}
                      disabled={assigning || rejecting || selectedRequest.status !== "Pending"}
                    >
                      <option value="">Select a team</option>
                      <option value="Field Guard">Field guard</option>
                      <option value="Maintenance Team">Maintenance team</option>
                    </select>
                  </label>

                  {destination === "Field Guard" ? (
                    <section className="staff-routing-list-wrap">
                      <p className="staff-routing-list-title">Available field guards</p>
                      {guardsError && <p role="alert">{guardsError}</p>}
                      {!guardsError && guards.length === 0 ? (
                        <p className="staff-routing-empty">No field guards available.</p>
                      ) : null}
                      <ul className="staff-routing-list" role="radiogroup" aria-label="Field guards">
                        {guards.map((guard) => {
                          const isSelected = fieldGuardId === guard._id;

                          return (
                            <li key={guard._id}>
                              <button
                                className={`staff-routing-option${isSelected ? " is-selected" : ""}`}
                                type="button"
                                role="radio"
                                aria-checked={isSelected}
                                disabled={assigning || rejecting || selectedRequest.status !== "Pending"}
                                onClick={() => setFieldGuardId(guard._id)}
                              >
                                <span className="staff-routing-avatar" aria-hidden="true">
                                  {guard.name
                                    .split(/\s+/)
                                    .slice(0, 2)
                                    .map((part) => part[0])
                                    .join("")
                                    .toUpperCase()}
                                </span>
                                <span className="staff-routing-option-name">{guard.name}</span>
                                {isSelected ? <Check size={16} aria-hidden="true" /> : null}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  ) : null}

                  {destination === "Maintenance Team" ? (
                    <section className="staff-routing-list-wrap">
                      <p className="staff-routing-list-title">Maintenance team</p>
                      <ul className="staff-routing-list">
                        <li className="staff-routing-option is-selected">
                          <span className="staff-routing-avatar" aria-hidden="true">
                            <Wrench size={15} />
                          </span>
                          <span className="staff-routing-option-name">Municipal maintenance team</span>
                          <Check size={16} aria-hidden="true" />
                        </li>
                      </ul>
                    </section>
                  ) : null}

                  <button
                    className="staff-route-request staff-assign-team staff-route-submit"
                    type="button"
                    disabled={
                      assigning ||
                      rejecting ||
                      selectedRequest.status !== "Pending" ||
                      !destination ||
                      (destination === "Field Guard" && !fieldGuardId)
                    }
                    onClick={() => destination && assignRequest(destination)}
                  >
                    {assigning ? "Assigning..." : destination ? `Assign to ${destination}` : "Assign request"}
                  </button>

                  {assigning && <p role="status">Saving assignment...</p>}
                  {assignmentError && <p role="alert">{assignmentError}</p>}
                </section>
                {!showRejectForm ? (
                  <footer className="staff-reject-prompt">
                    <span>Can't accept this request?</span>
                    <button
                      type="button"
                      disabled={assigning || rejecting || selectedRequest.status !== "Pending"}
                      onClick={() => setShowRejectForm(true)}
                    >
                      Reject request
                    </button>
                  </footer>
                ) : (
                  <form className="staff-reject-request-form" onSubmit={rejectRequest}>
                    <label htmlFor="request-rejection-reason">
                      Reason for rejection
                      <textarea
                        id="request-rejection-reason"
                        autoFocus
                        required
                        value={rejectionReason}
                        aria-describedby="request-rejection-help"
                        aria-invalid={Boolean(rejectionError)}
                        onChange={(event) => {
                          setRejectionReason(event.target.value);
                          setRejectionError("");
                        }}
                        placeholder="Explain why this request cannot be accepted"
                        rows={3}
                      />
                    </label>
                    <p className="staff-reject-request-help" id="request-rejection-help">
                      A reason is required before rejecting the request.
                    </p>
                    {rejectionError ? (
                      <p className="staff-reject-request-error" role="alert">
                        {rejectionError}
                      </p>
                    ) : null}
                    <section className="staff-reject-actions">
                      <button
                        className="staff-reject-cancel"
                        type="button"
                        disabled={rejecting}
                        onClick={() => {
                          setShowRejectForm(false);
                          setRejectionReason("");
                          setRejectionError("");
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="staff-reject"
                        type="submit"
                        disabled={
                          assigning || rejecting || selectedRequest.status !== "Pending" || !rejectionReason.trim()
                        }
                      >
                        {rejecting ? "Rejecting..." : "Confirm rejection"}
                      </button>
                    </section>
                  </form>
                )}
              </>
            )}
          </section>
        </section>
      ) : null}
    </>
  );
}
