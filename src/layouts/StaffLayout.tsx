import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Outlet } from "react-router-dom";
import StaffHeader from "../components/Staff/StaffHeader";
import { useCitationState } from "../contexts/useCitationState";
import {
  billingAccounts,
  seededStaffTickets,
  staffDisputesData,
  type StaffMaintenanceTicket,
  type StaffTab,
} from "../data/staffData";
import "../styles/common/Staff/StaffLayout.css";

export type StaffLayoutContext = {
  activeTab: StaffTab;
  setActiveTab: (tab: StaffTab) => void;
  unreadTabs: Record<StaffTab, boolean>;
  maintenanceTickets: StaffMaintenanceTicket[];
  setMaintenanceTickets: Dispatch<SetStateAction<StaffMaintenanceTicket[]>>;
};

export default function StaffLayout() {
  const [activeTab, setActiveTab] = useState<StaffTab>("disputes");
  const [maintenanceTickets, setMaintenanceTickets] =
    useState<StaffMaintenanceTicket[]>(seededStaffTickets);
  const { citationState } = useCitationState();
  const pendingDisputes = staffDisputesData.filter(
    (dispute) => citationState[dispute.fineId] === "PENDING",
  ).length;
  const overdueAccounts = billingAccounts.filter(
    (account) => account.status === "Overdue",
  ).length;
  const openTickets = maintenanceTickets.filter(
    (ticket) => ticket.status !== "Completed",
  ).length;
  const currentItemIds: Record<StaffTab, string[]> = {
    disputes: staffDisputesData
      .filter((dispute) => citationState[dispute.fineId] === "PENDING")
      .map((dispute) => dispute._id),
    billing: billingAccounts
      .filter((account) => account.status === "Overdue")
      .map((account) => account.account),
    maintenance: maintenanceTickets
      .filter((ticket) => ticket.status !== "Completed")
      .map((ticket) => ticket.id),
  };
  const [seenItemIds, setSeenItemIds] = useState<Record<StaffTab, string[]>>(
    () => ({
      disputes: currentItemIds.disputes,
      billing: [],
      maintenance: [],
    }),
  );
  const unreadTabs: Record<StaffTab, boolean> = {
    disputes: currentItemIds.disputes.some(
      (id) => !seenItemIds.disputes.includes(id),
    ),
    billing: currentItemIds.billing.some(
      (id) => !seenItemIds.billing.includes(id),
    ),
    maintenance: currentItemIds.maintenance.some(
      (id) => !seenItemIds.maintenance.includes(id),
    ),
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
      />
      <main className="staff-content">
        <Outlet
          context={{
            activeTab,
            setActiveTab: handleTabChange,
            unreadTabs,
            maintenanceTickets,
            setMaintenanceTickets,
          } satisfies StaffLayoutContext}
        />
      </main>
    </div>
  );
}
