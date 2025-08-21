import axiosInstance from "../config/axios";

const AuthApi = {
    sendOtp : (email) => axiosInstance.post("/api/auth/v1/send-verify-otp", email);
}


export default AuthApi;