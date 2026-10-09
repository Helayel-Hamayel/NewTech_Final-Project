import { useEffect, useState } from "react";
import type { SubmitEvent, Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import type { StaffServiceRequest, StaffServiceRequestDestination } from "../../data/staffData";

type StaffServiceRequestInboxProps = {
  requests: StaffServiceRequest[];
  search: string;
  setRequests: Dispatch<SetStateAction<StaffServiceRequest[]>>;
};

type FieldGuardOption = {
  _id: string;
  name: string;
};

export default function StaffServiceRequestInbox({ requests, search, setRequests }: StaffServiceRequestInboxProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState("");

  const [guards, setGuards] = useState<FieldGuardOption[]>([]);
  const [fieldGuardId, setFieldGuardId] = useState("");
  const [guardsError, setGuardsError] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const normalizedSearch = search.trim().toLocaleLowerCase();
  const matchingRequests = requests.filter((request) =>
    [request.id, request.residentName, request.type, request.description, request.location, request.status, request.assignedTo ?? ""].some(
      (value) => value.toLocaleLowerCase().includes(normalizedSearch),
    ),
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
    setFieldGuardId("");
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

      setSelectedRequestId(null);
    } catch (error) {
      setAssignmentError(error instanceof Error ? error.message : "Assignment failed.");
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

      setSelectedRequestId(null);
    } catch (error) {
      setRejectionError(error instanceof Error ? error.message : "Rejection failed.");
    } finally {
      setRejecting(false);
    }
  }

  return (
    <>
      <section className="staff-panel staff-service-requests" aria-labelledby="service-requests-heading">
        <div className="staff-maintenance-heading">
          <div>
            <p className="staff-section-label">Resident submissions</p>
            <h2 id="service-requests-heading">Request inbox</h2>
            <p className="staff-service-requests-description">
              Review each request, route it to the right team, or reject it with a reason.
            </p>
          </div>
          <span className="staff-service-request-count">{requests.filter((request) => request.status === "Pending").length} pending</span>
        </div>
        <p className="staff-service-request-demo-note" role="note">
          Assignments are saved. Rejection is still a demo action.
        </p>
        {matchingRequests.length === 0 ? (
          <p className="staff-service-requests-empty">
            {requests.length === 0 ? "No resident requests yet." : "No requests match your search."}
          </p>
        ) : (
          <div className="staff-service-request-list">
            {matchingRequests.map((request) => (
              <article className="staff-service-request-card" key={request.id}>
                <div className="staff-service-request-card-top">
                  <span className="staff-ticket-id">{request.id}</span>
                  <span
                    className={`staff-status-badge staff-status-badge--${request.status.toLocaleLowerCase() === "assigned" ? "current" : request.status.toLocaleLowerCase()}`}>
                    {request.status}
                  </span>
                </div>
                <h3>{request.type}</h3>
                <p className="staff-service-request-resident">
                  {request.residentName} · {request.location}
                </p>
                <p className="staff-service-request-summary">{request.description}</p>
                {(request.status === "Resolved" || request.status === "Rejected") && request.resolvedAt && (
                  <p className="staff-service-request-outcome">
                    {request.status === "Rejected" ? "Rejected at" : "Completed at"}:{" "}
                    {new Date(request.resolvedAt).toLocaleString("en-GB", {
                      timeZone: "Asia/Jerusalem",
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                )}
                {request.assignedTo ? <p className="staff-service-request-outcome">Assigned to {request.assignedTo}</p> : null}
                {request.rejectionReason ? <p className="staff-service-request-outcome">Rejected: {request.rejectionReason}</p> : null}
                <button className="staff-review-request" type="button" onClick={() => openRequest(request.id)}>
                  {request.status === "Rejected" ? "View details" : "Review request"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedRequest ? (
        <div className="staff-modal-backdrop">
          <section
            className="staff-ticket-dialog staff-service-request-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-request-dialog-heading">
            <div className="staff-dialog-heading">
              <div>
                <p className="staff-section-label">Request {selectedRequest.id}</p>
                <h2 id="service-request-dialog-heading">{selectedRequest.type}</h2>
              </div>
              <button
                className="staff-dialog-close"
                type="button"
                aria-label="Close request details"
                disabled={assigning || rejecting}
                onClick={() => setSelectedRequestId(null)}>
                <X size={19} aria-hidden="true" />
              </button>
            </div>

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
                    <a href={selectedRequest.attachment} target="_blank" rel="noopener noreferrer">
                      View photo
                    </a>
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
            <div className="staff-service-request-description">
              <h3>Request details</h3>
              <p>{selectedRequest.description}</p>
            </div>

            {selectedRequest.status === "Rejected" ? (
              <div className="staff-service-request-rejection">
                <h3>Rejection reason</h3>
                <p>{selectedRequest.rejectionReason}</p>
              </div>
            ) : (
              <>
                <div className="staff-service-request-routing">
                  <h3>Assign request</h3>

                  {guardsError && <p role="alert">{guardsError}</p>}

                  <label>
                    Field guard
                    <select
                      value={fieldGuardId}
                      onChange={(event) => setFieldGuardId(event.target.value)}
                      disabled={assigning || rejecting || selectedRequest.status !== "Pending"}>
                      <option value="">Choose a field guard</option>

                      {guards.map((guard) => (
                        <option key={guard._id} value={guard._id}>
                          {guard.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div>
                    <button
                      className="staff-route-request"
                      type="button"
                      disabled={assigning || rejecting || !fieldGuardId || selectedRequest.status !== "Pending"}
                      onClick={() => assignRequest("Field Guard")}>
                      Assign to Field Guard
                    </button>

                    <button
                      className="staff-route-request"
                      type="button"
                      disabled={assigning || rejecting || selectedRequest.status !== "Pending"}
                      onClick={() => assignRequest("Maintenance Team")}>
                      Assign to Maintenance Team
                    </button>
                  </div>

                  {assigning && <p role="status">Saving assignment...</p>}
                  {assignmentError && <p role="alert">{assignmentError}</p>}
                </div>
                <form className="staff-reject-request-form" onSubmit={rejectRequest}>
                  <label htmlFor="request-rejection-reason">
                    Reason for rejection
                    <textarea
                      id="request-rejection-reason"
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
                  <button
                    className="staff-reject-request"
                    type="submit"
                    disabled={assigning || rejecting || selectedRequest.status !== "Pending" || !rejectionReason.trim()}>
                    {rejecting ? "Rejecting..." : "Reject request"}
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}
