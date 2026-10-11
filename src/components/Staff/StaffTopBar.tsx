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
  return (
    <header className="staff-topbar">
      <h1>{tabTitles[activeTab]}</h1>
      <section className="staff-topbar-tools">
        <label className={`staff-search ${activeTab !== "billing" ? "staff-search--disabled" : ""}`}>
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={activeTab === "billing" ? search : ""}
            onChange={(event) => onSearchChange(event.target.value)}
            disabled={activeTab !== "billing"}
            placeholder={activeTab === "billing" ? "Search name, email, or license plate..." : "Search available in Billing Ledger"}
            aria-label="Search billing ledger"
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
