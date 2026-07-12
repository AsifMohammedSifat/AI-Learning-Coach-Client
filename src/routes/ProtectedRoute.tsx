import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import {
  selectIsAuthenticated,
  selectUserRole,
} from "../redux/api/features/auth/authSlice";
import type { TJwtPayload } from "../type";

/**
 * Guards a route subtree.
 * - `allowedRoles` (optional): array of roles permitted, e.g. ["admin"].
 *   If omitted, any authenticated user may enter.
 */
export default function ProtectedRoute({
  allowedRoles,
}: {
  allowedRoles?: TJwtPayload["role"][];
}) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectUserRole);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role!)) { // role undefined hobe na
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
