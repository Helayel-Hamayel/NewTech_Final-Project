import { useState } from "react";
import { Building2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SharedLayout from "../components/common/SharedLayout";
import ThemeToggle from "../components/common/ThemeToggle";
import Billing from "../components/ResidentPage/Billing";
import Dashboard from "../components/ResidentPage/Dashboard";
import MyTickets from "../components/ResidentPage/MyTickets";
import Properties from "../components/ResidentPage/Properties";
import ResidentPortalNav from "../components/ResidentPage/ResidentPortalNav";
import { downloadInvoicePdf } from "../helpers/pdf/invoicePdf";
import type { PortalTab } from "../components/ResidentPage/types";
import {
  type Fine,
  type Invoice,
  type ResidentIssue,
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
  const [activeTab, setActiveTab] = useState<PortalTab>("Dashboard");
  const [utilityType, setUtilityType] = useState<UtilityType>("Water");
  const [fines, setFines] = useState(seededFines);
  const [residentIssues, setResidentIssues] =
    useState<ResidentIssue[]>(seededResidentIssues);
  const [selectedAppealFine, setSelectedAppealFine] = useState<Fine | null>(
    null,
  );
  const [appealStatement, setAppealStatement] = useState("");
  const [isSignoutOpen, setIsSignoutOpen] = useState(false);
  const unpaidFines = fines.filter((fine) => fine.status === "Unpaid");
  const unpaidFineTotal = unpaidFines.reduce(
    (total, fine) => total + fine.amount,
    0,
  );

  function handleAppeal(fineId: string) {
    setFines((currentFines) =>
      currentFines.map((fine) =>
        fine.id === fineId ? { ...fine, status: "Appealed" } : fine,
      ),
    );
  }

  function handleOpenAppeal(fine: Fine) {
    setSelectedAppealFine(fine);
    setAppealStatement("");
    setActiveTab("My Tickets");
  }

  function handleAddIssue(issue: ResidentIssue) {
    setResidentIssues((currentIssues) => [issue, ...currentIssues]);
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
              <p>City of</p>
              <p>Millbrook</p>
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
                      onClick={() => navigate("/login", { replace: true })}
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
          © 2026 City of Millbrook · Municipal Operations v2.4.1
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
              ) : activeTab === "My Tickets" ? (
                <MyTickets
                  tickets={seededMaintenanceTickets}
                  fines={fines}
                  issues={residentIssues}
                  onOpenAppeal={handleOpenAppeal}
                  selectedAppealFine={selectedAppealFine}
                  appealStatement={appealStatement}
                  onAppealStatementChange={setAppealStatement}
                  onSubmitAppeal={handleSubmitAppeal}
                  onCloseAppeal={() => setSelectedAppealFine(null)}
                  onAddIssue={handleAddIssue}
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
