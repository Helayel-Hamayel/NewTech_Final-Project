import { useEffect, useRef, useState } from "react";
import LoadingState from "../common/LoadingState";
import type { AppealFromBackend } from "../../data/appealData";
import { ImageOff } from "lucide-react";
import { currency } from "../../helpers/formatting/currency";
import { formatIsraeliDateTime } from "../../helpers/formatting/israeliDate";
import PaymentCheckout from "./PaymentCheckout";
import type { Fine } from "../../data/residentPortal";
import type { PaymentSelection } from "./types";
import "../../styles/pages/ResidentAppeals.css";
import ImagePreview from "../common/ImagePreview";

type ResidentAppealsProps = {
  appealSubmitting: boolean;
  onPay: (selection: PaymentSelection) => Promise<void>;
  fines: Fine[];
};

const statuses = ["PENDING", "ACCEPTED", "REJECTED"] as const;

const statusLabels = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

function EvidencePhoto({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="resident-appeal-photo-placeholder">
        <ImageOff size={48} aria-hidden="true" />
        <span>{failed ? "Could not load the photo" : "No photo provided"}</span>
      </div>
    );
  }

  return (
    <ImagePreview src={src} alt={alt} label="View appeal evidence photo">
      <img className="resident-appeal-photo" src={src} alt={alt} onError={() => setFailed(true)} />
    </ImagePreview>
  );
}

export default function ResidentAppeals({ appealSubmitting, onPay, fines }: ResidentAppealsProps) {
  const [appeals, setAppeals] = useState<AppealFromBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fineToPay, setFineToPay] = useState<{
    id: string;
    amount: number;
  } | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const selectedAppeal = appeals.find((appeal) => appeal._id === selectedId) ?? null;

  useEffect(() => {
    // Wait until an appeal submission finishes before fetching.
    if (appealSubmitting) return;

    const controller = new AbortController();

    async function loadAppeals() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/appeals", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load your appeals.");
        }

        const data: AppealFromBackend[] = await response.json();

        if (!controller.signal.aborted) {
          setAppeals(data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error instanceof Error ? error.message : "Could not load your appeals.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadAppeals();

    return () => controller.abort();
  }, [appealSubmitting, refreshKey]);

  useEffect(() => {
    if (selectedId && !dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, [selectedId]);

  function closeAppeal() {
    dialogRef.current?.close();
    setSelectedId(null);
  }

  function isFinePaid(fineId: string) {
    return fines.some((fine) => fine.id === fineId && fine.status === "Paid");
  }

  return (
    <section className="resident-card tickets-section resident-appeals" aria-labelledby="resident-appeals-heading">
      <header className="resident-card-header">
        <div>
          <p className="section-label">Track staff decisions</p>
          <h2 id="resident-appeals-heading">My appeals</h2>
        </div>

        <button
          className="resident-secondary-btn"
          type="button"
          disabled={loading || appealSubmitting}
          onClick={() => setRefreshKey((current) => current + 1)}>
          Refresh
        </button>
      </header>

      {loading ? (
        <LoadingState variant="inline" title="Loading appeals" description="Fetching your appeals." />
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <div className="resident-appeal-columns">
          {statuses.map((status) => {
            const matchingAppeals = appeals.filter((appeal) => appeal.status === status);

            return (
              <section key={status} className="resident-appeal-column">
                <h3>
                  {statusLabels[status]} ({matchingAppeals.length})
                </h3>

                {matchingAppeals.length === 0 ? (
                  <p className="resident-muted">No appeals here.</p>
                ) : (
                  <ul className="resident-appeal-list">
                    {matchingAppeals.map((appeal) => (
                      <li key={appeal._id}>
                        <article className="citation-card">
                          <span className={`resident-appeal-status resident-appeal-status--${status.toLowerCase()}`}>
                            {statusLabels[status]}
                          </span>

                          <h4>{appeal.fine?.violationType ?? "Fine unavailable"}</h4>

                          <p>Vehicle: {appeal.fine?.licensePlate ?? "Unavailable"}</p>
                          <p>{appeal.reason}</p>
                          <p className="resident-muted">Submitted: {formatIsraeliDateTime(appeal.createdAt)}</p>

                          {appeal.resolvedAt && <p className="resident-muted">Decided: {formatIsraeliDateTime(appeal.resolvedAt)}</p>}

                          <button className="resident-secondary-btn" type="button" onClick={() => setSelectedId(appeal._id)}>
                            View appeal
                          </button>
                          {appeal.status === "ACCEPTED" && <p className="resident-muted">Fine waived. No payment required.</p>}

                          {appeal.fine && (appeal.fine.status === "PAID" || isFinePaid(appeal.fine._id)) && (
                            <p className="resident-muted">Paid</p>
                          )}

                          {appeal.status === "REJECTED" && appeal.fine?.status === "UNPAID" && !isFinePaid(appeal.fine._id) && (
                            <button
                              className="resident-primary-btn"
                              type="button"
                              onClick={() =>
                                setFineToPay({
                                  id: appeal.fine!._id,
                                  amount: appeal.fine!.amount,
                                })
                              }>
                              Pay fine
                            </button>
                          )}
                        </article>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}

      <dialog
        ref={dialogRef}
        className="resident-appeal-dialog"
        aria-labelledby="resident-appeal-details-heading"
        onCancel={(event) => {
          event.preventDefault();
          closeAppeal();
        }}
        onClose={() => setSelectedId(null)}>
        {selectedAppeal && (
          <>
            <header className="resident-card-header">
              <div>
                <h2 id="resident-appeal-details-heading">Appeal details</h2>
                <p>
                  Staff decision:{" "}
                  <strong>{selectedAppeal.status === "PENDING" ? "Awaiting review" : statusLabels[selectedAppeal.status]}</strong>
                </p>
                {selectedAppeal.resolvedAt && <p>Decided at: {formatIsraeliDateTime(selectedAppeal.resolvedAt)}</p>}
              </div>

              <button className="resident-secondary-btn" type="button" onClick={closeAppeal} autoFocus>
                Close
              </button>
            </header>

            <div className="resident-appeal-evidence">
              <article className="resident-appeal-evidence-card">
                <h3>Field guard evidence</h3>

                <EvidencePhoto
                  key={`guard-${selectedAppeal._id}`}
                  src={selectedAppeal.fine?.photoUrl}
                  alt="Photo attached by the field guard"
                />

                {selectedAppeal.fine ? (
                  <>
                    <p>
                      <strong>Violation:</strong> {selectedAppeal.fine.violationType}
                    </p>
                    <p>
                      <strong>Vehicle:</strong> {selectedAppeal.fine.licensePlate}
                    </p>
                    <p>
                      <strong>Amount:</strong> {currency.format(selectedAppeal.fine.amount)}
                    </p>
                    <p>
                      <strong>Payment status:</strong> {isFinePaid(selectedAppeal.fine._id) ? "PAID" : selectedAppeal.fine.status}
                    </p>
                    <p>
                      <strong>Issued:</strong> {formatIsraeliDateTime(selectedAppeal.fine.createdAt)}
                    </p>
                  </>
                ) : (
                  <p>The linked fine is unavailable.</p>
                )}
              </article>

              <article className="resident-appeal-evidence-card">
                <h3>Your appeal</h3>

                <EvidencePhoto
                  key={`resident-${selectedAppeal._id}`}
                  src={selectedAppeal.photoUrl}
                  alt="Supporting photo you attached to the appeal"
                />

                <p>
                  <strong>Reason:</strong> {selectedAppeal.reason}
                </p>
                <p className="resident-appeal-description">
                  <strong>Description:</strong> {selectedAppeal.description}
                </p>
                <p>
                  <strong>Email:</strong> {selectedAppeal.email}
                </p>
                <p>
                  <strong>Submitted:</strong> {formatIsraeliDateTime(selectedAppeal.createdAt)}
                </p>
              </article>
            </div>
          </>
        )}
      </dialog>
      {fineToPay && (
        <PaymentCheckout
          amount={fineToPay.amount}
          defaultPayments={1}
          onConfirm={async () => {
            const fineId = fineToPay.id;

            await onPay({
              months: [],
              fineIds: [fineId],
            });

            setAppeals((current) =>
              current.map((appeal) =>
                appeal.fine?._id === fineId
                  ? {
                      ...appeal,
                      fine: {
                        ...appeal.fine,
                        status: "PAID",
                      },
                    }
                  : appeal,
              ),
            );
          }}
          onClose={() => setFineToPay(null)}
        />
      )}
    </section>
  );
}
