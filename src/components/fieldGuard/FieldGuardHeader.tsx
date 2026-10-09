import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Activity, Building2, FilePlusCorner, Flag, History, LayoutDashboard, LogOut } from "lucide-react";
import "../../styles/common/fieldGuard/FieldGuardHeader.css";
import MobileDrawer from "../common/MobileDrawer";
import ThemeToggle from "../common/ThemeToggle";
import { useUser } from "../../contexts/useUser";

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

export default function FieldGuardHeader({ activeTab, onTabChange }: FieldGuardHeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useUser();
  const [isSignoutOpen, setIsSignoutOpen] = useState(false);

  async function confirmSignOut() {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch {
      toast.error("Could not sign out. Please try again.");
    }
  }

  return (
    <header className="field-guard-header">
      <section className="field-guard-mobile-brand">
        <span className="field-guard-mobile-brand-mark" aria-hidden="true">
          <Building2 size={20} strokeWidth={2.2} />
        </span>
        <section>
          <p>Tel Aviv-Yafo</p>
          <p>Municipality</p>
        </section>
      </section>
      <section className="field-guard-header-main">
        <section className="field-guard-officer">
          <span className="field-guard-officer-icon" aria-hidden="true">
            <Activity size={20} />
          </span>
          <section>
            <section className="field-guard-user-info">
              <strong>{user?.name ?? "Field Guard"}</strong>
              <span>{user?.email ?? ""}</span>
            </section>
          </section>
          <span className="field-guard-shift">
            <span className="field-guard-pulse" aria-hidden="true" />
            SHIFT ACTIVE
          </span>
        </section>

        <section className="field-guard-header-actions">
          <ThemeToggle />
          <section className="field-guard-signout-wrap">
            <button
              className="field-guard-signout"
              type="button"
              onClick={() => setIsSignoutOpen((isOpen) => !isOpen)}
              aria-expanded={isSignoutOpen}
              aria-controls="field-guard-signout-popover">
              <LogOut size={16} aria-hidden="true" />
              Sign Out
            </button>
            {isSignoutOpen ? (
              <section
                className="field-guard-signout-popover"
                id="field-guard-signout-popover"
                role="dialog"
                aria-labelledby="field-guard-signout-title">
                <strong id="field-guard-signout-title">Sign out of CivicHub?</strong>
                <span>Your current portal session will end.</span>
                <section className="field-guard-signout-actions">
                  <button type="button" onClick={confirmSignOut}>
                    Sign Out
                  </button>
                  <button type="button" onClick={() => setIsSignoutOpen(false)}>
                    Stay signed in
                  </button>
                </section>
              </section>
            ) : null}
          </section>
        </section>
      </section>
      <MobileDrawer
        brandIcon={<Activity />}
        userName={user?.name ?? "Field Guard"}
        subtitle={user?.email ?? "Field Guard"}
        items={navigationItems}
        activeId={activeTab}
        onSelect={onTabChange}
      />{" "}
      <nav className="field-guard-nav" id="field-guard-navigation" aria-label="Field Guard navigation">
        <section className="field-guard-nav-list">
          <span
            className="field-guard-nav-indicator"
            aria-hidden="true"
            style={{
              transform: `translateX(${navigationItems.findIndex(({ id }) => id === activeTab) * 100}%)`,
            }}
          />
          {navigationItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`field-guard-nav-button${activeTab === id ? " is-active" : ""}`}
              type="button"
              aria-current={activeTab === id ? "page" : undefined}
              onClick={() => onTabChange(id)}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </button>
          ))}
        </section>
      </nav>
    </header>
  );
}
