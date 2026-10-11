import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { StaffLayoutContext } from "../layouts/StaffLayout";
import BillingLedger from "../components/Staff/BillingLedger";
import CitationDisputes from "../components/Staff/CitationDisputes";
import MaintenanceDispatch from "../components/Staff/MaintenanceDispatch";
import StaffServiceRequestInbox from "../components/Staff/StaffServiceRequestInbox";
import StaffOverview from "../components/Staff/StaffOverview";
import StaffTopBar from "../components/Staff/StaffTopBar";
import "../styles/pages/StaffDashboardPage.css";

export default function StaffPage() {
  const {
    activeTab,
    setActiveTab,
    unreadTabs,
    serviceRequests,
    setServiceRequests,
    maintenanceTickets,
    appeals,
    setAppeals,
    appealsLoading,
    appealsError,
    utilityAccounts,
    utilitiesLoading,
    utilitiesError,
  } = useOutletContext<StaffLayoutContext>();
  const [search, setSearch] = useState("");

  const pendingDisputes = appeals.filter((appeal) => appeal.status === "PENDING").length;
  const openTickets = maintenanceTickets.filter((ticket) => ticket.status !== "Resolved").length;

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
          <StaffServiceRequestInbox requests={serviceRequests} search="" setRequests={setServiceRequests} />
        ) : null}

        {activeTab === "disputes" ? (
          appealsLoading ? (
            <p role="status">Loading appeals...</p>
          ) : appealsError ? (
            <p role="alert">{appealsError}</p>
          ) : (
            <CitationDisputes appeals={appeals} setAppeals={setAppeals} search="" />
          )
        ) : null}

        {activeTab === "billing" ? (
          utilitiesLoading ? (
            <p role="status">Loading billing ledger...</p>
          ) : utilitiesError ? (
            <p role="alert">{utilitiesError}</p>
          ) : (
            <BillingLedger accounts={utilityAccounts} search={search} />
          )
        ) : null}
        {activeTab === "maintenance" ? (
          <MaintenanceDispatch tickets={maintenanceTickets} search="" setRequests={setServiceRequests} />
        ) : null}
      </section>
    </section>
  );
}
