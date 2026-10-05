import { NavLink } from "react-router-dom";
import { FilePlusCorner, Flag, History, LayoutDashboard } from "lucide-react";
import "../../styles/common/fieldGuard/FieldGuardHeader.css";
import Logout from "../common/Logout.tsx";
export default function FieldGuardHeader() {
  return (
    <header className="field-guard-header">
      <nav className="field-guard-nav" aria-label="Field Guard navigation">
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
      <Logout/>
    </header>
  );
}
