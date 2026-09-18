import { Link, NavLink } from "react-router-dom";
import { FilePlusCorner, Flag, History, LayoutDashboard } from "lucide-react";
export default function FieldGuardHeader() {
  return (
    <header>
      <nav aria-label="Field Guard navigation">
        <NavLink to="/field-guard" end>
          <LayoutDashboard />
          Dashboard
        </NavLink>
        <NavLink to="/field-guard/create-issue">
          <FilePlusCorner />
          Implement Issue
        </NavLink>
        <NavLink to="/field-guard/report">
          <Flag />
          Reports
        </NavLink>
        <NavLink to="/field-guard/history">
          <History />
          History
        </NavLink>
      </nav>
      <Link to="/login" replace>
        Sign out
      </Link>
    </header>
  );
}
