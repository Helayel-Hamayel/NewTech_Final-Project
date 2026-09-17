import { Outlet } from "react-router-dom";
import SharedLayout from "../components/common/SharedLayout";
import FieldGuardHeader from "../components/FieldGuard/FieldGuardHeader";

export default function FieldGuardLayout() {
  return (
    <SharedLayout header={<FieldGuardHeader />} footer={null}>
      <Outlet />
    </SharedLayout>
  );
}
