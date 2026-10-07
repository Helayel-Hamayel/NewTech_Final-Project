import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FileCheck2, LogOut, Map, ReceiptText, Wrench } from "lucide-react";
import { staffData } from "../../data/staffData";
import type { StaffTab } from "../../data/staffData";
import ThemeToggle from "../common/ThemeToggle";
import "../../styles/common/Staff/StaffHeader.css";
import { useUser } from "../../contexts/useUser";

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
  const navigate = useNavigate();
  const { signOut } = useUser();
  const [isSignoutOpen, setIsSignoutOpen] = useState(false);
  const initials = staffData.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  async function confirmSignOut() {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch {
      toast.error("Could not sign out. Please try again.");
    }
  }

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

      <div className="nav-container">
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
                <span className="nav-item-content">
                  <Icon size={20} aria-hidden="true" />
                  <span className="nav-label">{label}</span>
                </span>
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
      </div>
      <div className="sidebar-footer">
        <ThemeToggle />
        <div className="staff-signout-wrap">
          <button
            className="sign-out"
            type="button"
            onClick={() => setIsSignoutOpen((isOpen) => !isOpen)}
            aria-expanded={isSignoutOpen}
            aria-controls="staff-signout-popover"
          >
            <LogOut size={20} aria-hidden="true" />
            Sign out
          </button>
          {isSignoutOpen ? (
            <div
              className="staff-signout-popover"
              id="staff-signout-popover"
              role="dialog"
              aria-labelledby="staff-signout-title"
            >
              <strong id="staff-signout-title">
                Sign out of CivicHub?
              </strong>
              <span>Your current portal session will end.</span>
              <div className="staff-signout-actions">
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
      <p className="version">Municipal Operations v2.4.1</p>
    </aside>
  );
}
