import { Outlet } from "react-router-dom";
import StaffHeader from "../components/Staff/StaffHeader";
import "../styles/common/Staff/StaffLayout.css";

export default function StaffLayout() {
  return (
    <div className="staff-shell">
      <StaffHeader />
      <main className="staff-content">
        <Outlet />
      </main>
    </div>
  );
}
