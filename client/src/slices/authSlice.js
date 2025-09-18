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


export const OTPVerify = createAsyncThunk("auth/OTPVerify", async ({ email, otp }, { rejectWithValue }) => {
    try {
        const response = await AuthApi.sendOTPApi({ email, otp });
        console.log(response.data, "response from otp");
        return response.data
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "Failed to send OTP")
    }
})

export const loginForm = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
    try {
        const response = await AuthApi.loginApi({ email, password });
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

export const resendOTP = createAsyncThunk("auth/resendOtp", async ({ email }, { rejectWithValue }) => {
    try {
        const response = await AuthApi.resendOTPApi({ email });
        console.log(response.data, "from resend otp slice");
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.message || error?.message || "Failed to resend OTP")
    }
})

const token = localStorage.getItem("token");
const tokenData = isTokenValid(token);

const initialState = {
    loading: false,
    error: null,
    registeredEmail: null, // email of user who just registered
    otpVerified: false, // set to true after OTP verification
    user: null,
    token: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.registeredEmail = null;
            state.otpVerified = false;
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            // REGISTER
            .addCase(registerForm.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(registerForm.fulfilled, (state, action) => {
                state.loading = false;
                state.registeredEmail = action.payload?.user?.email || action.meta.arg.email;
                state.otpVerified = false;
                console.log(action.payload.user.email, "from auth slice ")
            })
            .addCase(registerForm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // OTP VERIFY
            .addCase(OTPVerify.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(OTPVerify.fulfilled, (state) => {
                state.loading = false;
                state.otpVerified = true;
                state.registeredEmail = null;
            })
            .addCase(OTPVerify.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // LOGIN
            .addCase(loginForm.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginForm.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(loginForm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // RESEND OTP
            .addCase(resendOTP.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(resendOTP.fulfilled, (state) => { state.loading = false; })
            .addCase(resendOTP.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;