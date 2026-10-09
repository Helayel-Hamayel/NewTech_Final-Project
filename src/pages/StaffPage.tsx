import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { StaffLayoutContext } from "../layouts/StaffLayout";
import { useCitationState } from "../contexts/useCitationState";
import { billingAccounts, staffDisputesData } from "../data/staffData";
import BillingLedger from "../components/Staff/BillingLedger";
import CitationDisputes from "../components/Staff/CitationDisputes";
import MaintenanceDispatch from "../components/Staff/MaintenanceDispatch";
import StaffServiceRequestInbox from "../components/Staff/StaffServiceRequestInbox";
import StaffOverview from "../components/Staff/StaffOverview";
import StaffTopBar from "../components/Staff/StaffTopBar";
import "../styles/pages/StaffDashboardPage.css";

export default function StaffPage() {
  const { activeTab, setActiveTab, unreadTabs, serviceRequests, setServiceRequests, maintenanceTickets } =
    useOutletContext<StaffLayoutContext>();
  const { citationState, decideCitation } = useCitationState();
  const [search, setSearch] = useState("");

  const pendingDisputes = staffDisputesData.filter((dispute) => citationState[dispute.fineId] === "PENDING").length;
  const openTickets = maintenanceTickets.filter((ticket) => ticket.status !== "Resolved").length;
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const matchingDisputes = staffDisputesData.filter((dispute) =>
    [dispute.ticket, dispute.residentName, dispute.violation, dispute.reason, dispute.fieldEvidence, dispute.residentEvidence].some(
      (value) => value.toLocaleLowerCase().includes(normalizedSearch),
    ),
  );
  const matchingAccounts = billingAccounts.filter((account) =>
    [account.resident, account.property, account.account].some((value) => value.toLocaleLowerCase().includes(normalizedSearch)),
  );
  return (
    <section className="staff-page" aria-label="Municipal staff dashboard">
      <StaffTopBar
        activeTab={activeTab}
        pendingDisputes={pendingDisputes}
        hasUnseenNotifications={unreadTabs.disputes}
        search={search}
        onSearchChange={setSearch}
        onOpenDisputes={() => setActiveTab("disputes")}
      />

      <section className="staff-dashboard-content" aria-label="Staff workspace">
        <StaffOverview pendingDisputes={pendingDisputes} openTickets={openTickets} />

        {activeTab === "requests" ? (
          <StaffServiceRequestInbox requests={serviceRequests} search={search} setRequests={setServiceRequests} />
        ) : null}

        {activeTab === "disputes" ? (
          <CitationDisputes
            disputes={matchingDisputes}
            pendingDisputes={pendingDisputes}
            citationState={citationState}
            search={search}
            onDecide={decideCitation}
          />
        ) : null}

        {activeTab === "billing" ? <BillingLedger accounts={matchingAccounts} search={search} /> : null}

        {activeTab === "maintenance" ? (
          <MaintenanceDispatch tickets={maintenanceTickets} search={search} setRequests={setServiceRequests} />
        ) : null}
      </section>
    </section>
  );
}
