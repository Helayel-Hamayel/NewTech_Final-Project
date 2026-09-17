import type { fieldGuardData } from "../../../data/fieldGuardData(Demo)";

export function filterReports(
  reports: typeof fieldGuardData.reports,
  status: string,
  priority: string,
) {
  return reports
    .map((report, index) => ({
      ...report,
      displayId: `Report-${String(index + 1).padStart(3, "0")}`,
    }))
    .filter((report) =>
      (status === "All" || report.status === status.toUpperCase()) &&
      (priority === "All" || report.priority === priority.toUpperCase()),
    )
    .reverse();
}
