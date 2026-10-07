import { useState } from "react";
import type { FormEvent, Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import type {
  StaffServiceRequest,
  StaffServiceRequestDestination,
} from "../../data/staffData";

type StaffServiceRequestInboxProps = {
  requests: StaffServiceRequest[];
  search: string;
  setRequests: Dispatch<SetStateAction<StaffServiceRequest[]>>;
};

export default function StaffServiceRequestInbox({
  requests,
  search,
  setRequests,
}: StaffServiceRequestInboxProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState("");
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
  const selectedRequest =
    requests.find((request) => request.id === selectedRequestId) ?? null;

  function openRequest(requestId: string) {
    setSelectedRequestId(requestId);
    setRejectionReason("");
    setRejectionError("");
  }

  function assignRequest(destination: StaffServiceRequestDestination) {
    if (!selectedRequest) return;
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request,
              status: "Assigned",
              assignedTo: destination,
              rejectionReason: undefined,
            }
          : request,
      ),
    );
    setSelectedRequestId(null);
  }

  function rejectRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedRequest) return;
    const reason = rejectionReason.trim();
    if (!reason) {
      setRejectionError("Enter a reason before rejecting this request.");
      return;
    }
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request,
              status: "Rejected",
              assignedTo: undefined,
              rejectionReason: reason,
            }
          : request,
      ),
    );
    setSelectedRequestId(null);
  }

  return (
    <>
      <section
        className="staff-panel staff-service-requests"
        aria-labelledby="service-requests-heading"
      >
        <div className="staff-maintenance-heading">
          <div>
            <p className="staff-section-label">Resident submissions</p>
            <h2 id="service-requests-heading">Request inbox</h2>
            <p className="staff-service-requests-description">
              Review each request, route it to the right team, or reject it with
              a reason.
            </p>
          </div>
          <span className="staff-service-request-count">
            {requests.filter((request) => request.status === "Pending").length}{" "}
            pending
          </span>
        </div>
        <p className="staff-service-request-demo-note" role="note">
          Demo workspace: decisions are temporary and are not sent to residents
          or service teams.
        </p>
        {matchingRequests.length === 0 ? (
          <p className="staff-service-requests-empty">
            {requests.length === 0
              ? "No resident requests yet."
              : "No requests match your search."}
          </p>
        ) : (
          <div className="staff-service-request-list">
            {matchingRequests.map((request) => (
              <article
                className="staff-service-request-card"
                key={request.id}
              >
                <div className="staff-service-request-card-top">
                  <span className="staff-ticket-id">{request.id}</span>
                  <span
                    className={`staff-status-badge staff-status-badge--${request.status.toLocaleLowerCase() === "assigned" ? "current" : request.status.toLocaleLowerCase()}`}
                  >
                    {request.status}
                  </span>
                </div>
                <h3>{request.type}</h3>
                <p className="staff-service-request-resident">
                  {request.residentName} · {request.location}
                </p>
                <p className="staff-service-request-summary">
                  {request.description}
                </p>
                {request.assignedTo ? (
                  <p className="staff-service-request-outcome">
                    Assigned to {request.assignedTo}
                  </p>
                ) : null}
                {request.rejectionReason ? (
                  <p className="staff-service-request-outcome">
                    Rejected: {request.rejectionReason}
                  </p>
                ) : null}
                <button
                  className="staff-review-request"
                  type="button"
                  onClick={() => openRequest(request.id)}
                >
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
            aria-labelledby="service-request-dialog-heading"
          >
            <div className="staff-dialog-heading">
              <div>
                <p className="staff-section-label">
                  Request {selectedRequest.id}
                </p>
                <h2 id="service-request-dialog-heading">
                  {selectedRequest.type}
                </h2>
              </div>
              <button
                className="staff-dialog-close"
                type="button"
                aria-label="Close request details"
                onClick={() => setSelectedRequestId(null)}
              >
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
                <dd>{selectedRequest.attachment}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  {selectedRequest.status}
                  {selectedRequest.assignedTo
                    ? ` · ${selectedRequest.assignedTo}`
                    : ""}
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
                  <p>
                    Choose the team responsible for handling this request.
                  </p>
                  <div>
                    <button
                      className="staff-route-request"
                      type="button"
                      onClick={() => assignRequest("Field Guard")}
                    >
                      Assign to Field Guard
                    </button>
                    <button
                      className="staff-route-request"
                      type="button"
                      onClick={() => assignRequest("Maintenance Team")}
                    >
                      Assign to Maintenance Team
                    </button>
                  </div>
                </div>
                <form
                  className="staff-reject-request-form"
                  onSubmit={rejectRequest}
                >
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
                  <p
                    className="staff-reject-request-help"
                    id="request-rejection-help"
                  >
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
                    disabled={!rejectionReason.trim()}
                  >
                    Reject request
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
