import { Outlet } from "react-router-dom";
import FieldGuardHeader from "../components/fieldGuard/FieldGuardHeader";
import "../styles/common/fieldGuard/FieldGuardLayout.css";
import "../styles/common/fieldGuard/FieldGuardIcons.css";

export default function FieldGuardLayout() {
  return (
    <div className="field-guard-layout">
      <FieldGuardHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
