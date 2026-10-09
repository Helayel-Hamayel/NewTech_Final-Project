import { useEffect, useState } from "react";
import { Building2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SharedLayout from "../components/common/SharedLayout";
import MobileDrawer from "../components/common/MobileDrawer";
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
  utilityUsage,
  type UtilityType,
} from "../data/residentPortal";
import type { ReportFromBackend } from "../data/staffData";
import "../styles/pages/ResidentPortalPage.css";

const residentDrawerItems: Array<{
  id: PortalTab;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "Billing", label: "Billing", icon: FileText },
  { id: "My Services", label: "My Services", icon: ClipboardList },
  { id: "Properties", label: "Properties", icon: Home },
];

export default function ResidentPage() {
  const navigate = useNavigate();
  const { signOut } = useUser();
  const { citationState } = useCitationState();
  const [activeTab, setActiveTab] = useState<PortalTab>("Dashboard");
  const [utilityType, setUtilityType] = useState<UtilityType>("Water");
  const [appealedFineIds, setAppealedFineIds] = useState<string[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ResidentServiceRequest[]>([]);

  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState("");

  const [selectedAppealFine, setSelectedAppealFine] = useState<Fine | null>(null);
  const [appealStatement, setAppealStatement] = useState("");
  const [isSignoutOpen, setIsSignoutOpen] = useState(false);
  const fines = seededFines
    .filter((fine) => fine.residentId === resident.id)
    .map((fine) => ({
      ...fine,
      status:
        citationState[fine.id] === "WAIVED" ? ("Waived" as const) : appealedFineIds.includes(fine.id) ? ("Appealed" as const) : fine.status,
    }));
  const unpaidFines = fines.filter((fine) => fine.status === "Unpaid");
  const unpaidFineTotal = unpaidFines.reduce((total, fine) => total + fine.amount, 0);

  function handleAppeal(fineId: string) {
    setAppealedFineIds((current) => (current.includes(fineId) ? current : [...current, fineId]));
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

  useEffect(() => {
    const controller = new AbortController();

    async function loadReports() {
      try {
        const response = await fetch("http://localhost:4000/reports", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load your reports.");
        }

        const reports: ReportFromBackend[] = await response.json();

        const stageLabels: Record<ReportFromBackend["status"], ResidentServiceRequest["stage"]> = {
          NEW: "Reported",
          DISPATCHED: "Dispatched",
          "IN PROGRESS": "In Progress",
          RESOLVED: "Resolved",
          REJECTED: "Rejected",
        };

        const requests: ResidentServiceRequest[] = reports.map((report) => ({
          id: report._id,
          type: report.category,
          description: report.description,
          location: report.location,
          phone: report.phone,
          attachment: report.photoUrl,
          reportedDate: new Date(report.createdAt).toLocaleString("en-GB", {
            timeZone: "Asia/Jerusalem",
            dateStyle: "short",
            timeStyle: "short",
          }),
          preferredDate: "",
          stage: stageLabels[report.status],
          rejectionReason: report.rejectionReason,
          resolvedAt: report.resolvedAt,
        }));

        if (!controller.signal.aborted) {
          setServiceRequests(requests);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setReportsError(error instanceof Error ? error.message : "Could not load your reports.");
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
          <MobileDrawer
            brandIcon={<Building2 />} userName={resident.name} subtitle="Resident Portal"
            items={residentDrawerItems}
            activeId={activeTab}
            onSelect={setActiveTab}
          />

          <div className="resident-user-meta">
            <ThemeToggle />
            <span className="resident-header-divider" aria-hidden="true" />
            <div className="resident-signout-wrap">
              <button
                className="resident-signout"
                type="button"
                onClick={handleSignOut}
                aria-expanded={isSignoutOpen}
                aria-controls="signout-popover">
                <LogOut className="resident-signout-icon" aria-hidden="true" />
                Sign out
              </button>
              {isSignoutOpen ? (
                <div className="signout-popover" id="signout-popover" role="dialog" aria-labelledby="signout-popover-title">
                  <strong id="signout-popover-title">Sign out of CivicHub?</strong>
                  <span>Your current portal session will end.</span>
                  <div className="signout-toast-actions">
                    <button type="button" onClick={confirmSignOut}>
                      Sign out
                    </button>
                    <button type="button" onClick={() => setIsSignoutOpen(false)}>
                      Stay signed in
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </header>
      }
      footer={<footer className="resident-footer">© 2026 Tel Aviv-Yafo Municipality · Municipal Services v2.4.1</footer>}>
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
                <Billing invoices={seededInvoices} onDownloadInvoice={handleDownloadInvoice} />
              ) : activeTab === "My Services" ? (
                <>
                  {reportsLoading ? (
                    <p role="status">Loading your reports...</p>
                  ) : reportsError ? (
                    <p role="alert">{reportsError}</p>
                  ) : (
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
                  )}
                </>
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
