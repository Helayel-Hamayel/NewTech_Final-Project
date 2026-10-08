import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useUser } from "../../contexts/useUser";
import "../../styles/common/MobileDrawer.css";

export type MobileDrawerItem<Id extends string> = {
  id: Id;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

type MobileDrawerProps<Id extends string> = {
  brandIcon: ReactNode;
  userName: string;
  subtitle: string;
  items: Array<MobileDrawerItem<Id>>;
  activeId: Id;
  onSelect: (id: Id) => void;
};

export default function MobileDrawer<Id extends string>({
  brandIcon,
  userName,
  subtitle,
  items,
  activeId,
  onSelect,
}: MobileDrawerProps<Id>) {
  const navigate = useNavigate();
  const { signOut } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmingSignOut, setIsConfirmingSignOut] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    setIsConfirmingSignOut(false);
  }

  async function confirmSignOut() {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch {
      toast.error("Could not sign out. Please try again.");
    }
  }

  return (
    <>
      <button
        className="mobile-drawer-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-drawer"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
      >
        {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      {isOpen ? (
        <button
          className="mobile-drawer-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={close}
        />
      ) : null}
      <aside
        className={`mobile-drawer${isOpen ? " is-open" : ""}`}
        id="mobile-drawer"
        aria-label="Navigation menu"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="mobile-drawer-header">
          <span className="mobile-drawer-brand-mark" aria-hidden="true">
            {brandIcon}
          </span>
          <div className="mobile-drawer-brand-copy">
            <strong>{userName}</strong>
            <span>{subtitle}</span>
          </div>
        </div>

        <nav className="mobile-drawer-nav">
          {items.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              className={`mobile-drawer-item${activeId === id ? " is-active" : ""}`}
              type="button"
              aria-current={activeId === id ? "page" : undefined}
              onClick={() => {
                onSelect(id);
                close();
              }}
            >
              <Icon aria-hidden="true" />
              <span className="mobile-drawer-item-label">{label}</span>
              {badge ? <span className="mobile-drawer-badge">{badge}</span> : null}
            </button>
          ))}
        </nav>

        <div className="mobile-drawer-footer">
          <ThemeToggle />
          {isConfirmingSignOut ? (
            <div className="mobile-drawer-confirm" role="dialog" aria-label="Confirm sign out">
              <strong>Sign out of CivicHub?</strong>
              <div>
                <button type="button" className="is-danger" onClick={confirmSignOut}>
                  Sign out
                </button>
                <button type="button" onClick={() => setIsConfirmingSignOut(false)}>
                  Stay signed in
                </button>
              </div>
            </div>
          ) : (
            <button
              className="mobile-drawer-signout"
              type="button"
              onClick={() => setIsConfirmingSignOut(true)}
            >
              <LogOut aria-hidden="true" />
              Sign out
            </button>
          )}
          <p className="mobile-drawer-version">CivicHub v2.4.1</p>
        </div>
      </aside>
    </>
  );
}
