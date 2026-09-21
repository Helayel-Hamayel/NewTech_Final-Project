import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SharedLayout from "../components/common/SharedLayout";
import Billing from "../components/ResidentPage/Billing";
import Dashboard from "../components/ResidentPage/Dashboard";
import MyTickets from "../components/ResidentPage/MyTickets";
import Properties from "../components/ResidentPage/Properties";
import ResidentPortalNav from "../components/ResidentPage/ResidentPortalNav";
import { currency } from "../components/ResidentPage/formatters";
import type { PortalTab } from "../components/ResidentPage/types";
import {
  type Fine,
  type Invoice,
  type ResidentIssue,
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
  const [activeTab, setActiveTab] = useState<PortalTab>("Dashboard");
  const [utilityType, setUtilityType] = useState<UtilityType>("Water");
  const [fines, setFines] = useState(seededFines);
  const [residentIssues, setResidentIssues] =
    useState<ResidentIssue[]>(seededResidentIssues);
  const [selectedAppealFine, setSelectedAppealFine] = useState<Fine | null>(
    null,
  );
  const [appealStatement, setAppealStatement] = useState("");
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
  }

  function handleAddIssue(issue: ResidentIssue) {
    setResidentIssues((currentIssues) => [issue, ...currentIssues]);
  }

  function handleCheckIssue(issueId: string) {
    setResidentIssues((currentIssues) =>
      currentIssues.map((issue) =>
        issue.id === issueId
          ? { ...issue, status: "Field Guard Checked" }
          : issue,
      ),
    );
  }

  function handleSubmitAppeal() {
    if (!selectedAppealFine) return;
    handleAppeal(selectedAppealFine.id);
    setSelectedAppealFine(null);
    setAppealStatement("");
  }

  function handleDownloadInvoice(invoice: Invoice) {
    const document = new jsPDF();
    const pageWidth = document.internal.pageSize.getWidth();

    document.setFillColor(22, 64, 112);
    document.rect(0, 0, pageWidth, 42, "F");
    document.setTextColor(255, 255, 255);
    document.setFontSize(22);
    document.setFont("helvetica", "bold");
    document.text("CivicHub", 18, 18);
    document.setFontSize(10);
    document.setFont("helvetica", "normal");
    document.text("Resident payment invoice", 18, 27);
    document.setFontSize(18);
    document.setFont("helvetica", "bold");
    document.text("INVOICE", pageWidth - 18, 18, { align: "right" });

    document.setTextColor(45, 55, 72);
    document.setFontSize(11);
    document.setFont("helvetica", "normal");
    document.text(`Invoice number: ${invoice.id}`, 18, 60);
    document.text(`Billing period: ${invoice.period}`, 18, 68);
    document.text(`Resident: ${resident.name}`, pageWidth - 18, 60, {
      align: "right",
    });
    document.text(`Resident ID: ${resident.id}`, pageWidth - 18, 68, {
      align: "right",
    });

    autoTable(document, {
      startY: 84,
      head: [["Charge", "Amount"]],
      body: [
        ["Rent", currency.format(invoice.rent)],
        ["Water", currency.format(invoice.water)],
        ["Electricity", currency.format(invoice.electricity)],
        ["Fines", currency.format(invoice.fines)],
      ],
      theme: "grid",
      headStyles: { fillColor: [22, 64, 112], textColor: 255 },
      bodyStyles: { textColor: [45, 55, 72], fontSize: 11 },
      columnStyles: { 1: { halign: "right" } },
      margin: { left: 18, right: 18 },
    });

    const finalY =
      (document as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
        ?.finalY ?? 120;
    document.setFillColor(239, 246, 255);
    document.roundedRect(18, finalY + 14, pageWidth - 36, 28, 2, 2, "F");
    document.setTextColor(22, 64, 112);
    document.setFont("helvetica", "bold");
    document.setFontSize(12);
    document.text("Total due", 26, finalY + 31);
    document.setFontSize(16);
    document.text(currency.format(invoice.total), pageWidth - 26, finalY + 31, {
      align: "right",
    });
    document.setFont("helvetica", "normal");
    document.setFontSize(10);
    document.setTextColor(85, 95, 110);
    document.text(`Status: ${invoice.status}`, 18, finalY + 58);
    document.text("Thank you for using CivicHub.", 18, finalY + 68);

    document.save(`${invoice.id}.pdf`);
  }

  return (
    <SharedLayout
      header={
        <header className="resident-topbar">
          <div className="resident-brand">
            <span className="resident-brand-mark" aria-hidden="true">
              C
            </span>
            <div className="resident-brand-copy">
              <p>City of</p>
              <p>Millbrook</p>
            </div>
          </div>

          <div className="resident-user-meta">
            <div>
              <p className="resident-user-label">Resident portal</p>
              <p className="resident-user-name">
                {resident.name} · {resident.id}
              </p>
            </div>
            <button className="resident-signout" type="button">
              Sign Out
            </button>
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
            <ResidentPortalNav activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="resident-content">
              {activeTab === "Dashboard" ? (
                <Dashboard
                  unpaidFines={unpaidFines}
                  unpaidFineTotal={unpaidFineTotal}
                  utilityType={utilityType}
                  utilityUsage={utilityUsage[utilityType]}
                  onUtilityTypeChange={setUtilityType}
                  onAppeal={handleAppeal}
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
                  onCheckIssue={handleCheckIssue}
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
