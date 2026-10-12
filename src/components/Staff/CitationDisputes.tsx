import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { AppealFromBackend } from "../../data/appealData";
import { currency } from "../../helpers/formatting/currency";
import { formatIsraeliDateTime } from "../../helpers/formatting/israeliDate";
import { toast } from "sonner";

type CitationDisputesProps = {
  appeals: AppealFromBackend[];
  setAppeals: Dispatch<SetStateAction<AppealFromBackend[]>>;
  search: string;
};

function EvidencePhoto({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <p className="appeal-photo-empty">{failed ? "Could not load this photo." : "No photo provided."}</p>;
  }

  return <img className="appeal-evidence-photo" src={src} alt={alt} onError={() => setFailed(true)} />;
}

export default function CitationDisputes({ appeals, setAppeals, search }: CitationDisputesProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const selectedAppeal = appeals.find((appeal) => appeal._id === selectedId) ?? null;

  const pendingCount = appeals.filter((appeal) => appeal.status === "PENDING").length;

  const query = search.trim().toLowerCase();

  const matchingAppeals = appeals.filter((appeal) =>
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
    if (!selectedAppeal || selectedAppeal.status !== "PENDING" || saving) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:4000/appeals/${selectedAppeal._id}/decision`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(errorData?.message ?? "Could not save the decision.");
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
                      status: updated.status === "ACCEPTED" ? "CANCELLED" : appeal.fine.status,
                    }
                  : null,
              }
            : appeal,
        ),
      );
      toast.success(status === "ACCEPTED" ? "Appeal accepted" : "Appeal rejected", {
        description: "Your decision has been saved.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not create the fine.";

      setError(message);
      toast.error(message);
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

      <section className="staff-table-scroll">
        <table className="staff-table">
          <thead>
            <tr>
              <th scope="col">Resident</th>
              <th scope="col">Vehicle</th>
              <th scope="col">Reason</th>
              <th scope="col">Status</th>
              <th scope="col">Review</th>
            </tr>
          </thead>

          <tbody>
            {matchingAppeals.map((appeal) => (
              <tr key={appeal._id}>
                <td>{appeal.resident?.name ?? "Unknown resident"}</td>
                <td>{appeal.fine?.licensePlate ?? "Fine unavailable"}</td>
                <td>{appeal.reason}</td>
                <td>{appeal.status}</td>
                <td>
                  <button className="staff-review-request" type="button" onClick={() => openAppeal(appeal._id)}>
                    Review dispute
                  </button>
                </td>
              </tr>
            ))}

            {matchingAppeals.length === 0 && (
              <tr>
                <td colSpan={5} className="staff-empty">
                  {appeals.length === 0 ? "No appeals yet." : "No appeals match your search."}
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
        onClose={() => setSelectedId(null)}>
        {selectedAppeal && (
          <>
            <header className="staff-dialog-heading">
              <section>
                <p className="staff-section-label">Appeal review</p>
                <h2 id="appeal-review-heading">{selectedAppeal.resident?.name ?? "Resident"}</h2>
                <p>
                  Appeal {selectedAppeal._id} · {selectedAppeal.status}
                </p>
              </section>

              <button className="staff-dialog-close" type="button" disabled={saving} onClick={closeAppeal} autoFocus>
                Close
              </button>
            </header>

            <div className="appeal-evidence-grid">
              <article className="appeal-evidence-card">
                <h3>Field guard evidence</h3>

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
                      <dt>Vehicle registration</dt>
                      <dd>{selectedAppeal.fine.licensePlate}</dd>
                    </div>
                    <div>
                      <dt>Fine amount</dt>
                      <dd>{currency.format(selectedAppeal.fine.amount)}</dd>
                    </div>
                    <div>
                      <dt>Fine ID</dt>
                      <dd>{selectedAppeal.fine._id}</dd>
                    </div>
                    <div>
                      <dt>Issued at</dt>
                      <dd>{formatIsraeliDateTime(selectedAppeal.fine.createdAt)}</dd>
                    </div>
                  </dl>
                ) : (
                  <p>The linked fine is no longer available.</p>
                )}
              </article>

              <article className="appeal-evidence-card">
                <h3>Resident appeal</h3>

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
                    <dt>Description</dt>
                    <dd>{selectedAppeal.description}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{selectedAppeal.email}</dd>
                  </div>
                  <div>
                    <dt>Submitted at</dt>
                    <dd>{formatIsraeliDateTime(selectedAppeal.createdAt)}</dd>
                  </div>
                </dl>
              </article>
            </div>

            {selectedAppeal.resolvedAt && <p>Decided at: {formatIsraeliDateTime(selectedAppeal.resolvedAt)}</p>}

            {error && <p role="alert">{error}</p>}
            {saving && <p role="status">Saving decision...</p>}

            {selectedAppeal.status === "PENDING" && (
              <footer className="appeal-review-actions">
                <button
                  className="staff-approve"
                  type="button"
                  disabled={saving || !selectedAppeal.fine}
                  onClick={() => decideAppeal("ACCEPTED")}>
                  Accept appeal
                </button>

                <button
                  className="staff-reject"
                  type="button"
                  disabled={saving || !selectedAppeal.fine}
                  onClick={() => decideAppeal("REJECTED")}>
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
