import type { FineFromBackend } from "../../../data/fineData";
import { formatIsraeliDateTime } from "../../formatting/israeliDate";

const currency = new Intl.NumberFormat("en-IL", {
  style: "currency",
  currency: "ILS",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

export type HistoryIssue = FineFromBackend & {
  displayId: string;
};

export function prepareHistoryIssues(
  fines: FineFromBackend[],
): HistoryIssue[] {
  return [...fines]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .map((fine) => ({
      ...fine,
      displayId: `Fine-${fine._id.slice(-8)}`,
    }));
}

export function getHistoryCounts(fines: HistoryIssue[]) {
  return {
    total: fines.length,
    unpaid: fines.filter((fine) => fine.status === "UNPAID").length,
    paid: fines.filter((fine) => fine.status === "PAID").length,
    totalCost: fines.reduce((total, fine) => total + fine.amount, 0),
  };
}

export function filterHistoryIssues(
  fines: HistoryIssue[],
  search: string,
  status: string,
) {
  const query = search.trim().toLowerCase();
  const plateQuery = query.replace(/[\s-]/g, "");

  return fines.filter((fine) => {
    const matchesSearch =
      !query ||
      fine._id.toLowerCase().includes(query) ||
      fine.displayId.toLowerCase().includes(query) ||
      fine.violationType.toLowerCase().includes(query) ||
      (plateQuery.length > 0 &&
        fine.licensePlate
          .replace(/[\s-]/g, "")
          .toLowerCase()
          .includes(plateQuery));

    return (
      matchesSearch &&
      (status === "All" || fine.status === status.toUpperCase())
    );
  });
}

export function formatHistoryDate(value: string) {
  return formatIsraeliDateTime(value);
}

export function formatCost(amount: number) {
  return currency.format(amount);
}