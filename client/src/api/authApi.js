import axiosInstance from "../config/axios";

const AuthApi = {
    registerApi : ({name, email, password}) => axiosInstance.post("/api/auth/v1/register", {name, email, password})
}


export default AuthApi;