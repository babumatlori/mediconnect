import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RoleGuard({ allowedROle }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if(user.role !== allowedROle) {
        return <Navigate to="/unauthorized" replace/>
    }

    return <Outlet />;
}
