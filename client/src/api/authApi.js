import axiosInstance from "../config/axios";

const AuthApi = {
    registerApi: ({ name, email, password }) => axiosInstance.post("/api/auth/v1/register", { name, email, password }),
    sendOTPApi: ({ email, otp }) => axiosInstance.post("/api/auth/v1/verify-otp", { email, otp }),
    loginApi: ({ email, password }) => axiosInstance.post("/api/auth/v1/login", { email, password }),
    resendOTPApi: ({ email }) => axiosInstance.post("/api/auth/v1/send-reset-otp", { email }),
}


export default AuthApi;