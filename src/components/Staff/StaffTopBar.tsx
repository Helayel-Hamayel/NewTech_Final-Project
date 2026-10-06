import { Bell, Search } from "lucide-react";
import { staffData } from "../../data/staffData";
import type { StaffTab } from "../../data/staffData";

const tabTitles: Record<StaffTab, string> = {
  disputes: "Citation Disputes",
  billing: "Billing Ledger",
  maintenance: "Maintenance Dispatch",
};

type StaffTopBarProps = {
  activeTab: StaffTab;
  pendingDisputes: number;
  hasUnseenNotifications: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onOpenDisputes: () => void;
};

export default function StaffTopBar({
  activeTab,
  pendingDisputes,
  hasUnseenNotifications,
  search,
  onSearchChange,
  onOpenDisputes,
}: StaffTopBarProps) {
  const initials = staffData.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <header className="staff-topbar">
      <h1>{tabTitles[activeTab]}</h1>
      <div className="staff-topbar-tools">
        <label className="staff-search">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search residents, properties, tickets…"
            aria-label="Search current staff view"
          />
        </label>
        <button
          className="staff-notifications"
          type="button"
          aria-label={`${pendingDisputes} pending disputes. Open citation disputes.`}
          onClick={onOpenDisputes}
        >
          <Bell size={19} aria-hidden="true" />
          {pendingDisputes > 0 ? (
            <span
              className={`notification-count${hasUnseenNotifications ? " notification-count--unread" : " notification-count--viewed"}`}
            >
              {pendingDisputes}
            </span>
          ) : null}
        </button>
        <span className="staff-user-avatar" aria-label={staffData.name}>
          {initials}
        </span>
      </div>
    </header>
  );
}
