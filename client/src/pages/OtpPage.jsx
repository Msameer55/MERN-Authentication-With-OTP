import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { OTPVerify } from "../slices/authSlice";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const OtpPage = () => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    const email = location.state?.email;  
    const navigate = useNavigate();

    
    const handleOTPCheck = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!otp) {
                toast.error("Please enter otp")
                return;
            }
            const data = await dispatch(OTPVerify({ email, otp })).unwrap();
            toast.success(data.message);
            setOtp("");
            navigate("/login")
        } catch (error) {
            toast.error(error)
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="email-page min-h-screen flex justify-center items-center bg-gradient-to-r from-[#0095D8]  to-[#0259AB] p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="inner p-8">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Enter OTP
                    </h3>
                    <form className="space-y-5" onSubmit={handleOTPCheck}>
                        {/* Name */}
                        <div>
                            <label className="hidden text-sm font-medium text-gray-600 mb-1">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0259AB] focus:outline-none"

                            />
                            <button type="submit"
                                disabled={loading}
                                className={`${loading ? " bg-gray-400 text-white cursor-not-allowed" : "bg-[#0259AB] text-white  hover:bg-[#0978e0] cursor-pointer"} mt-4  w-full py-3 font-semibold rounded-xl transition-colors duration-300`}
                            >Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default OtpPage