import { Bell, Search } from "lucide-react";
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
  const searchEnabled = activeTab === "billing" || activeTab === "disputes";
  const searchPlaceholder =
    activeTab === "billing"
      ? "Search name, email, or license plate..."
      : activeTab === "disputes"
        ? "Search name, email, plate, or appeal reason..."
        : "Search available in Billing Ledger and Citation Disputes";
  const searchLabel =
    activeTab === "billing"
      ? "Search billing ledger"
      : activeTab === "disputes"
        ? "Search citation disputes"
        : "Search unavailable";

  return (
    <header className="staff-topbar">
      <h1>{tabTitles[activeTab]}</h1>
      <section className="staff-topbar-tools">
        <label className={`staff-search ${searchEnabled ? "" : "staff-search--disabled"}`}>
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={searchEnabled ? search : ""}
            onChange={(event) => onSearchChange(event.target.value)}
            disabled={!searchEnabled}
            placeholder={searchPlaceholder}
            aria-label={searchLabel}
          />
        </label>
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
