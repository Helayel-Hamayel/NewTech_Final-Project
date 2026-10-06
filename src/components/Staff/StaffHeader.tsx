import { Link } from "react-router-dom";
import { FileCheck2, LogOut, Map, ReceiptText, Wrench } from "lucide-react";
import { staffData } from "../../data/staffData";
import type { StaffTab } from "../../data/staffData";
import "../../styles/common/Staff/StaffHeader.css";

type StaffHeaderProps = {
  activeTab: StaffTab;
  onTabChange: (tab: StaffTab) => void;
  unreadTabs: Record<StaffTab, boolean>;
  pendingDisputes: number;
  overdueAccounts: number;
  openTickets: number;
};

const navigationItems = [
  { id: "disputes", label: "Citation Disputes", icon: FileCheck2 },
  { id: "billing", label: "Billing Ledger", icon: ReceiptText },
  { id: "maintenance", label: "Maintenance Dispatch", icon: Wrench },
] satisfies Array<{ id: StaffTab; label: string; icon: typeof FileCheck2 }>;

export default function StaffHeader({
  activeTab,
  onTabChange,
  unreadTabs,
  pendingDisputes,
  overdueAccounts,
  openTickets,
}: StaffHeaderProps) {
  const initials = staffData.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <aside className="sidebar" aria-label="Staff sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <Map size={28} />
        </span>
        <div>
          <p className="brand-title">Municipal Operations</p>
          <p className="city">City of Millbrook</p>
        </div>
      </div>

      <div className="profile">
        <span className="avatar" aria-hidden="true">
          {initials}
        </span>
        <span className="name">{staffData.name}</span>
      </div>
      <p className="dispatch">
        <span className="status-dot" aria-hidden="true" />
        Dispatch #{staffData.workName}
      </p>

      <nav className="nav" aria-label="Staff navigation">
        <span
          className="nav-indicator"
          aria-hidden="true"
          style={{
            transform: `translateY(${navigationItems.findIndex(
              ({ id }) => id === activeTab,
            ) * 48}px)`,
          }}
        />
        {navigationItems.map(({ id, label, icon: Icon }) => {
          const badgeCount =
            id === "disputes"
              ? pendingDisputes
              : id === "billing"
                ? overdueAccounts
                : openTickets;
          return (
            <button
              key={id}
              className={activeTab === id ? "active" : ""}
              type="button"
              aria-current={activeTab === id ? "page" : undefined}
              onClick={() => onTabChange(id)}
            >
              <Icon size={20} aria-hidden="true" />
              <span className="nav-label">{label}</span>
              {badgeCount > 0 ? (
                <span
                  className={`nav-badge${unreadTabs[id] ? " nav-badge--unread" : ""}${activeTab === id ? " nav-badge--active" : ""}`}
                >
                  {badgeCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
      <Link className="sign-out" to="/login" replace>
        <LogOut size={20} aria-hidden="true" />
        Sign out
      </Link>
      <p className="version">Municipal Operations v2.4.1</p>
    </aside>
  );
}
