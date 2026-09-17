import { Outlet } from "react-router-dom";
import FieldGuardHeader from "../components/FieldGuard/FieldGuardHeader";

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
