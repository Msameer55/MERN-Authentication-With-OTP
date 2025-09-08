import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { isTokenValid } from "../utils/tokenValidity";

const ProtectedRoute = ({ isAuthRequired, isAuthPage, isOtpPage, children }) => {
    const { token } = useSelector(state => state.auth);
    const location = useLocation();
    const tokenData = isTokenValid(token);

    // Dashboard requires login and verified account
    if (isAuthRequired && (!token || !tokenData.valid || !tokenData.isVerified)) {
        return <Navigate to="/login" replace />;
    }

    // Login/Register pages: redirect if already logged in & verified
    if (isAuthPage && tokenData.valid && tokenData.isVerified) {
        return <Navigate to="/dashboard" replace />;
    }
    
    // OTP page: allow if email exists in state or localStorage
    if (isOtpPage) {
        const email = location.state?.email || localStorage.getItem("pendingOtpEmail");
        if (!email) {
            return <Navigate to="/login" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
