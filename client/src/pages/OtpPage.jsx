import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { OTPVerify, resendOTP } from "../slices/authSlice";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const OtpPage = () => {
    const {otpVerified} = useSelector((state) => state.auth);
    console.log(otpVerified,' from otp page ')
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    // Grab email either from state or localStorage
    const email = location.state?.email || localStorage.getItem("pendingOtpEmail");

    useEffect(() => {
        if (!email) {
            navigate("/login", { replace: true });
        } else {
            // store email in localStorage for page refresh case
            localStorage.setItem("pendingOtpEmail", email);
        }
    }, [email, navigate]);


    useEffect(() => {
        if (otpVerified) {
            navigate("/login", { replace: true });
        }
    }, [otpVerified, navigate]);

    const safeError = (err) => {
        // If it's a string from rejectWithValue
        if (typeof err === "string") return err;

        // If it's an Axios error with response message
        if (err?.response?.data?.message) return err.response.data.message;

        // If it's a normal Error object
        if (err?.message) return err.message;

        return "Something went wrong";
    };

    const handleOTPCheck = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await dispatch(OTPVerify({ email, otp })).unwrap();
            toast.success(data.message);
            localStorage.removeItem("pendingOtpEmail");
            navigate("/login");
        } catch (err) {
            toast.error(safeError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (cooldown > 0) return;

        setResendLoading(true);
        try {
            const data = await dispatch(resendOTP({ email })).unwrap();
            toast.success(data.message);
            setCooldown(30);
        } catch (err) {
            toast.error(err?.message || err?.response?.data?.message || err?.response?.message || "Something went wrong");
        } finally {
            setResendLoading(false);
        }
    };

    if (!email) return null; // will redirect in useEffect

    return (
        <div className="email-page min-h-screen flex justify-center items-center bg-gradient-to-r from-[#0095D8] to-[#0259AB] p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="inner p-8">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Enter OTP</h3>
                    <form className="space-y-5" onSubmit={handleOTPCheck}>
                        <div>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0259AB] focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className={`${loading
                                    ? " bg-gray-400 text-white cursor-not-allowed"
                                    : "bg-[#0259AB] text-white hover:bg-[#0978e0] cursor-pointer"
                                    } mt-4 w-full py-3 font-semibold rounded-xl transition-colors duration-300`}
                            >
                                {loading ? "Verifying..." : "Submit"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            Didn’t get the OTP?{" "}
                            <button
                                onClick={handleResendOtp}
                                disabled={resendLoading || cooldown > 0}
                                className="cursor-pointer text-blue-600 underline disabled:text-gray-400"
                            >
                                {cooldown > 0
                                    ? `Resend OTP in ${cooldown}s`
                                    : resendLoading
                                        ? "Resending..."
                                        : "Resend OTP"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpPage;
