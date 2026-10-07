import type { fieldGuardData } from "../../../data/fieldGuardData";
import { formatIsraeliDateTime } from "../../formatting/israeliDate";

const currency = new Intl.NumberFormat("en-IL", {
  style: "currency",
  currency: "ILS",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

export type HistoryIssue = (typeof fieldGuardData.issues)[number] & {
  displayId: string;
};

export function prepareHistoryIssues(
  issues: typeof fieldGuardData.issues,
): HistoryIssue[] {
  return issues
    .map((issue, index) => ({
      ...issue,
      displayId: `Issue-${String(index + 1).padStart(3, "0")}`,
    }))
    .reverse();
}

export function getHistoryCounts(issues: HistoryIssue[]) {
  return {
    total: issues.length,
    accepted: issues.filter((issue) => issue.status === "ACCEPTED").length,
    rejected: issues.filter((issue) => issue.status === "REJECTED").length,
    totalCost: issues.reduce((total, issue) => total + issue.amount, 0),
  };
}

export function filterHistoryIssues(
  issues: HistoryIssue[],
  search: string,
  status: string,
) {
  const query = search.trim().toLowerCase();
  return issues.filter(
    (issue) =>
      (issue.displayId.toLowerCase().includes(query) ||
        issue.vehicleRegistration?.toLowerCase().includes(query)) &&
      (status === "All" || issue.status === status.toUpperCase()),
  );
}

export function formatHistoryDate(value: string) {
  return formatIsraeliDateTime(value);
}

export function formatCost(amount: number) {
  return currency.format(amount);
}
