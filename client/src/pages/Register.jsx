import React, { useEffect, useState } from "react";
import { registerForm } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";
import { NavLink, useNavigate } from "react-router";

const Register = () => {

  const dispatch = useDispatch();
  const { loading, registeredEmail } = useSelector(state => state.auth);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const safeError = (err) => {
    if (!err) return "Something went wrong";
    if (typeof err === "string") return err;
    if (err.message) return err.message;
    if (err.data?.message) return err.data.message;
    return "Something went wrong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.name || !form.email || !form.password) {
        toast.error("Please fill all the fields");
        return;
      }

      const data = await dispatch(registerForm(form)).unwrap();
      localStorage.setItem("pendingOtpEmail", form.email);
      toast.success(data.message);

      navigate("/otp", { state: { email: form.email } });
    } catch (error) {
      toast.error(safeError(error));
    }
  };

  const handleShowPass = () => {
    setShowPass(!showPass)
    console.log(showPass, "show")
  }


  return (

    <div className="register-container min-h-screen flex justify-center items-center bg-gradient-to-r from-[#0095D8]  to-[#0259AB] p-6">
      {
        loading && (
          <div className="fixed inset-0 bg-[rgba(0,_0,_0,_0.4)] flex items-center justify-center z-99">
            <ClipLoader color="#ffffff" size={25} />
          </div>
        )
      }
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="inner p-8">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Create your account
          </h3>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0259AB] focus:outline-none"
                value={form.name}
                name="name"
                onChange={handleChange}
              />
            </div>

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
              <div className="relative">
                <input
                  type={`${showPass ? "text" : "password"}`}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0259AB] focus:outline-none"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
                <span onClick={handleShowPass} className="absolute right-0 top-0 bottom-0 flex items-center mr-2 cursor-pointer">
                  {
                    showPass ? (
                      <FaRegEyeSlash />
                    ) : (
                      <FaRegEye />
                    )
                  }

                </span>
              </div>


            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`${loading ? " bg-gray-400 text-white cursor-not-allowed" : "bg-[#0259AB] text-white  hover:bg-[#0978e0] cursor-pointer"}  w-full py-3 font-semibold rounded-xl transition-colors duration-300`}
            >
              Register
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <NavLink to="/login" className="text-[#0259AB] font-medium hover:underline">
              Login
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
