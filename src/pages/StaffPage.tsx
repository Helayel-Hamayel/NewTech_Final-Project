import { useOutletContext } from "react-router-dom";
import type { StaffLayoutContext } from "../layouts/StaffLayout";
import BillingLedger from "../components/Staff/BillingLedger";
import LoadingState from "../components/common/LoadingState";
import CitationDisputes from "../components/Staff/CitationDisputes";
import MaintenanceDispatch from "../components/Staff/MaintenanceDispatch";
import StaffServiceRequestInbox from "../components/Staff/StaffServiceRequestInbox";
import StaffOverview from "../components/Staff/StaffOverview";
import StaffTopBar from "../components/Staff/StaffTopBar";
import "../styles/pages/StaffDashboardPage.css";

export default function StaffPage() {
  const {
    activeTab,
    reportsLoading,
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

  const pendingDisputes = appeals.filter((appeal) => appeal.status === "PENDING").length;
  const openTickets = maintenanceTickets.filter((ticket) => ticket.status !== "Resolved").length;

  return (
    <section className="staff-page" aria-label="Municipal staff dashboard">
      <StaffTopBar activeTab={activeTab} />

      <section className="staff-dashboard-content" aria-label="Staff workspace">
        <StaffOverview
          pendingDisputes={pendingDisputes}
          openTickets={openTickets}
          serviceRequests={serviceRequests}
          loading={reportsLoading}
        />

        {activeTab === "requests" ? (
          <StaffServiceRequestInbox requests={serviceRequests} search="" setRequests={setServiceRequests} />
        ) : null}

        {activeTab === "disputes" ? (
          appealsLoading ? (
            <LoadingState variant="inline" title="Loading appeals" description="Fetching citation appeals." />
          ) : appealsError ? (
            <p role="alert">{appealsError}</p>
          ) : (
            <CitationDisputes appeals={appeals} setAppeals={setAppeals} />
          )
        ) : null}

        {activeTab === "billing" ? (
          utilitiesLoading ? (
            <LoadingState variant="inline" title="Loading billing ledger" description="Fetching billing records." />
          ) : utilitiesError ? (
            <p role="alert">{utilitiesError}</p>
          ) : (
            <BillingLedger accounts={utilityAccounts} />
          )
        ) : null}
        {activeTab === "maintenance" ? (
          <MaintenanceDispatch tickets={maintenanceTickets} search="" setRequests={setServiceRequests} />
        ) : null}
      </section>
    </section>
  );
}
