import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../contexts/useUser";
import type { User } from "../../contexts/userContextValue";

type ProtectedRouteProps = {
  allowedRole: User["role"];
};

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    const homeByRole = {
      RESIDENT: "/resident",
      FIELD_GUARD: "/field-guard",
      STAFF: "/staff",
    };

    return <Navigate to={homeByRole[user.role]} replace />;
  }

  return <Outlet />;
}
