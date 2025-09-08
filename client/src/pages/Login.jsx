import React, { useState } from "react";
import { loginForm, registerForm } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router";

const Login = () => {

    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await dispatch(loginForm(form)).unwrap();
            toast.success(data.message);
            navigate("/dashboard"); // only verified users reach dashboard
        } catch (error) {
            if (error === "Account not verified. Please verify OTP first.") {
                navigate("/otp", { state: { email: form.email } });
            }
            toast.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (

        <div className="login-container min-h-screen flex justify-center items-center bg-gradient-to-r from-[#0095D8]  to-[#0259AB] p-6">
            {
                loading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0, 0, 0, 0.8)] opacity-80 z-50">
                        <ClipLoader color="#ffffff" size={25} />
                    </div>
                )
            }
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="inner p-8">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Login to your Account
                    </h3>

                    <form className="space-y-5" onSubmit={handleSubmit}>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0259AB] focus:outline-none"
                                value={form.email}
                                name="email"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0259AB] focus:outline-none"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`${loading ? " bg-gray-400 text-white cursor-not-allowed" : "bg-[#0259AB] text-white  hover:bg-[#0978e0] cursor-pointer"}  w-full py-3 font-semibold rounded-xl transition-colors duration-300`}
                        >
                            Login
                        </button>
                    </form>

                    <p className="text-sm text-center text-gray-500 mt-6">
                        Dont have an account?{" "}
                        <a href="/register" className="text-[#0259AB] font-medium hover:underline">
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
