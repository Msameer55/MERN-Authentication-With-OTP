
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Register from "./pages/Register"
import { Toaster, toast } from 'sonner';
import OtpPage from "./pages/OtpPage";
import Login from "./pages/Login";

const App = () => {
  return (
      <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* redirect */}
        <Route path="/" element={<Navigate to="/register" />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/otp" element={<OtpPage />}/>
        <Route path="/login" element={<Login />}/>
      </Routes>
      </BrowserRouter>
  )
}

export default App