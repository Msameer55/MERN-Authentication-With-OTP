import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, isAuthRequired, isAuthPage }) => {
  const { isValid, otpVerified } = useSelector((state) => state.auth);
  const location = useLocation();

  // Case 1: Protected pages (dashboard, otp, etc.)
  if (isAuthRequired && !isValid) {
    return <Navigate to="/404" replace />;
  }

  // Case 2: Auth pages (login/register) → block if already logged in
  if (isAuthPage && isValid) {
    return <Navigate to="/dashboard" replace />;
  }

  // Case 3: OTP page → only allow if logged in but not verified
  if (location.pathname === "/otp") {
    if (!isValid) return <Navigate to="/404" replace />;
    if (otpVerified) return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
