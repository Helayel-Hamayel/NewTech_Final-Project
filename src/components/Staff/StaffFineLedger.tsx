import { useEffect, useState } from "react";
import type { StaffFineFromBackend } from "../../data/fineData";
import { currency } from "../../helpers/formatting/currency";
import { formatIsraeliDateTime } from "../../helpers/formatting/israeliDate";

type StaffFineLedgerProps = {
  search: string;
};

export default function StaffFineLedger({ search }: StaffFineLedgerProps) {
  const [fines, setFines] = useState<StaffFineFromBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [statusFilter, setStatusFilter] = useState<StaffFineFromBackend["status"]>("UNPAID");

  useEffect(() => {
    const controller = new AbortController();

    async function loadFines() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("http://localhost:4000/fines/staff", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load fines.");
        }

        const data: StaffFineFromBackend[] = await response.json();

        if (!controller.signal.aborted) {
          setFines(data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error instanceof Error ? error.message : "Could not load fines.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadFines();

    return () => controller.abort();
  }, [refreshKey]);

  const query = search.trim().toLowerCase();

  const matchingFines = fines.filter(
    (fine) =>
      fine.status === statusFilter &&
      [fine.resident?.name ?? "", fine.resident?.email ?? "", fine.licensePlate].some((value) => value.toLowerCase().includes(query)),
  );

  return (
    <section aria-label="Resident fines ledger">
      <div className="staff-ledger-filters" role="group" aria-label="Filter fine payment status">
        <button type="button" aria-pressed={statusFilter === "UNPAID"} onClick={() => setStatusFilter("UNPAID")}>
          Unpaid
        </button>

        <button type="button" aria-pressed={statusFilter === "PAID"} onClick={() => setStatusFilter("PAID")}>
          Paid
        </button>

        <button type="button" disabled={loading} onClick={() => setRefreshKey((current) => current + 1)}>
          Refresh
        </button>
      </div>

      {loading ? (
        <p role="status">Loading fines...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <>
          <p className="staff-result-count">{matchingFines.length} fines</p>

          <section className="staff-table-scroll" role="region" aria-label="Fines table" tabIndex={0}>
            <table className="staff-table staff-billing-table">
              <thead>
                <tr>
                  <th scope="col">Resident</th>
                  <th scope="col">License plate</th>
                  <th scope="col">Violation</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Issued</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>

              <tbody>
                {matchingFines.map((fine) => (
                  <tr key={fine._id}>
                    <td className="staff-resident-cell">
                      <div className="staff-ledger-resident">
                        <strong>{fine.resident?.name ?? "Resident unavailable"}</strong>
                        <span>{fine.resident?.email ?? "Email unavailable"}</span>
                      </div>
                    </td>

                    <td>{fine.licensePlate}</td>
                    <td>{fine.violationType}</td>
                    <td className="staff-amount">{currency.format(fine.amount)}</td>
                    <td>{formatIsraeliDateTime(fine.createdAt)}</td>
                    <td>
                      <span className={`staff-status-badge staff-ledger-status--${fine.status.toLowerCase()}`}>
                        {fine.status === "PAID" ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                  </tr>
                ))}

                {matchingFines.length === 0 && (
                  <tr>
                    <td className="staff-empty" colSpan={6}>
                      No fines match this status and search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </>
      )}
    </section>
  );
}
