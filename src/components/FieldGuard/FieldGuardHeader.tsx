import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FilePlusCorner, Flag, History, LayoutDashboard, LogOut } from "lucide-react";
import civicHubLogo from "../../assets/logo/CivicHub_Logo.png";
import "../../styles/common/fieldGuard/FieldGuardHeader.css";
import MobileDrawer from "../common/MobileDrawer";
import ThemeToggle from "../common/ThemeToggle";
import { useUser } from "../../contexts/useUser";
import NotificationBell from "../common/NotificationBell";

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
  const userName = user?.name?.trim() || "Field Guard";
  const userInitials = userName
    .split(/\s+/)
    .slice(0, 2)
    .map((namePart) => namePart[0])
    .join("")
    .toUpperCase();

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
        <img className="field-guard-mobile-brand-mark" src={civicHubLogo} alt="" aria-hidden="true" />
        <section className="field-guard-mobile-brand-content">
          <section className="field-guard-mobile-brand-copy">
            <p>CivicHub</p>
            <p>Tel Aviv-Yafo Municipality</p>
          </section>
          <section className="field-guard-user-profile" aria-label="Signed-in field guard">
            <span className="field-guard-user-avatar" aria-hidden="true">
              {userInitials}
            </span>
            <span className="field-guard-user-info">
              <strong>{userName}</strong>
              <span>{user?.email ?? ""}</span>
            </span>
          </section>
        </section>
      </section>
      <section className="field-guard-header-main">
        <section className="field-guard-brand-block">
          <section className="field-guard-brand" aria-label="CivicHub">
            <img className="field-guard-mobile-brand-mark" src={civicHubLogo} alt="" aria-hidden="true" />
            <span className="field-guard-brand-copy">
              <strong>CivicHub</strong>
              <span>Tel Aviv-Yafo Municipality</span>
            </span>
          </section>
          <section className="field-guard-user-profile" aria-label="Signed-in field guard">
            <span className="field-guard-user-avatar" aria-hidden="true">
              {userInitials}
            </span>
            <span className="field-guard-user-info">
              <strong>{userName}</strong>
              <span>{user?.email ?? ""}</span>
            </span>
          </section>
        </section>
        <section className="field-guard-officer">
          <span className="field-guard-shift">
            <span className="field-guard-pulse" aria-hidden="true" />
            SHIFT ACTIVE
          </span>
        </section>

        <section className="field-guard-header-actions">
          <NotificationBell />
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
        userName={userName}
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
