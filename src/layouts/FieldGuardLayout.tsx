import { useState } from "react";
import FieldGuardHistoryPage from "../components/FieldGuard/FieldGuardHistoryPage";
import FieldGuardImplementIssuePage from "../components/FieldGuard/FieldGuardImplementIssuePage";
import FieldGuardReportsPage from "../components/FieldGuard/FieldGuardReportsPage";
import FieldGuardHeader, {
  type FieldGuardTab,
} from "../components/FieldGuard/FieldGuardHeader";
import FieldGuardPage from "../pages/FieldGuardPage";
import { fieldGuardData, type FieldGuardIssue } from "../data/fieldGuardData";
import "../styles/common/fieldGuard/FieldGuardLayout.css";

export default function FieldGuardLayout() {
  const [activeTab, setActiveTab] = useState<FieldGuardTab>("dashboard");
  const [issuedCitations, setIssuedCitations] = useState<FieldGuardIssue[]>([]);
  const issues = [...fieldGuardData.issues, ...issuedCitations];

  return (
    <section className="field-guard-layout">
      <FieldGuardHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="field-guard-main">
        {activeTab === "dashboard" ? <FieldGuardPage issues={issues} /> : null}
        {activeTab === "citation" ? (
          <FieldGuardImplementIssuePage
            onIssueIssued={(issue) =>
              setIssuedCitations((current) => [
                ...current,
                {
                  ...issue,
                  _id: `demo-citation-${fieldGuardData.issues.length + current.length + 1}`,
                },
              ])
            }
          />
        ) : null}
        {activeTab === "reports" ? <FieldGuardReportsPage /> : null}
        {activeTab === "history" ? <FieldGuardHistoryPage issues={issues} /> : null}
      </main>
    </section>
  );
}