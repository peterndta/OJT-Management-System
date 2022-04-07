import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";


const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();

    const location = useLocation();
    // console.log(auth.refreshToken);
    console.log("roles auth:", auth.roles);
    // console.log("account auth:", JSON.stringify(auth.account.id));
    return (
        allowedRoles?.includes(auth?.roles)
            // auth?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />

    );
}

export default RequireAuth;