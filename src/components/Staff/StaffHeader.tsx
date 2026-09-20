import { Link, NavLink } from "react-router-dom";
import { FileCheck2, LogOut, Map } from "lucide-react";
import { staffData } from "../../data/staffData";
import "../../styles/common/Staff/StaffHeader.css";

export default function StaffHeader() {
  const initials = staffData.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <aside className="staff-header" aria-label="Staff sidebar">
      <div className="staff-brand">
        <span className="staff-brand-icon" aria-hidden="true">
          <Map size={28} />
        </span>
        <div>
          <p className="staff-brand-title">Municipal Operations</p>
          <p className="staff-city">City of Millbrook</p>
        </div>
      </div>

      <div className="staff-profile">
        <span className="staff-avatar" aria-hidden="true">{initials}</span>
        <span className="staff-name">{staffData.name}</span>
      </div>
      <p className="staff-dispatch">
        <span className="staff-status-dot" aria-hidden="true" />
        Dispatch #{staffData.workName}
      </p>

      <nav className="staff-nav" aria-label="Staff navigation">
        <NavLink to="/staff" end>
          <FileCheck2 size={22} aria-hidden="true" />
          Citation Disputes
        </NavLink>
      </nav>
      <Link className="staff-sign-out" to="/login" replace>
        <LogOut size={20} aria-hidden="true" />
        Sign out
      </Link>
    </aside>
  );
}
