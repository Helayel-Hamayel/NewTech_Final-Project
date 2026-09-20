import type { fieldGuardData } from "../../../data/fieldGuardData";

export function getReportCounts(reports: typeof fieldGuardData.reports) {
  return {
    total: reports.length,
    new: reports.filter((report) => report.status === "NEW").length,
    inProgress: reports.filter((report) => report.status === "IN PROGRESS")
      .length,
    resolved: reports.filter((report) => report.status === "RESOLVED").length,
    rejected: reports.filter((report) => report.status === "REJECTED").length,
  };
}
