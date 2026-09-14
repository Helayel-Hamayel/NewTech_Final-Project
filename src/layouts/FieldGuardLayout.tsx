import { Outlet } from "react-router-dom";
import FieldGuardHeader from "../components/fieldGuard/fieldGuardHeader";

export default function FieldGuardLayout() {
  return (
    <>
      <FieldGuardHeader />
      <main>
        <Outlet />
      </main>
    </>
  );
}
