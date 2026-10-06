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
    <aside className="sidebar" aria-label="Staff sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">
          <Map size={28} />
        </span>
        <div>
          <p className="brand-title">Municipal Operations</p>
          <p className="city">City of Millbrook</p>
        </div>
      </div>

      <div className="profile">
        <span className="avatar" aria-hidden="true">
          {initials}
        </span>
        <span className="name">{staffData.name}</span>
      </div>
      <p className="dispatch">
        <span className="status-dot" aria-hidden="true" />
        Dispatch #{staffData.workName}
      </p>

      <nav className="nav" aria-label="Staff navigation">
        <NavLink to="/staff" end>
          <FileCheck2 size={22} aria-hidden="true" />
          Citation Disputes
        </NavLink>
      </nav>
      <Link className="sign-out" to="/login" replace>
        <LogOut size={20} aria-hidden="true" />
        Sign out
      </Link>
    </aside>
  );
}
