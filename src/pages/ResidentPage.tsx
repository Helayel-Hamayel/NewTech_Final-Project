import { useState } from "react";
import { Building2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SharedLayout from "../components/common/SharedLayout";
import ThemeToggle from "../components/common/ThemeToggle";
import Billing from "../components/ResidentPage/Billing";
import Dashboard from "../components/ResidentPage/Dashboard";
import MyTickets from "../components/ResidentPage/MyTickets";
import Properties from "../components/ResidentPage/Properties";
import ResidentPortalNav from "../components/ResidentPage/ResidentPortalNav";
import { downloadInvoicePdf } from "../helpers/pdf/invoicePdf";
import { useCitationState } from "../contexts/useCitationState";
import { useUser } from "../contexts/useUser";
import type { PortalTab } from "../components/ResidentPage/types";
import {
  type Fine,
  type Invoice,
  type ResidentServiceRequest,
  resident,
  seededFines,
  seededInvoices,
  seededMaintenanceTickets,
  seededResidentIssues,
  utilityUsage,
  type UtilityType,
} from "../data/residentPortal";
import "../styles/pages/ResidentPortalPage.css";

export default function ResidentPage() {
  const navigate = useNavigate();
  const { signOut } = useUser();
  const { citationState } = useCitationState();
  const [activeTab, setActiveTab] = useState<PortalTab>("Dashboard");
  const [utilityType, setUtilityType] = useState<UtilityType>("Water");
  const [appealedFineIds, setAppealedFineIds] = useState<string[]>([]);
  const [serviceRequests, setServiceRequests] = useState<
    ResidentServiceRequest[]
  >([
    ...seededResidentIssues.map((issue) => ({
      id: issue.id,
      type: issue.subject,
      description: issue.description,
      location: issue.location,
      reportedDate: issue.reportedDate,
      stage: issue.status,
      phone: issue.phone,
      preferredDate: "",
      attachment: issue.photo,
    })),
    ...seededMaintenanceTickets.map((ticket) => ({
      ...ticket,
      description: "Existing service request",
      phone: "050-555-4412",
      preferredDate: ticket.reportedDate,
      attachment: "",
    })),
  ]);
  const [selectedAppealFine, setSelectedAppealFine] = useState<Fine | null>(
    null,
  );
  const [appealStatement, setAppealStatement] = useState("");
  const [isSignoutOpen, setIsSignoutOpen] = useState(false);
  const fines = seededFines
    .filter((fine) => fine.residentId === resident.id)
    .map((fine) => ({
      ...fine,
      status:
        citationState[fine.id] === "WAIVED"
          ? ("Waived" as const)
          : appealedFineIds.includes(fine.id)
            ? ("Appealed" as const)
            : fine.status,
    }));
  const unpaidFines = fines.filter((fine) => fine.status === "Unpaid");
  const unpaidFineTotal = unpaidFines.reduce(
    (total, fine) => total + fine.amount,
    0,
  );

  function handleAppeal(fineId: string) {
    setAppealedFineIds((current) =>
      current.includes(fineId) ? current : [...current, fineId],
    );
  }

  function handleOpenAppeal(fine: Fine) {
    setSelectedAppealFine(fine);
    setAppealStatement("");
    setActiveTab("My Services");
  }

  function handleAddServiceRequest(request: ResidentServiceRequest) {
    setServiceRequests((currentRequests) => [request, ...currentRequests]);
  }

  function handleSubmitAppeal() {
    if (!selectedAppealFine) return;
    handleAppeal(selectedAppealFine.id);
    setSelectedAppealFine(null);
    setAppealStatement("");
  }

  function handleSignOut() {
    setIsSignoutOpen(true);
  }

  async function confirmSignOut() {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch {
      toast.error("Could not sign out. Please try again.");
    }
  }

  function handleDownloadInvoice(invoice: Invoice) {
    downloadInvoicePdf(invoice);
  }

  return (
    <SharedLayout
      header={
        <header className="resident-topbar">
          <div className="resident-brand">
            <span className="resident-brand-mark" aria-hidden="true">
              <Building2 size={20} strokeWidth={2.2} />
            </span>
            <div className="resident-brand-copy">
              <p>Tel Aviv-Yafo</p>
              <p>Municipality</p>
            </div>
          </div>

          <ResidentPortalNav activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="resident-user-meta">
            <ThemeToggle />
            <span className="resident-header-divider" aria-hidden="true" />
            <div className="resident-signout-wrap">
              <button
                className="resident-signout"
                type="button"
                onClick={handleSignOut}
                aria-expanded={isSignoutOpen}
                aria-controls="signout-popover"
              >
                <LogOut className="resident-signout-icon" aria-hidden="true" />
                Sign out
              </button>
              {isSignoutOpen ? (
                <div
                  className="signout-popover"
                  id="signout-popover"
                  role="dialog"
                  aria-labelledby="signout-popover-title"
                >
                  <strong id="signout-popover-title">
                    Sign out of CivicHub?
                  </strong>
                  <span>Your current portal session will end.</span>
                  <div className="signout-toast-actions">
                    <button
                      type="button"
                      onClick={confirmSignOut}
                    >
                      Sign out
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSignoutOpen(false)}
                    >
                      Stay signed in
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </header>
      }
      footer={
        <footer className="resident-footer">
          © 2026 Tel Aviv-Yafo Municipality · Municipal Services v2.4.1
        </footer>
      }
    >
      <main className="resident-page">
        <div className="resident-page-shell">
          <section className="resident-page-panel">
            <div className="resident-content">
              {activeTab === "Dashboard" ? (
                <Dashboard
                  unpaidFines={unpaidFines}
                  unpaidFineTotal={unpaidFineTotal}
                  utilityType={utilityType}
                  utilityUsage={utilityUsage[utilityType]}
                  onUtilityTypeChange={setUtilityType}
                  onOpenAppeal={handleOpenAppeal}
                  onNavigate={setActiveTab}
                />
              ) : activeTab === "Billing" ? (
                <Billing
                  invoices={seededInvoices}
                  onDownloadInvoice={handleDownloadInvoice}
                />
              ) : activeTab === "My Services" ? (
                <MyTickets
                  serviceRequests={serviceRequests}
                  fines={fines}
                  onOpenAppeal={handleOpenAppeal}
                  selectedAppealFine={selectedAppealFine}
                  appealStatement={appealStatement}
                  onAppealStatementChange={setAppealStatement}
                  onSubmitAppeal={handleSubmitAppeal}
                  onCloseAppeal={() => setSelectedAppealFine(null)}
                  onAddServiceRequest={handleAddServiceRequest}
                />
              ) : (
                <Properties />
              )}
            </div>
          </section>
        </div>
      </main>
    </SharedLayout>
  );
}
