import { Check, X } from "lucide-react";
import type {
  CitationDecision,
  CitationStatus,
} from "../../contexts/CitationState";
import type { StaffDispute } from "../../data/staffData";
import { currency } from "../../helpers/formatting/currency";
import { formatIsraeliDate } from "../../helpers/formatting/israeliDate";

type CitationDisputesProps = {
  disputes: StaffDispute[];
  pendingDisputes: number;
  citationState: Record<string, CitationStatus>;
  search: string;
  onDecide: (fineId: string, decision: CitationDecision) => void;
};

export default function CitationDisputes({
  disputes,
  pendingDisputes,
  citationState,
  search,
  onDecide,
}: CitationDisputesProps) {
  return (
    <section className="staff-panel" aria-labelledby="disputes-heading">
      <header className="staff-panel-heading">
        <section>
          <p className="staff-section-label">Review and resolve</p>
          <h2 id="disputes-heading">Citation disputes</h2>
        </section>
        <span className="staff-result-count">{pendingDisputes} pending</span>
      </header>
      <section
        className="staff-table-scroll"
        role="region"
        aria-label="Citation disputes table"
        tabIndex={0}
      >
        <table className="staff-table staff-disputes-table">
          <thead>
            <tr>
              <th scope="col">Ticket</th>
              <th scope="col">Resident</th>
              <th scope="col">Field Evidence</th>
              <th scope="col">Resident Evidence</th>
              <th scope="col">Violation</th>
              <th scope="col">Reason</th>
              <th scope="col">Amount</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disputes.map((dispute) => {
              const status = citationState[dispute.fineId] ?? dispute.status;
              return (
                <tr key={dispute._id}>
                  <td className="staff-ticket-id">{dispute.ticket}</td>
                  <td className="staff-resident-cell">
                    <strong>{dispute.residentName}</strong>
                    <time dateTime={dispute.submittedAt}>
                      {formatIsraeliDate(dispute.submittedAt)}
                    </time>
                  </td>
                  <td>{dispute.fieldEvidence}</td>
                  <td>{dispute.residentEvidence}</td>
                  <td>{dispute.violation}</td>
                  <td>{dispute.reason}</td>
                  <td className="staff-amount">
                    {currency.format(dispute.amount)}
                  </td>
                  <td>
                    {status === "PENDING" ? (
                      <section className="staff-row-actions">
                        <button
                          className="staff-approve"
                          type="button"
                          onClick={() => onDecide(dispute.fineId, "WAIVED")}
                          aria-label={`Approve and waive ${dispute.ticket}`}
                        >
                          <Check size={14} aria-hidden="true" />
                          Approve
                        </button>
                        <button
                          className="staff-reject"
                          type="button"
                          onClick={() => onDecide(dispute.fineId, "REJECTED")}
                          aria-label={`Reject ${dispute.ticket}`}
                        >
                          <X size={14} aria-hidden="true" />
                          Reject
                        </button>
                      </section>
                    ) : (
                      <span
                        className={`staff-status-badge staff-status-badge--${status.toLowerCase()}`}
                      >
                        {status === "WAIVED" ? "Waived" : "Rejected"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {disputes.length === 0 ? (
              <tr>
                <td className="staff-empty" colSpan={8}>
                  No disputes match “{search}”.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </section>
  );
}
