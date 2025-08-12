import express from "express"
import { login, register, resendOtp, resetPassword, sendVerifyOTP, verifyEmail } from "../controller/authController.js";
import { verifyToken } from "../middleware/protectedRoute.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/send-verify-otp", verifyToken, sendVerifyOTP);
authRoutes.post("/verify-otp", verifyToken, verifyEmail);
authRoutes.post("/send-reset-otp", resendOtp);
authRoutes.post("/reset-password", resetPassword);

export default authRoutes;