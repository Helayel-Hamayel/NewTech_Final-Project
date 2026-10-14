import { useState } from "react";
import FieldGuardHistoryPage from "../components/fieldGuard/FieldGuardHistoryPage";
import FieldGuardImplementIssuePage from "../components/fieldGuard/FieldGuardImplementIssuePage";
import FieldGuardReportsPage from "../components/fieldGuard/FieldGuardReportsPage";
import FieldGuardHeader, { type FieldGuardTab } from "../components/fieldGuard/FieldGuardHeader";
import FieldGuardPage from "../pages/FieldGuardPage";
import "../styles/common/fieldGuard/FieldGuardLayout.css";

export default function FieldGuardLayout() {
  const [activeTab, setActiveTab] = useState<FieldGuardTab>("dashboard");

  return (
    <section className="field-guard-layout">
      <FieldGuardHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="field-guard-main">
        {activeTab === "dashboard" ? <FieldGuardPage /> : null}
        {activeTab === "citation" ? <FieldGuardImplementIssuePage /> : null}
        {activeTab === "reports" ? <FieldGuardReportsPage /> : null}
        {activeTab === "history" ? <FieldGuardHistoryPage /> : null}
      </main>
    </section>
  );
}
