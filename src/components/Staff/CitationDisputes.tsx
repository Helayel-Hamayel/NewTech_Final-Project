import { ShieldCheck, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { AppealFromBackend } from "../../data/appealData";
import { currency } from "../../helpers/formatting/currency";
import { formatIsraeliDateTime } from "../../helpers/formatting/israeliDate";

type CitationDisputesProps = {
  appeals: AppealFromBackend[];
  setAppeals: Dispatch<SetStateAction<AppealFromBackend[]>>;
  search: string;
};

function EvidencePhoto({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <p className="appeal-photo-empty">
        {failed ? "Could not load this photo." : "No photo provided."}
      </p>
    );
  }

  return (
    <img
      className="appeal-evidence-photo"
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}

export default function CitationDisputes({
  appeals,
  setAppeals,
  search,
}: CitationDisputesProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | AppealFromBackend["status"]>("ALL");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const selectedAppeal =
    appeals.find((appeal) => appeal._id === selectedId) ?? null;

  const pendingCount = appeals.filter(
    (appeal) => appeal.status === "PENDING",
  ).length;

  const query = search.trim().toLowerCase();

  const matchingAppeals = appeals.filter((appeal) =>
    (statusFilter === "ALL" || appeal.status === statusFilter) &&
    [
      appeal._id,
      appeal.resident?.name ?? "",
      appeal.email,
      appeal.reason,
      appeal.description,
      appeal.status,
      appeal.fine?.licensePlate ?? "",
      appeal.fine?.violationType ?? "",
    ].some((value) => value.toLowerCase().includes(query)),
  );

  useEffect(() => {
    if (selectedId && !dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, [selectedId]);

  function openAppeal(id: string) {
    setError("");
    setSelectedId(id);
  }

  function closeAppeal() {
    if (saving) return;

    dialogRef.current?.close();
    setSelectedId(null);
    setError("");
  }

  async function decideAppeal(status: "ACCEPTED" | "REJECTED") {
    if (
      !selectedAppeal ||
      selectedAppeal.status !== "PENDING" ||
      saving
    ) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:4000/appeals/${selectedAppeal._id}/decision`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.message ?? "Could not save the decision.",
        );
      }

      const updated: {
        _id: string;
        status: AppealFromBackend["status"];
        resolvedAt: string | null;
      } = await response.json();

      setAppeals((current) =>
        current.map((appeal) =>
          appeal._id === updated._id
            ? {
                ...appeal,
                status: updated.status,
                resolvedAt: updated.resolvedAt,
                fine: appeal.fine
                  ? {
                      ...appeal.fine,
                      resolvedAt: updated.resolvedAt,
                    }
                  : null,
              }
            : appeal,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not save the decision.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="staff-panel" aria-labelledby="disputes-heading">
      <header className="staff-panel-heading">
        <section>
          <p className="staff-section-label">Review and resolve</p>
          <h2 id="disputes-heading">Citation disputes</h2>
        </section>
        <span className="staff-result-count">{pendingCount} pending</span>
      </header>

      <div className="staff-ledger-toolbar">
        <div className="staff-ledger-filters" role="group" aria-label="Filter appeals by status">
          {(["ALL", "PENDING", "ACCEPTED", "REJECTED"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={statusFilter === option}
              onClick={() => setStatusFilter(option)}
            >
              {option === "ALL" ? "All" : option.charAt(0) + option.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <span className="staff-result-count">{matchingAppeals.length} appeals</span>
      </div>

      <section className="staff-table-scroll" role="region" aria-label="Citation disputes table" tabIndex={0}>
        <table className="staff-table staff-disputes-table">
          <thead>
            <tr>
              <th scope="col">Resident</th>
              <th scope="col">Vehicle</th>
              <th scope="col">Reason</th>
              <th scope="col">Fine</th>
              <th scope="col">Submitted</th>
              <th scope="col">Status</th>
              <th scope="col" className="staff-table-action-col">
                Review
              </th>
            </tr>
          </thead>

          <tbody>
            {matchingAppeals.map((appeal) => (
              <tr key={appeal._id}>
                <td className="staff-resident-cell">
                  <div className="staff-ledger-resident">
                    <strong>{appeal.resident?.name ?? "Unknown resident"}</strong>
                    <span>{appeal.email}</span>
                  </div>
                </td>
                <td>
                  {appeal.fine ? (
                    <div className="staff-ledger-resident">
                      <span className="staff-plate">{appeal.fine.licensePlate}</span>
                      <span>{appeal.fine.violationType}</span>
                    </div>
                  ) : (
                    "Fine unavailable"
                  )}
                </td>
                <td className="staff-dispute-reason">{appeal.reason}</td>
                <td className="staff-amount">{appeal.fine ? currency.format(appeal.fine.amount) : "—"}</td>
                <td className="staff-dispute-date">{formatIsraeliDateTime(appeal.createdAt)}</td>
                <td>
                  <span className={`staff-status-badge staff-appeal-status--${appeal.status.toLowerCase()}`}>
                    {appeal.status.charAt(0) + appeal.status.slice(1).toLowerCase()}
                  </span>
                </td>
                <td className="staff-table-action-col">
                  <button
                    className={appeal.status === "PENDING" ? "staff-assign-team" : "staff-photo-button"}
                    type="button"
                    onClick={() => openAppeal(appeal._id)}
                  >
                    {appeal.status === "PENDING" ? "Review" : "View"}
                  </button>
                </td>
              </tr>
            ))}

            {matchingAppeals.length === 0 && (
              <tr>
                <td colSpan={7} className="staff-empty">
                  {appeals.length === 0
                    ? "No appeals yet."
                    : "No appeals match your filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <dialog
        ref={dialogRef}
        className="staff-appeal-dialog"
        aria-labelledby="appeal-review-heading"
        onCancel={(event) => {
          event.preventDefault();
          closeAppeal();
        }}
        onClose={() => setSelectedId(null)}
      >
        {selectedAppeal && (
          <>
            <header className="staff-dialog-heading">
              <section>
                <p className="staff-section-label">Appeal review</p>
                <h2 id="appeal-review-heading">
                  {selectedAppeal.resident?.name ?? "Resident"}
                </h2>
                <p className="appeal-review-meta">
                  <span className={`staff-status-badge staff-appeal-status--${selectedAppeal.status.toLowerCase()}`}>
                    {selectedAppeal.status.charAt(0) + selectedAppeal.status.slice(1).toLowerCase()}
                  </span>
                  <span className="appeal-review-id">#{selectedAppeal._id.slice(-8).toUpperCase()}</span>
                  <span>{selectedAppeal.email}</span>
                </p>
              </section>

              <button
                className="staff-dialog-close"
                type="button"
                aria-label="Close appeal review"
                disabled={saving}
                onClick={closeAppeal}
                autoFocus
              >
                <X size={19} aria-hidden="true" />
              </button>
            </header>

            <dl className="appeal-facts">
              <div>
                <dt>Fine amount</dt>
                <dd>{selectedAppeal.fine ? currency.format(selectedAppeal.fine.amount) : "—"}</dd>
              </div>
              <div>
                <dt>Vehicle</dt>
                <dd>{selectedAppeal.fine?.licensePlate ?? "—"}</dd>
              </div>
              <div>
                <dt>Fine issued</dt>
                <dd>{selectedAppeal.fine ? formatIsraeliDateTime(selectedAppeal.fine.createdAt) : "—"}</dd>
              </div>
              <div>
                <dt>Appeal submitted</dt>
                <dd>{formatIsraeliDateTime(selectedAppeal.createdAt)}</dd>
              </div>
            </dl>

            <div className="appeal-evidence-grid">
              <article className="appeal-evidence-card appeal-evidence-card--guard">
                <h3>
                  <ShieldCheck size={16} aria-hidden="true" /> Field guard evidence
                </h3>

                <EvidencePhoto
                  key={`guard-${selectedAppeal._id}`}
                  src={selectedAppeal.fine?.photoUrl}
                  alt="Evidence photo attached to the fine by the field guard"
                />

                {selectedAppeal.fine ? (
                  <dl className="appeal-evidence-details">
                    <div>
                      <dt>Violation / explanation</dt>
                      <dd>{selectedAppeal.fine.violationType}</dd>
                    </div>
                    <div>
                      <dt>Fine ID</dt>
                      <dd className="appeal-mono">{selectedAppeal.fine._id}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="appeal-photo-empty">The linked fine is no longer available.</p>
                )}
              </article>

              <article className="appeal-evidence-card appeal-evidence-card--resident">
                <h3>
                  <UserRound size={16} aria-hidden="true" /> Resident appeal
                </h3>

                <EvidencePhoto
                  key={`resident-${selectedAppeal._id}`}
                  src={selectedAppeal.photoUrl}
                  alt="Supporting photo uploaded by the resident"
                />

                <dl className="appeal-evidence-details">
                  <div>
                    <dt>Appeal reason</dt>
                    <dd>{selectedAppeal.reason}</dd>
                  </div>
                  <div>
                    <dt>Statement</dt>
                    <dd className="appeal-statement">{selectedAppeal.description}</dd>
                  </div>
                </dl>
              </article>
            </div>

            {selectedAppeal.resolvedAt && (
              <p className={`appeal-decision-note appeal-decision-note--${selectedAppeal.status.toLowerCase()}`}>
                {selectedAppeal.status === "ACCEPTED" ? "Accepted" : "Rejected"} on{" "}
                {formatIsraeliDateTime(selectedAppeal.resolvedAt)}
              </p>
            )}

            {error && (
              <p className="appeal-decision-note appeal-decision-note--rejected" role="alert">
                {error}
              </p>
            )}
            {saving && (
              <p className="appeal-decision-note" role="status">
                Saving decision...
              </p>
            )}

            {selectedAppeal.status === "PENDING" && (
              <footer className="appeal-review-actions">
                <p>This decision is final and cannot be changed.</p>
                <button
                  className="staff-cancel"
                  type="button"
                  disabled={saving}
                  onClick={closeAppeal}
                >
                  Close
                </button>
                <button
                  className="staff-approve"
                  type="button"
                  disabled={saving || !selectedAppeal.fine}
                  onClick={() => decideAppeal("ACCEPTED")}
                >
                  Accept appeal
                </button>

                <button
                  className="staff-reject"
                  type="button"
                  disabled={saving || !selectedAppeal.fine}
                  onClick={() => decideAppeal("REJECTED")}
                >
                  Reject appeal
                </button>
              </footer>
            )}
          </>
        )}
      </dialog>
    </section>
  );
}