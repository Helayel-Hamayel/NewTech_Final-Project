import { useState } from "react";
import FieldGuardHistoryPage from "../components/FieldGuard/FieldGuardHistoryPage";
import FieldGuardImplementIssuePage from "../components/FieldGuard/FieldGuardImplementIssuePage";
import FieldGuardReportsPage from "../components/FieldGuard/FieldGuardReportsPage";
import FieldGuardHeader, {
  type FieldGuardTab,
} from "../components/FieldGuard/FieldGuardHeader";
import FieldGuardPage from "../pages/FieldGuardPage";
import "../styles/common/fieldGuard/FieldGuardLayout.css";

export default function FieldGuardLayout() {
  const [activeTab, setActiveTab] = useState<FieldGuardTab>("dashboard");

  return (
    <div className="field-guard-layout">
      <FieldGuardHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="field-guard-main">
        {activeTab === "dashboard" ? <FieldGuardPage /> : null}
        {activeTab === "citation" ? <FieldGuardImplementIssuePage /> : null}
        {activeTab === "reports" ? <FieldGuardReportsPage /> : null}
        {activeTab === "history" ? <FieldGuardHistoryPage /> : null}
      </main>
    </div>
  );
}