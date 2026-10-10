import { useEffect, useState } from "react";
import { Building2, ClipboardList, FileText, Home, LayoutDashboard, LogOut } from "lucide-react";
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
  seededInvoices,
  utilityUsage,
  type UtilityType,
} from "../data/residentPortal";
import type { ReportFromBackend } from "../data/staffData";
import type { FineFromBackend } from "../data/fineData";
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
  const [appealSubmitting, setAppealSubmitting] = useState(false);
  const [appealError, setAppealError] = useState("");
  const [isSignoutOpen, setIsSignoutOpen] = useState(false);
  const [savedFines, setSavedFines] = useState<Fine[]>([]);
  const [finesLoading, setFinesLoading] = useState(true);
  const [finesError, setFinesError] = useState("");

  const serviceFines: Fine[] = savedFines.map((fine) => ({
    ...fine,
    status: citationState[fine.id] === "WAIVED" ? "Waived" : appealedFineIds.includes(fine.id) ? "Appealed" : fine.status,
  }));

  const recentFines = serviceFines.slice(0, 3);

  const unpaidFines = savedFines.filter((fine) => fine.status === "Unpaid");

  const unpaidFineTotal = unpaidFines.reduce((total, fine) => total + fine.amount, 0);

  function handleAppeal(fineId: string) {
    setAppealedFineIds((current) => (current.includes(fineId) ? current : [...current, fineId]));
  }

  function handleOpenAppeal(fine: Fine) {
    setSelectedAppealFine(fine);
    setAppealStatement("");
    setAppealError("");
    setActiveTab("My Services");
  }

  function handleAddServiceRequest(request: ResidentServiceRequest) {
    setServiceRequests((currentRequests) => [request, ...currentRequests]);
  }

  async function handleSubmitAppeal(formData: FormData) {
    if (!selectedAppealFine || appealSubmitting) return;

    setAppealError("");

    const description = appealStatement.trim();

    if (!description) {
      setAppealError("Please describe why you are appealing this fine.");
      return;
    }

    const photo = formData.get("photo");

    if (photo instanceof File && photo.size > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(photo.type)) {
        setAppealError("Choose a JPEG, PNG, or WebP image.");
        return;
      }

      if (photo.size > 5 * 1024 * 1024) {
        setAppealError("The photo must be 5 MB or smaller.");
        return;
      }
    } else {
      formData.delete("photo");
    }

    formData.set("fineId", selectedAppealFine.id);
    formData.set("description", description);

    setAppealSubmitting(true);

    try {
      const response = await fetch("http://localhost:4000/appeals", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(errorData?.message ?? "Could not submit the appeal.");
      }

      handleAppeal(selectedAppealFine.id);
      setSelectedAppealFine(null);
      setAppealStatement("");
      toast.success("Your appeal was submitted successfully.");
    } catch (error) {
      setAppealError(error instanceof Error ? error.message : "Could not submit the appeal.");
    } finally {
      setAppealSubmitting(false);
    }
  }

  function handleCloseAppeal() {
    if (appealSubmitting) return;

    setSelectedAppealFine(null);
    setAppealStatement("");
    setAppealError("");
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

  useEffect(() => {
    const controller = new AbortController();

    async function loadFines() {
      try {
        const response = await fetch("http://localhost:4000/fines", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not load your fines.");
        }

        const data: FineFromBackend[] = await response.json();

        const mappedFines: Fine[] = data.map((fine) => ({
          id: fine._id,
          residentId: fine.resident,
          status: fine.status === "PAID" ? "Paid" : "Unpaid",
          violation: fine.violationType,
          licensePlate: fine.licensePlate,
          location: "Not recorded",
          date: new Date(fine.createdAt).toLocaleString("en-GB", {
            timeZone: "Asia/Jerusalem",
            dateStyle: "short",
            timeStyle: "short",
          }),
          amount: fine.amount,
          photo: fine.photoUrl ? "Photo available" : "No photo",
          photoUrl: fine.photoUrl,
          resolvedAt: fine.resolvedAt,
        }));

        if (!controller.signal.aborted) {
          setSavedFines(mappedFines);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setFinesError(error instanceof Error ? error.message : "Could not load your fines.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setFinesLoading(false);
        }
      }
    }

    loadFines();

    return () => controller.abort();
  }, []);

  return (
    <SharedLayout
      header={
        <header className="resident-topbar">
          <section className="resident-brand">
            <span className="resident-brand-mark" aria-hidden="true">
              <Building2 size={20} strokeWidth={2.2} />
            </span>
            <section className="resident-brand-copy">
              <p>Tel Aviv-Yafo</p>
              <p>Municipality</p>
            </section>
          </section>

          <ResidentPortalNav activeTab={activeTab} onTabChange={setActiveTab} />
          <MobileDrawer
            brandIcon={<Building2 />}
            userName={resident.name}
            subtitle="Resident Portal"
            items={residentDrawerItems}
            activeId={activeTab}
            onSelect={setActiveTab}
          />

          <section className="resident-user-meta">
            <ThemeToggle />
            <span className="resident-header-divider" aria-hidden="true" />
            <section className="resident-signout-wrap">
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
                <section className="signout-popover" id="signout-popover" role="dialog" aria-labelledby="signout-popover-title">
                  <strong id="signout-popover-title">Sign out of CivicHub?</strong>
                  <span>Your current portal session will end.</span>
                  <section className="signout-toast-actions">
                    <button type="button" onClick={confirmSignOut}>
                      Sign out
                    </button>
                    <button type="button" onClick={() => setIsSignoutOpen(false)}>
                      Stay signed in
                    </button>
                  </section>
                </section>
              ) : null}
            </section>
          </section>
        </header>
      }
      footer={<footer className="resident-footer">© 2026 Tel Aviv-Yafo Municipality · Municipal Services v2.4.1</footer>}>
      <main className="resident-page">
        <section className="resident-page-shell">
          <section className="resident-page-panel">
            <section className="resident-content">
              {activeTab === "Dashboard" ? (
                <Dashboard
                  recentFines={recentFines}
                  finesLoading={finesLoading}
                  finesError={finesError}
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
                      fines={serviceFines}
                      finesLoading={finesLoading}
                      finesError={finesError}
                      onOpenAppeal={handleOpenAppeal}
                      selectedAppealFine={selectedAppealFine}
                      appealStatement={appealStatement}
                      appealSubmitting={appealSubmitting}
                      appealError={appealError}
                      onAppealStatementChange={setAppealStatement}
                      onSubmitAppeal={handleSubmitAppeal}
                      onCloseAppeal={handleCloseAppeal}
                      onAddServiceRequest={handleAddServiceRequest}
                    />
                  )}
                </>
              ) : (
                <Properties />
              )}
            </section>
          </section>
        </section>
      </main>
    </SharedLayout>
  );
}
