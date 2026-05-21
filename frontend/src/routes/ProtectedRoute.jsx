import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isTokenExpired, getToken } from "../utils/tokenUtils";

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    const token = getToken();

    if(!isAuthenticated || !token || isTokenExpired(token)) {
        return <Navigate to="/login" replace/>

    }

    return <Outlet />;
}
