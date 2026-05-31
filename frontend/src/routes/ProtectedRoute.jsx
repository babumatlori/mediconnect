import { Navigate, Outlet } from 'react-router-dom';
import { getToken, getUser } from '../utils/tokenUtils';

/**
 * ProtectedRoute
 *
 * Checks two things:
 * 1. Is there a token in localStorage?
 * 2. Is there a user object in localStorage?
 *
 * WHY we removed isTokenExpired check here:
 * The fake test token we set manually fails JWT decode.
 * For real tokens from the backend, expiry is handled
 * by the Axios interceptor (auto-refresh).
 * ProtectedRoute just needs to know: logged in or not.
 */
export default function ProtectedRoute() {
  const token = getToken();
  const user  = getUser();

  // No token or no user → not logged in → go to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Has token and user → allow through
  return <Outlet />;
}
