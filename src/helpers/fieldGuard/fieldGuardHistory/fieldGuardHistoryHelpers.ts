import type { fieldGuardData } from "../../../data/fieldGuardData(Demo)";

export type HistoryIssue = (typeof fieldGuardData.issues)[number] & {
  displayId: string;
};

export function prepareHistoryIssues(issues: typeof fieldGuardData.issues): HistoryIssue[] {
  return issues.map((issue, index) => ({
    ...issue,
    displayId: `Issue-${String(index + 1).padStart(3, "0")}`,
  })).reverse();
}

export function getHistoryCounts(issues: HistoryIssue[]) {
  return {
    total: issues.length,
    accepted: issues.filter((issue) => issue.status === "ACCEPTED").length,
    rejected: issues.filter((issue) => issue.status === "REJECTED").length,
    totalCost: issues.reduce((total, issue) => total + issue.amount, 0),
  };
}

export function filterHistoryIssues(issues: HistoryIssue[], search: string, status: string) {
  const query = search.trim().toLowerCase();
  return issues.filter((issue) =>
    issue.displayId.toLowerCase().includes(query) &&
    (status === "All" || issue.status === status.toUpperCase()),
  );
}

export function formatHistoryDate(value: string) {
  const date = new Date(value);
  return `${date.toLocaleDateString("en-GB")} @ ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit",
  })}`;
}

export function formatCost(amount: number) {
  return amount.toLocaleString("en-GB", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
}
