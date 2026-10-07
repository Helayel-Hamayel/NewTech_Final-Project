import { NavLink } from "react-router-dom";
import { FilePlusCorner, Flag, History, LayoutDashboard } from "lucide-react";
import "../../styles/common/fieldGuard/FieldGuardHeader.css";
import Logout from "../common/Logout.tsx";
import { useUser } from "../../contexts/UserContext.tsx";
export default function FieldGuardHeader() {
  const { user } = useUser();

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
        <p>{user?.name}</p>
        <p>{user?.email}</p>
      </nav>
      <Logout />
    </header>
  );
}
