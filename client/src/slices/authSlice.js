import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isTokenValid } from "../utils/tokenValidity";
import AuthApi from "../api/authApi";


export const registerForm = createAsyncThunk("auth/register", async(form, {rejectWithValue}) => {
    try {
        const response = await AuthApi.registerApi(form);
        console.log(response.data);
        return response.data;
    } catch (error) {
        return rejectWithValue( error?.response?.data?.message || error?.message || "Failed to submit the register form")
    }
})



const token = localStorage.getItem("token");
const tokenData = isTokenValid(token);

const initialState = {
    loading : false,
    error : null,
    user : tokenData.user,
    email : tokenData.email,
    isValid : tokenData.valid || false,
    otpVerified : false
}

const authSlice = createSlice({
    name : "auth",
    initialState,
    extraReducers : (builder) => {
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
    }
})


export default authSlice.reducer;