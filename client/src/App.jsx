
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Register from "./pages/Register"
import { Toaster, toast } from 'sonner';
import OtpPage from "./pages/OtpPage";
import Login from "./pages/Login";
import AccessRestrictPage from "./pages/AccessRestrictPage";
import ProtectedRoute from "./pages/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const token = localStorage.getItem("token");
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* redirect */}
        <Route path="/" element={<Navigate to="/register" />} />
        <Route
          path="/register"
          element={
            <ProtectedRoute isAuthPage={true}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/otp"
          element={
            <ProtectedRoute isOtpPage={true}>
              <OtpPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute isAuthPage={true}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthRequired={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        <Route path="/404" element={<AccessRestrictPage />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App