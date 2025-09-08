import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isTokenValid } from "../utils/tokenValidity";
import AuthApi from "../api/authApi";


export const registerForm = createAsyncThunk("auth/register", async (form, { rejectWithValue }) => {
    try {
        const response = await AuthApi.registerApi(form);
        console.log(response.data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || error?.message || "Failed to submit the register form")
    }
})


export const OTPVerify = createAsyncThunk("auth/OTPVerify", async (data, { rejectWithValue }) => {
    try {
        const response = await AuthApi.sendOTPApi(data);
        console.log(response.data, "response from otp");
        return response.data
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "Failed to send OTP")
    }
})

export const loginForm = createAsyncThunk("auth/login", async (form, { rejectWithValue }) => {
    try {
        const response = await AuthApi.loginApi(form);
        console.log(response.data, "from login");
        return response.data;
    } catch (error) {
        console.log(error)
        // console.log(error?.response)  undefined
        // console.log(error?.response?.data)    undefined
        // console.log(error?.response?.data?.message)   undefined
        return rejectWithValue(error?.response?.data?.message || error || "Failed to Login")
    }
})

const token = localStorage.getItem("token");
const tokenData = isTokenValid(token);

const initialState = {
    loading: false,
    error: null,
    user: tokenData.user,
    email: tokenData.email,
    isValid: tokenData.valid || false,
    otpVerified: tokenData.otpVerified
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(registerForm.pending, (state) => {
                state.loading = true
            })
            .addCase(registerForm.fulfilled, (state, action) => {
                state.loading = false,
                    state.user = action.payload.user
                state.email = action.payload.user.email;
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(registerForm.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload;
            })
            // otp 
            .addCase(OTPVerify.pending, (state) => {
                state.loading = true
            })
            .addCase(OTPVerify.fulfilled, (state, action) => {
                state.loading = false,
                    state.otpVerified = true
            })
            .addCase(OTPVerify.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(loginForm.pending, (state) => {
                state.loading = true
            })
            .addCase(loginForm.fulfilled, (state, action) => {
                state.loading = false,
                    state.user = action.payload.user,
                    state.isValid = true,
                    localStorage.setItem("token", action.payload.token)
            })
            .addCase(loginForm.rejected, (state, action) => {
                state.error = action.payload
            })
    }
})


export default authSlice.reducer;