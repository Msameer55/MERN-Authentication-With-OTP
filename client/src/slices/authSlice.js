import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isTokenValid } from "../utils/tokenValidity";




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
    reducers,
    extraReducers : (builder) => {
        builder
        .addCase()
    }
})


export default authSlice.reducer;