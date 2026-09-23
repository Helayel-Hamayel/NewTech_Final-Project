import type { PortalTab } from "./types";
import { ClipboardList, FileText, Home, LayoutDashboard } from "lucide-react";

const tabs: PortalTab[] = ["Dashboard", "Billing", "My Services", "Properties"];

const tabIcons = {
  Dashboard: LayoutDashboard,
  Billing: FileText,
  "My Services": ClipboardList,
  Properties: Home,
} as const;

type ResidentPortalNavProps = {
  activeTab: PortalTab;
  onTabChange: (tab: PortalTab) => void;
};

export default function ResidentPortalNav({
  activeTab,
  onTabChange,
}: ResidentPortalNavProps) {
  return (
    <nav className="resident-nav" aria-label="Resident portal navigation">
      <ul className="resident-nav-list">
        <span
          className="resident-nav-indicator"
          aria-hidden="true"
          style={{ transform: `translateX(${tabs.indexOf(activeTab) * 100}%)` }}
        />
        {tabs.map((tab) => (
          <li key={tab}>
            <button
              className={`resident-nav-button${activeTab === tab ? " is-active" : ""}`}
              type="button"
              aria-current={activeTab === tab ? "page" : undefined}
              onClick={() => onTabChange(tab)}
            >
              {(() => {
                const Icon = tabIcons[tab];
                return (
                  <Icon className="resident-nav-icon" aria-hidden="true" />
                );
              })()}
              {tab}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}