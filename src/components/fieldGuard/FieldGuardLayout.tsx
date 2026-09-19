import { Outlet } from "react-router-dom";
import SharedLayout from "../common/SharedLayout";
import FieldGuardHeader from "./FieldGuardHeader";

export default function FieldGuardLayout() {
  return (
    <SharedLayout header={<FieldGuardHeader />} footer={null}>
      <Outlet />
    </SharedLayout>
  );
}
