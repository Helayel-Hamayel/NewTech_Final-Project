import type { StaffTab } from "../../data/staffData";
import NotificationBell from "../common/NotificationBell";

const tabTitles: Record<StaffTab, string> = {
  requests: "Resident Requests",
  disputes: "Citation Disputes",
  billing: "Billing Ledger",
  maintenance: "Maintenance Dispatch",
};

type StaffTopBarProps = {
  activeTab: StaffTab;
};

export default function StaffTopBar({ activeTab }: StaffTopBarProps) {
  return (
    <header className="staff-topbar">
      <h1>{tabTitles[activeTab]}</h1>

      <section className="staff-topbar-tools">
        <NotificationBell />
      </section>
    </header>
  );
}
