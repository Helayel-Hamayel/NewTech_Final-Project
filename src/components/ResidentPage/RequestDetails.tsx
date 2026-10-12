import { ExternalLink, X } from "lucide-react";
import type { ResidentServiceRequest } from "../../data/residentPortal";

type RequestDetailsProps = {
  request: ResidentServiceRequest;
  onClose: () => void;
};

function formatDate(value?: string | null) {
  if (!value) return "";

  return new Date(value).toLocaleString("en-GB", {
    timeZone: "Asia/Jerusalem",
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function RequestDetails({ request, onClose }: RequestDetailsProps) {
  const rows: [string, string][] = [
    ["Request ID", request.id],
    ["Category", request.type],
    ["Status", request.stage],
    ["Reported", request.reportedDate],
    ["Location", request.location],
    ["Contact phone", request.phone],
  ];

  if (request.resolvedAt) {
    rows.push([request.stage === "Rejected" ? "Rejected at" : "Resolved at", formatDate(request.resolvedAt)]);
  }

  return (
    <div className="map-picker-backdrop" role="dialog" aria-modal="true" aria-label="Request details" onClick={onClose}>
      <div className="map-picker request-details" onClick={(event) => event.stopPropagation()}>
        <header className="map-picker-header">
          <section>
            <h3>{request.type}</h3>
            <p>Request details</p>
          </section>
          <button type="button" className="map-picker-icon-btn" onClick={onClose} aria-label="Close details">
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="request-details-body">
          <dl className="request-details-list">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value || "—"}</dd>
              </div>
            ))}
          </dl>

          <section>
            <h4>Description</h4>
            <p className="request-details-text">{request.description}</p>
          </section>

          {request.stage === "Rejected" && (
            <section>
              <h4>Reason for rejection</h4>
              <p className="request-details-text">{request.rejectionReason || "No reason provided."}</p>
            </section>
          )}

          {request.attachment && (
            <section>
              <h4>Photo</h4>
              <a href={request.attachment} target="_blank" rel="noopener noreferrer">
                <img className="request-details-photo" src={request.attachment} alt="Attached to the request" />
              </a>
              <a className="request-details-link" href={request.attachment} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} aria-hidden="true" /> Open full size
              </a>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
