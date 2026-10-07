import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  FilePlusCorner,
  Flag,
  History,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import "../../styles/common/fieldGuard/FieldGuardHeader.css";
import ThemeToggle from "../common/ThemeToggle";

export type FieldGuardTab = "dashboard" | "citation" | "reports" | "history";

type FieldGuardHeaderProps = {
  activeTab: FieldGuardTab;
  onTabChange: (tab: FieldGuardTab) => void;
};

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "citation", label: "Issue Citation", icon: FilePlusCorner },
  { id: "reports", label: "Reports", icon: Flag },
  { id: "history", label: "History", icon: History },
] satisfies Array<{ id: FieldGuardTab; label: string; icon: typeof LayoutDashboard }>;

export default function FieldGuardHeader({
  activeTab,
  onTabChange,
}: FieldGuardHeaderProps) {
  const navigate = useNavigate();
  const [isSignoutOpen, setIsSignoutOpen] = useState(false);

  return (
    <header className="field-guard-header">
      <div className="field-guard-header-main">
        <div className="field-guard-officer">
          <span className="field-guard-officer-icon" aria-hidden="true">
            <Activity size={20} />
          </span>
          <div>
            <strong>J. Mbeki</strong>
            <span>#G-114 · Zone 3 · Sep 7, 2026</span>
          </div>
          <span className="field-guard-shift">
            <span className="field-guard-pulse" aria-hidden="true" />
            SHIFT ACTIVE
          </span>
        </div>

        <div className="field-guard-header-actions">
          <ThemeToggle />
          <div className="field-guard-signout-wrap">
            <button
              className="field-guard-signout"
              type="button"
              onClick={() => setIsSignoutOpen((isOpen) => !isOpen)}
              aria-expanded={isSignoutOpen}
              aria-controls="field-guard-signout-popover"
            >
              <LogOut size={16} aria-hidden="true" />
              Sign Out
            </button>
            {isSignoutOpen ? (
              <div
                className="field-guard-signout-popover"
                id="field-guard-signout-popover"
                role="dialog"
                aria-labelledby="field-guard-signout-title"
              >
                <strong id="field-guard-signout-title">
                  Sign out of CivicHub?
                </strong>
                <span>Your current portal session will end.</span>
                <div className="field-guard-signout-actions">
                  <button
                    type="button"
                    onClick={() => navigate("/login", { replace: true })}
                  >
                    Sign Out
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
      </div>

      <nav className="field-guard-nav" aria-label="Field Guard navigation">
        {navigationItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={activeTab === id ? "active" : ""}
            type="button"
            aria-current={activeTab === id ? "page" : undefined}
            onClick={() => onTabChange(id)}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}
