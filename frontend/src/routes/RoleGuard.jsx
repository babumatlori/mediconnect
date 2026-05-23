import { Navigate, Outlet } from 'react-router-dom';
import { getUser } from '../utils/tokenUtils';

/**
 * RoleGuard
 *
 * WHY read from localStorage directly instead of useAuth():
 * When user sets localStorage in console and refreshes,
 * AuthContext re-initializes from localStorage correctly.
 * But during the same session, context state may lag.
 * Reading directly from localStorage is always accurate.
 */
export default function RoleGuard({ allowedRole }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
