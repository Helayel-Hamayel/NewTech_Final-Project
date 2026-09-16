import { Link, NavLink } from "react-router-dom";
import "../../styles/common/fieldGuard/FieldGuardHeader.css";

export default function FieldGuardHeader() {
  return (
    <header className="field-guard-header">
      <nav className="field-guard-nav" aria-label="Field Guard navigation">
        <NavLink to="/field-guard" end>
          Dashboard
        </NavLink>
        <NavLink to="/field-guard/create-issue">Implement Issue</NavLink>
        <NavLink to="/field-guard/report">Reports</NavLink>
        <NavLink to="/field-guard/history">History</NavLink>
      </nav>
      <Link className="field-guard-sign-out" to="/login" replace>
        Sign out
      </Link>
    </header>
  );
}
