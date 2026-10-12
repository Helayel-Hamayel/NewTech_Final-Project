import { Bell } from "lucide-react";
import type { StaffTab } from "../../data/staffData";

const tabTitles: Record<StaffTab, string> = {
  requests: "Resident Requests",
  disputes: "Citation Disputes",
  billing: "Billing Ledger",
  maintenance: "Maintenance Dispatch",
};

type StaffTopBarProps = {
  activeTab: StaffTab;
  pendingDisputes: number;
  hasUnseenNotifications: boolean;
  onOpenDisputes: () => void;
};

export default function StaffTopBar({ activeTab, pendingDisputes, hasUnseenNotifications, onOpenDisputes }: StaffTopBarProps) {
  return (
    <header className="staff-topbar">
      <h1>{tabTitles[activeTab]}</h1>
      <section className="staff-topbar-tools">
        <button
          className="staff-notifications"
          type="button"
          aria-label={`${pendingDisputes} pending disputes. Open citation disputes.`}
          onClick={onOpenDisputes}>
          <Bell size={19} aria-hidden="true" />
          {pendingDisputes > 0 ? (
            <span className={`notification-count${hasUnseenNotifications ? " notification-count--unread" : " notification-count--viewed"}`}>
              {pendingDisputes}
            </span>
          ) : null}
        </button>
      </section>
    </header>
  );
}
