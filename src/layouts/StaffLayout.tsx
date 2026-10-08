import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Outlet } from "react-router-dom";
import StaffHeader from "../components/Staff/StaffHeader";
import { useCitationState } from "../contexts/useCitationState";
import { billingAccounts, staffDisputesData, type StaffServiceRequest, type StaffTab, type ReportFromBackend } from "../data/staffData";
import "../styles/common/Staff/StaffLayout.css";

export type StaffLayoutContext = {
  activeTab: StaffTab;
  setActiveTab: (tab: StaffTab) => void;
  unreadTabs: Record<StaffTab, boolean>;
  serviceRequests: StaffServiceRequest[];
  setServiceRequests: Dispatch<SetStateAction<StaffServiceRequest[]>>;
  maintenanceTickets: StaffServiceRequest[];
};

export default function StaffLayout() {
  const [activeTab, setActiveTab] = useState<StaffTab>("disputes");
  const [serviceRequests, setServiceRequests] = useState<StaffServiceRequest[]>([]);

  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState("");
  const maintenanceTickets = serviceRequests.filter(
    (request) => request.assignedTo === "Maintenance Team" || (request.status === "Rejected" && !request.assignedTo),
  );
  const { citationState } = useCitationState();
  const pendingDisputes = staffDisputesData.filter((dispute) => citationState[dispute.fineId] === "PENDING").length;
  const overdueAccounts = billingAccounts.filter((account) => account.status === "Overdue").length;
  const openTickets = maintenanceTickets.filter((ticket) => ticket.status === "Assigned" || ticket.status === "In Progress").length;
  const pendingServiceRequests = serviceRequests.filter((request) => request.status === "Pending").length;
  const currentItemIds: Record<StaffTab, string[]> = {
    requests: serviceRequests.filter((request) => request.status === "Pending").map((request) => request.id),
    disputes: staffDisputesData.filter((dispute) => citationState[dispute.fineId] === "PENDING").map((dispute) => dispute._id),
    billing: billingAccounts.filter((account) => account.status === "Overdue").map((account) => account.account),
    maintenance: maintenanceTickets
      .filter((ticket) => ticket.status === "Assigned" || ticket.status === "In Progress")
      .map((ticket) => ticket.id),
  };
  const [seenItemIds, setSeenItemIds] = useState<Record<StaffTab, string[]>>(() => ({
    requests: [],
    disputes: currentItemIds.disputes,
    billing: [],
    maintenance: [],
  }));

  useEffect(() => {
    const controller = new AbortController();

    async function loadReports() {
      setReportsLoading(true);
      setReportsError("");

      try {
        const response = await fetch("http://localhost:4000/reports", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load the reports.");
        }

        const reports: ReportFromBackend[] = await response.json();

        const statusLabels: Record<ReportFromBackend["status"], StaffServiceRequest["status"]> = {
          NEW: "Pending",
          DISPATCHED: "Assigned",
          "IN PROGRESS": "In Progress",
          RESOLVED: "Resolved",
          REJECTED: "Rejected",
        };

        const requests: StaffServiceRequest[] = reports.map((report) => ({
          id: report._id,
          residentName: report.resident?.name ?? "Unknown resident",
          type: report.category,
          description: report.description,
          location: report.location,
          reported: new Date(report.createdAt).toLocaleString("en-GB", {
            timeZone: "Asia/Jerusalem",
            dateStyle: "short",
            timeStyle: "short",
          }),
          phone: report.phone,
          attachment: report.photoUrl,
          status: statusLabels[report.status],
          assignedTo: report.assignedTeam === "MAINTENANCE" ? "Maintenance Team" : report.assignedFieldGuard ? "Field Guard" : undefined,
          rejectionReason: report.rejectionReason,
          resolvedAt: report.resolvedAt,
        }));

        if (!controller.signal.aborted) {
          setServiceRequests(requests);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setReportsError(error instanceof Error ? error.message : "Could not load the reports.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setReportsLoading(false);
        }
      }
    }

    loadReports();

    return () => controller.abort();
  }, []);

  const unreadTabs: Record<StaffTab, boolean> = {
    requests: currentItemIds.requests.some((id) => !seenItemIds.requests.includes(id)),
    disputes: currentItemIds.disputes.some((id) => !seenItemIds.disputes.includes(id)),
    billing: currentItemIds.billing.some((id) => !seenItemIds.billing.includes(id)),
    maintenance: currentItemIds.maintenance.some((id) => !seenItemIds.maintenance.includes(id)),
  };

  function handleTabChange(tab: StaffTab) {
    setActiveTab(tab);
    setSeenItemIds((previous) => ({
      ...previous,
      [tab]: currentItemIds[tab],
    }));
  }

  return (
    <div className="staff-shell">
      <StaffHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unreadTabs={unreadTabs}
        pendingDisputes={pendingDisputes}
        overdueAccounts={overdueAccounts}
        openTickets={openTickets}
        pendingServiceRequests={pendingServiceRequests}
      />
      <main className="staff-content">
        {reportsLoading && <p role="status">Loading reports...</p>}

        {reportsError && <p role="alert">{reportsError}</p>}
        <Outlet
          context={
            {
              activeTab,
              setActiveTab: handleTabChange,
              unreadTabs,
              serviceRequests,
              setServiceRequests,
              maintenanceTickets,
            } satisfies StaffLayoutContext
          }
        />
      </main>
    </div>
  );
}
